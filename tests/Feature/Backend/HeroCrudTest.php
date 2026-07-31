<?php

use App\Models\Admin;
use App\Models\Hero;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;

beforeEach(function () {
    $this->admin = Admin::factory()->create();

    // Hero images are moved into the public directory, so redirect them at a
    // disposable folder for the duration of the test.
    $this->heroDirectory = 'images/testing-heroes';
    config()->set('media.hero_directory', $this->heroDirectory);
});

afterEach(function () {
    File::deleteDirectory(public_path($this->heroDirectory));
});

test('guests cannot reach the hero admin screens', function () {
    $this->get(route('admin.hero.index'))->assertRedirect(route('admin.login'));
    $this->get(route('admin.hero.create'))->assertRedirect(route('admin.login'));
});

test('admins can list heroes', function () {
    Hero::factory()->count(3)->create();

    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.hero.index'))
        ->assertOk();
});

test('heroes can be searched and sorted by subtitle', function () {
    Hero::factory()->create(['title' => 'Alpha', 'subtitle' => 'Findable subtitle']);
    Hero::factory()->create(['title' => 'Beta', 'subtitle' => 'Something else']);

    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.hero.index', [
            'search' => 'Findable',
            'sort_by' => 'subtitle',
            'sort_order' => 'desc',
        ]))
        ->assertOk();
});

test('admins can create a hero', function () {
    $this->actingAs($this->admin, 'admin')
        ->post(route('admin.hero.store'), [
            'title' => 'Powering Industry',
            'subtitle' => 'Since 1998',
            'image' => UploadedFile::fake()->image('hero.jpg'),
        ])
        ->assertRedirect(route('admin.hero.index'))
        ->assertSessionHas('success');

    $hero = Hero::sole();

    expect($hero->title)->toBe('Powering Industry')
        ->and($hero->subtitle)->toBe('Since 1998')
        ->and($hero->image)->toStartWith($this->heroDirectory.'/');

    expect(File::isFile(public_path($hero->image)))->toBeTrue();
});

test('creating a hero requires an image', function () {
    $this->actingAs($this->admin, 'admin')
        ->post(route('admin.hero.store'), ['title' => 'No image'])
        ->assertSessionHasErrors('image');

    expect(Hero::count())->toBe(0);
});

test('a hero can be updated without re-uploading the image', function () {
    $hero = Hero::factory()->create([
        'title' => 'Original',
        'image' => $this->heroDirectory.'/keep-me.jpg',
    ]);

    $this->actingAs($this->admin, 'admin')
        ->post(route('admin.hero.update', $hero->id), [
            'title' => 'Renamed',
            'subtitle' => 'Updated subtitle',
        ])
        ->assertRedirect(route('admin.hero.index'))
        ->assertSessionHasNoErrors();

    $hero->refresh();

    expect($hero->title)->toBe('Renamed')
        ->and($hero->image)->toBe($this->heroDirectory.'/keep-me.jpg');
});

test('replacing a hero image deletes the previous file', function () {
    File::ensureDirectoryExists(public_path($this->heroDirectory));
    File::put(public_path($this->heroDirectory.'/old.jpg'), 'old-contents');

    $hero = Hero::factory()->create(['image' => $this->heroDirectory.'/old.jpg']);

    $this->actingAs($this->admin, 'admin')
        ->post(route('admin.hero.update', $hero->id), [
            'title' => 'Replaced',
            'image' => UploadedFile::fake()->image('new.jpg'),
        ])
        ->assertSessionHasNoErrors();

    expect(File::isFile(public_path($this->heroDirectory.'/old.jpg')))->toBeFalse()
        ->and($hero->refresh()->image)->not->toBe($this->heroDirectory.'/old.jpg');
});

test('a hero image can be removed', function () {
    File::ensureDirectoryExists(public_path($this->heroDirectory));
    File::put(public_path($this->heroDirectory.'/remove-me.jpg'), 'contents');

    $hero = Hero::factory()->create(['image' => $this->heroDirectory.'/remove-me.jpg']);

    $this->actingAs($this->admin, 'admin')
        ->post(route('admin.hero.update', $hero->id), [
            'title' => 'Image gone',
            'remove_image' => '1',
        ])
        ->assertSessionHasNoErrors();

    expect($hero->refresh()->image)->toBeNull()
        ->and(File::isFile(public_path($this->heroDirectory.'/remove-me.jpg')))->toBeFalse();
});

test('deleting a hero removes its image from disk', function () {
    File::ensureDirectoryExists(public_path($this->heroDirectory));
    File::put(public_path($this->heroDirectory.'/doomed.jpg'), 'contents');

    $hero = Hero::factory()->create(['image' => $this->heroDirectory.'/doomed.jpg']);

    $this->actingAs($this->admin, 'admin')
        ->delete(route('admin.hero.delete', $hero->id))
        ->assertRedirect(route('admin.hero.index'));

    expect(Hero::count())->toBe(0)
        ->and(File::isFile(public_path($this->heroDirectory.'/doomed.jpg')))->toBeFalse();
});

test('heroes cannot be deleted with a GET request', function () {
    $hero = Hero::factory()->create();

    $this->actingAs($this->admin, 'admin')
        ->get('/admin/hero/delete/'.$hero->id)
        ->assertMethodNotAllowed();

    expect(Hero::count())->toBe(1);
});
