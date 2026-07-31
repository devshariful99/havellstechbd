<?php

use App\Models\Admin;
use App\Models\Product;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    $this->admin = Admin::factory()->create();
    Storage::fake('public');
});

test('guests cannot reach the product admin screens', function () {
    $this->get(route('admin.product.index'))->assertRedirect(route('admin.login'));
});

test('admins can list products', function () {
    Product::factory()->count(3)->create();

    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.product.index'))
        ->assertOk();
});

test('admins can create a product with a pdf and an image', function () {
    $this->actingAs($this->admin, 'admin')
        ->post(route('admin.product.store'), [
            'title' => 'Diesel Generator',
            'file' => UploadedFile::fake()->create('spec.pdf', 120, 'application/pdf'),
            'image' => UploadedFile::fake()->image('generator.jpg'),
        ])
        ->assertRedirect(route('admin.product.index'))
        ->assertSessionHas('success');

    $product = Product::sole();

    expect($product->title)->toBe('Diesel Generator');

    Storage::disk('public')->assertExists($product->file);
    Storage::disk('public')->assertExists($product->image);
});

test('a product title is required', function () {
    $this->actingAs($this->admin, 'admin')
        ->post(route('admin.product.store'), [])
        ->assertSessionHasErrors('title');

    expect(Product::count())->toBe(0);
});

test('only pdf files are accepted for a product', function () {
    $this->actingAs($this->admin, 'admin')
        ->post(route('admin.product.store'), [
            'title' => 'Bad upload',
            'file' => UploadedFile::fake()->create('notes.txt', 10, 'text/plain'),
        ])
        ->assertSessionHasErrors('file');
});

test('replacing a product pdf deletes the previous file', function () {
    Storage::disk('public')->put('products/files/old.pdf', 'old');
    $product = Product::factory()->create(['file' => 'products/files/old.pdf']);

    $this->actingAs($this->admin, 'admin')
        ->post(route('admin.product.update', $product->id), [
            'title' => 'Updated',
            'file' => UploadedFile::fake()->create('new.pdf', 100, 'application/pdf'),
        ])
        ->assertSessionHasNoErrors();

    Storage::disk('public')->assertMissing('products/files/old.pdf');
    Storage::disk('public')->assertExists($product->refresh()->file);
});

test('a product pdf can be removed', function () {
    Storage::disk('public')->put('products/files/remove.pdf', 'contents');
    $product = Product::factory()->create(['file' => 'products/files/remove.pdf']);

    $this->actingAs($this->admin, 'admin')
        ->post(route('admin.product.update', $product->id), [
            'title' => 'No file',
            'remove_file' => '1',
        ])
        ->assertSessionHasNoErrors();

    expect($product->refresh()->file)->toBeNull();
    Storage::disk('public')->assertMissing('products/files/remove.pdf');
});

test('a product image can be removed', function () {
    Storage::disk('public')->put('products/images/remove.jpg', 'contents');
    $product = Product::factory()->create(['image' => 'products/images/remove.jpg']);

    $this->actingAs($this->admin, 'admin')
        ->post(route('admin.product.update', $product->id), [
            'title' => 'No image',
            'remove_image' => '1',
        ])
        ->assertSessionHasNoErrors();

    expect($product->refresh()->image)->toBeNull();
});

test('admins can view a product', function () {
    $product = Product::factory()->create();

    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.product.view', $product->id))
        ->assertOk();
});

test('deleting a product removes its files from disk', function () {
    Storage::disk('public')->put('products/files/doomed.pdf', 'contents');
    Storage::disk('public')->put('products/images/doomed.jpg', 'contents');

    $product = Product::factory()->create([
        'file' => 'products/files/doomed.pdf',
        'image' => 'products/images/doomed.jpg',
    ]);

    $this->actingAs($this->admin, 'admin')
        ->delete(route('admin.product.destroy', $product->id))
        ->assertRedirect(route('admin.product.index'));

    expect(Product::count())->toBe(0);
    Storage::disk('public')->assertMissing('products/files/doomed.pdf');
    Storage::disk('public')->assertMissing('products/images/doomed.jpg');
});
