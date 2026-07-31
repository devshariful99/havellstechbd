<?php

use App\Mail\ContactMailable;
use App\Models\Admin;
use App\Models\Setting;
use App\Services\SiteSettings;
use Illuminate\Support\Facades\Mail;

beforeEach(function () {
    $this->admin = Admin::factory()->create();
    app(SiteSettings::class)->flush();
});

afterEach(function () {
    app(SiteSettings::class)->flush();
});

test('guests cannot open site settings', function () {
    $this->get(route('admin.settings.edit'))
        ->assertRedirect(route('admin.login'));
});

test('admins can view site settings', function () {
    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.settings.edit'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('backend/Settings/Edit')
            ->has('settings.site_name')
            ->has('settings.primary_phone')
            ->has('settings.contact_email'));
});

test('admins can update site settings', function () {
    $this->actingAs($this->admin, 'admin')
        ->put(route('admin.settings.update'), [
            'site_name' => 'Techno Power BD',
            'site_tagline' => 'Industrial excellence',
            'primary_phone' => '01700000000',
            'primary_email' => 'hello@techno.test',
            'contact_email' => 'inbox@techno.test',
            'facebook_url' => 'https://facebook.com/techno',
            'twitter_url' => '',
            'linkedin_url' => 'https://linkedin.com/company/techno',
        ])
        ->assertRedirect(route('admin.settings.edit'))
        ->assertSessionHas('success');

    expect(Setting::query()->where('key', 'site_name')->value('value'))
        ->toBe('Techno Power BD');

    $settings = app(SiteSettings::class);

    expect($settings->get('site_name'))->toBe('Techno Power BD')
        ->and($settings->get('primary_phone'))->toBe('01700000000')
        ->and($settings->contactRecipient())->toBe('inbox@techno.test')
        ->and($settings->publicPayload()['social'])->toMatchArray([
            'facebook' => 'https://facebook.com/techno',
            'linkedin' => 'https://linkedin.com/company/techno',
        ]);
});

test('site settings validation rejects invalid emails and urls', function () {
    $this->actingAs($this->admin, 'admin')
        ->from(route('admin.settings.edit'))
        ->put(route('admin.settings.update'), [
            'site_name' => '',
            'site_tagline' => null,
            'primary_phone' => null,
            'primary_email' => 'not-an-email',
            'contact_email' => 'also-bad',
            'facebook_url' => 'not-a-url',
            'twitter_url' => null,
            'linkedin_url' => null,
        ])
        ->assertRedirect(route('admin.settings.edit'))
        ->assertSessionHasErrors([
            'site_name',
            'primary_email',
            'contact_email',
            'facebook_url',
        ]);
});

test('updated contact details are shared with inertia', function () {
    app(SiteSettings::class)->update([
        'site_name' => 'Shared Name',
        'primary_phone' => '0999888777',
        'primary_email' => 'public@techno.test',
        'facebook_url' => 'https://facebook.com/shared',
    ]);

    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.dashboard'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('name', 'Shared Name')
            ->where('contactDetails.phone', '0999888777')
            ->where('contactDetails.email', 'public@techno.test')
            ->where('contactDetails.social.facebook', 'https://facebook.com/shared'));
});

test('contact form mails the configured recipient', function () {
    Mail::fake();

    app(SiteSettings::class)->update([
        'contact_email' => 'forms@techno.test',
    ]);

    $this->post(route('contact.store'), [
        'name' => 'Visitor',
        'email' => 'visitor@example.com',
        'phone' => '01711111111',
        'message' => 'Hello from the contact form.',
    ])->assertRedirect();

    Mail::assertQueued(ContactMailable::class, function ($mail) {
        return $mail->hasTo('forms@techno.test');
    });
});
