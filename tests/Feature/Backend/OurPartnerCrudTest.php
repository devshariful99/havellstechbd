<?php

use App\Models\Admin;
use App\Models\OurPartner;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;

beforeEach(function () {
    $this->admin = Admin::factory()->create();

    $this->partnerDirectory = 'images/testing-partners';
    config()->set('media.partner_directory', $this->partnerDirectory);
});

afterEach(function () {
    File::deleteDirectory(public_path($this->partnerDirectory));
});

test('guests cannot reach the partner admin screens', function () {
    $this->get(route('admin.our-partner.index'))->assertRedirect(route('admin.login'));
});

test('admins can list partners', function () {
    OurPartner::factory()->count(3)->create();

    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.our-partner.index'))
        ->assertOk();
});

test('admins can create a partner', function () {
    $this->actingAs($this->admin, 'admin')
        ->post(route('admin.our-partner.store'), [
            'title' => 'Caterpillar',
            'image' => UploadedFile::fake()->image('logo.png'),
        ])
        ->assertRedirect(route('admin.our-partner.index'))
        ->assertSessionHas('success');

    $partner = OurPartner::sole();

    expect($partner->title)->toBe('Caterpillar')
        ->and($partner->image)->toStartWith($this->partnerDirectory.'/');

    expect(File::isFile(public_path($partner->image)))->toBeTrue();
});

test('creating a partner requires an image', function () {
    $this->actingAs($this->admin, 'admin')
        ->post(route('admin.our-partner.store'), ['title' => 'No logo'])
        ->assertSessionHasErrors('image');

    expect(OurPartner::count())->toBe(0);
});

test('a partner can be updated without re-uploading the logo', function () {
    $partner = OurPartner::factory()->create([
        'title' => 'Original',
        'image' => $this->partnerDirectory.'/keep-me.png',
    ]);

    $this->actingAs($this->admin, 'admin')
        ->post(route('admin.our-partner.update', $partner->id), ['title' => 'Renamed'])
        ->assertRedirect(route('admin.our-partner.index'))
        ->assertSessionHasNoErrors();

    $partner->refresh();

    expect($partner->title)->toBe('Renamed')
        ->and($partner->image)->toBe($this->partnerDirectory.'/keep-me.png');
});

test('a partner logo can be removed', function () {
    File::ensureDirectoryExists(public_path($this->partnerDirectory));
    File::put(public_path($this->partnerDirectory.'/remove-me.png'), 'contents');

    $partner = OurPartner::factory()->create([
        'image' => $this->partnerDirectory.'/remove-me.png',
    ]);

    $this->actingAs($this->admin, 'admin')
        ->post(route('admin.our-partner.update', $partner->id), [
            'title' => 'No logo',
            'remove_image' => '1',
        ])
        ->assertSessionHasNoErrors();

    expect($partner->refresh()->image)->toBeNull()
        ->and(File::isFile(public_path($this->partnerDirectory.'/remove-me.png')))->toBeFalse();
});

test('deleting a partner removes its logo from disk', function () {
    File::ensureDirectoryExists(public_path($this->partnerDirectory));
    File::put(public_path($this->partnerDirectory.'/doomed.png'), 'contents');

    $partner = OurPartner::factory()->create([
        'image' => $this->partnerDirectory.'/doomed.png',
    ]);

    $this->actingAs($this->admin, 'admin')
        ->delete(route('admin.our-partner.delete', $partner->id))
        ->assertRedirect(route('admin.our-partner.index'));

    expect(OurPartner::count())->toBe(0)
        ->and(File::isFile(public_path($this->partnerDirectory.'/doomed.png')))->toBeFalse();
});
