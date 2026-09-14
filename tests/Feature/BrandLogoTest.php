<?php

test('the public brand logo file is available', function () {
    expect(file_exists(public_path('logo.jpeg')))->toBeTrue();
});

test('the application shell uses the brand logo as favicon', function () {
    $this->get(route('home'))
        ->assertOk()
        ->assertSee('href="/logo.jpeg"', false)
        ->assertSee('type="image/jpeg"', false);
});

test('admin login page uses the brand logo favicon', function () {
    $this->get(route('admin.login'))
        ->assertOk()
        ->assertSee('href="/logo.jpeg"', false);
});
