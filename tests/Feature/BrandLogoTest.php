<?php

use App\Services\SiteSettings;

test('the public brand logo file is available', function () {
    expect(file_exists(public_path('logo.jpeg')))->toBeTrue();
});

test('the application shell uses the brand logo as favicon', function () {
    $this->get(route('home'))
        ->assertOk()
        ->assertSee('href="'.SiteSettings::DEFAULT_LOGO_PATH.'"', false)
        ->assertInertia(fn ($page) => $page
            ->where('contactDetails.logo_url', SiteSettings::DEFAULT_LOGO_PATH));
});

test('admin login page uses the brand logo favicon', function () {
    $this->get(route('admin.login'))
        ->assertOk()
        ->assertSee('href="'.SiteSettings::DEFAULT_LOGO_PATH.'"', false);
});
