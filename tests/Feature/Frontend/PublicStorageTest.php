<?php

use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('public');
});

test('public disk files are served through the storage fallback route', function () {
    Storage::disk('public')->put('products/files/brochure.pdf', '%PDF-1.4 fake');

    $this->get('/storage/products/files/brochure.pdf')
        ->assertOk()
        ->assertHeader('content-type', 'application/pdf');
});

test('missing public disk files return not found', function () {
    $this->get('/storage/products/files/missing.pdf')->assertNotFound();
});

test('path traversal attempts are rejected', function () {
    Storage::disk('public')->put('products/files/safe.pdf', 'safe');

    $this->get('/storage/../.env')->assertNotFound();
});
