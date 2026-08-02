<?php

use App\Models\Admin;
use App\Models\Approved;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    $this->admin = Admin::factory()->create();
    Storage::fake('public');
});

test('guests cannot reach the approved admin screens', function () {
    $this->get(route('admin.approved.index'))->assertRedirect(route('admin.login'));
});

test('admins can list approved certificates', function () {
    Approved::factory()->count(3)->create();

    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.approved.index'))
        ->assertOk();
});

test('admins can create an approved certificate', function () {
    $this->actingAs($this->admin, 'admin')
        ->post(route('admin.approved.store'), [
            'title' => 'ISO 9001',
            'file' => UploadedFile::fake()->create('cert.pdf', 100, 'application/pdf'),
            'image' => UploadedFile::fake()->image('cert.jpg'),
            'link' => 'https://example.com/iso',
        ])
        ->assertRedirect(route('admin.approved.index'))
        ->assertSessionHas('success');

    $approved = Approved::sole();

    expect($approved->title)->toBe('ISO 9001')
        ->and($approved->link)->toBe('https://example.com/iso');
    Storage::disk('public')->assertExists($approved->file);
    Storage::disk('public')->assertExists($approved->image);
});

test('an approved certificate requires an image but not a pdf', function () {
    $this->actingAs($this->admin, 'admin')
        ->post(route('admin.approved.store'), ['title' => 'Incomplete'])
        ->assertSessionHasErrors(['image'])
        ->assertSessionDoesntHaveErrors(['file']);

    expect(Approved::count())->toBe(0);
});

test('admins can create an approved certificate with only an image', function () {
    $this->actingAs($this->admin, 'admin')
        ->post(route('admin.approved.store'), [
            'image' => UploadedFile::fake()->image('badge.jpg'),
        ])
        ->assertRedirect(route('admin.approved.index'))
        ->assertSessionHas('success');

    $approved = Approved::sole();

    expect($approved->title)->toBeNull()
        ->and($approved->file)->toBeNull()
        ->and($approved->link)->toBeNull();
    Storage::disk('public')->assertExists($approved->image);
});

test('an approved certificate can be updated without re-uploading files', function () {
    $approved = Approved::factory()->create([
        'title' => 'Original',
        'file' => 'approved/files/keep.pdf',
        'image' => 'approved/images/keep.jpg',
    ]);

    $this->actingAs($this->admin, 'admin')
        ->post(route('admin.approved.update', $approved->id), ['title' => 'Renamed'])
        ->assertSessionHasNoErrors();

    $approved->refresh();

    expect($approved->title)->toBe('Renamed')
        ->and($approved->file)->toBe('approved/files/keep.pdf')
        ->and($approved->image)->toBe('approved/images/keep.jpg');
});

test('an approved pdf can be removed', function () {
    Storage::disk('public')->put('approved/files/remove.pdf', 'contents');
    $approved = Approved::factory()->create(['file' => 'approved/files/remove.pdf']);

    $this->actingAs($this->admin, 'admin')
        ->post(route('admin.approved.update', $approved->id), [
            'title' => 'No file',
            'remove_file' => '1',
        ])
        ->assertSessionHasNoErrors();

    expect($approved->refresh()->file)->toBeNull();
    Storage::disk('public')->assertMissing('approved/files/remove.pdf');
});

test('admins can view an approved certificate', function () {
    $approved = Approved::factory()->create();

    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.approved.view', $approved->id))
        ->assertOk();
});

test('deleting an approved certificate removes its files from disk', function () {
    Storage::disk('public')->put('approved/files/doomed.pdf', 'contents');
    Storage::disk('public')->put('approved/images/doomed.jpg', 'contents');

    $approved = Approved::factory()->create([
        'file' => 'approved/files/doomed.pdf',
        'image' => 'approved/images/doomed.jpg',
    ]);

    $this->actingAs($this->admin, 'admin')
        ->delete(route('admin.approved.destroy', $approved->id))
        ->assertRedirect(route('admin.approved.index'));

    expect(Approved::count())->toBe(0);
    Storage::disk('public')->assertMissing('approved/files/doomed.pdf');
    Storage::disk('public')->assertMissing('approved/images/doomed.jpg');
});
