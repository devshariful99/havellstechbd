<?php

use App\Models\Admin;
use App\Models\Header;
use App\Models\SubMenu;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    $this->admin = Admin::factory()->create();
    Storage::fake('public');
});

test('guests cannot reach the sub-menu admin screens', function () {
    $this->get(route('admin.submenu.index'))->assertRedirect(route('admin.login'));
});

test('admins can list sub-menus', function () {
    SubMenu::factory()->count(3)->create();

    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.submenu.index'))
        ->assertOk();
});

test('sub-menus can be filtered by header', function () {
    $header = Header::factory()->create();
    SubMenu::factory()->forHeader($header)->create();
    SubMenu::factory()->create();

    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.submenu.index', ['filters' => ['header_id' => $header->id]]))
        ->assertOk();
});

test('admins can create a sub-menu', function () {
    $header = Header::factory()->create();

    $this->actingAs($this->admin, 'admin')
        ->post(route('admin.submenu.store'), [
            'header_id' => $header->id,
            'name' => 'Company Profile',
            'file' => UploadedFile::fake()->create('profile.pdf', 100, 'application/pdf'),
        ])
        ->assertRedirect(route('admin.submenu.index'))
        ->assertSessionHas('success');

    $subMenu = SubMenu::sole();

    expect($subMenu->name)->toBe('Company Profile')
        ->and($subMenu->header_id)->toBe($header->id);

    Storage::disk('public')->assertExists($subMenu->file);
});

test('a sub-menu requires a valid header and a pdf', function () {
    $this->actingAs($this->admin, 'admin')
        ->post(route('admin.submenu.store'), [
            'header_id' => 9999,
            'name' => 'Orphan',
        ])
        ->assertSessionHasErrors(['header_id', 'file']);

    expect(SubMenu::count())->toBe(0);
});

test('a sub-menu can be updated without re-uploading the pdf', function () {
    $subMenu = SubMenu::factory()->create([
        'name' => 'Original',
        'file' => 'submenus/keep.pdf',
    ]);

    $this->actingAs($this->admin, 'admin')
        ->post(route('admin.submenu.update', $subMenu->id), [
            'header_id' => $subMenu->header_id,
            'name' => 'Renamed',
        ])
        ->assertSessionHasNoErrors();

    $subMenu->refresh();

    expect($subMenu->name)->toBe('Renamed')
        ->and($subMenu->file)->toBe('submenus/keep.pdf');
});

test('replacing a sub-menu pdf deletes the previous file', function () {
    Storage::disk('public')->put('submenus/old.pdf', 'old');
    $subMenu = SubMenu::factory()->create(['file' => 'submenus/old.pdf']);

    $this->actingAs($this->admin, 'admin')
        ->post(route('admin.submenu.update', $subMenu->id), [
            'header_id' => $subMenu->header_id,
            'name' => $subMenu->name,
            'file' => UploadedFile::fake()->create('new.pdf', 100, 'application/pdf'),
        ])
        ->assertSessionHasNoErrors();

    Storage::disk('public')->assertMissing('submenus/old.pdf');
});

test('admins can clear a sub-menu pdf without uploading a replacement', function () {
    Storage::disk('public')->put('submenus/clear-me.pdf', 'contents');
    $subMenu = SubMenu::factory()->create(['file' => 'submenus/clear-me.pdf']);

    $this->actingAs($this->admin, 'admin')
        ->post(route('admin.submenu.update', $subMenu->id), [
            'header_id' => $subMenu->header_id,
            'name' => $subMenu->name,
            'remove_file' => '1',
        ])
        ->assertSessionHasNoErrors();

    $subMenu->refresh();

    expect($subMenu->file)->toBeNull();
    Storage::disk('public')->assertMissing('submenus/clear-me.pdf');
});

test('admins can view a sub-menu', function () {
    $subMenu = SubMenu::factory()->create();

    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.submenu.view', $subMenu->id))
        ->assertOk();
});

test('admins can delete a sub-menu', function () {
    Storage::disk('public')->put('submenus/doomed.pdf', 'contents');
    $subMenu = SubMenu::factory()->create(['file' => 'submenus/doomed.pdf']);

    $this->actingAs($this->admin, 'admin')
        ->delete(route('admin.submenu.destroy', $subMenu->id))
        ->assertRedirect(route('admin.submenu.index'));

    expect(SubMenu::count())->toBe(0);
    Storage::disk('public')->assertMissing('submenus/doomed.pdf');
});
