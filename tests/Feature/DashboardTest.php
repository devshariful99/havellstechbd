<?php

use App\Models\User;

test('guests are redirected to the login page', function () {
    // Guests are sent to the admin login screen, per `redirectGuestsTo` in
    // bootstrap/app.php.
    $this->get(route('dashboard'))->assertRedirect(route('admin.login'));
});

test('authenticated users can visit the dashboard', function () {
    $this->actingAs(User::factory()->create());

    $this->get(route('dashboard'))->assertOk();
});
