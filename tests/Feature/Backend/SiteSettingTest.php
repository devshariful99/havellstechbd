<?php

use App\Mail\ContactMailable;
use App\Models\Admin;
use App\Models\Setting;
use App\Services\SiteSettings;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Mail;

beforeEach(function () {
    $this->admin = Admin::factory()->create();
    app(SiteSettings::class)->flush();
    config(['media.logo_directory' => 'testing/site-logos']);
});

afterEach(function () {
    app(SiteSettings::class)->flush();
    File::deleteDirectory(public_path('testing/site-logos'));
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
            ->has('settings.contact_email')
            ->has('logoUrl')
            ->where('hasCustomLogo', false)
            ->where('logoUrl', SiteSettings::DEFAULT_LOGO_PATH));
});

test('admins can update site settings', function () {
    $this->actingAs($this->admin, 'admin')
        ->post(route('admin.settings.update'), [
            'site_name' => 'Techno Power BD',
            'site_tagline' => 'Industrial excellence',
            'site_description' => 'Techno Power BD supplies industrial electrical systems across Bangladesh.',
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
        ->and($settings->get('site_description'))->toBe('Techno Power BD supplies industrial electrical systems across Bangladesh.')
        ->and($settings->get('primary_phone'))->toBe('01700000000')
        ->and($settings->contactRecipient())->toBe('inbox@techno.test')
        ->and($settings->publicPayload()['social'])->toMatchArray([
            'facebook' => 'https://facebook.com/techno',
            'linkedin' => 'https://linkedin.com/company/techno',
        ]);
});

test('admins can upload a custom site logo', function () {
    $logo = UploadedFile::fake()->image('brand-logo.png', 400, 200);

    $this->actingAs($this->admin, 'admin')
        ->post(route('admin.settings.update'), [
            'site_name' => 'HavellsTech Power Engineering',
            'site_tagline' => 'Always with quality',
            'logo' => $logo,
        ])
        ->assertRedirect(route('admin.settings.edit'))
        ->assertSessionHas('success');

    $storedPath = Setting::query()->where('key', 'site_logo')->value('value');

    expect($storedPath)->not->toBeNull()
        ->and(File::isFile(public_path($storedPath)))->toBeTrue();

    $logoUrl = app(SiteSettings::class)->logoUrl();

    expect($logoUrl)->toStartWith('/testing/site-logos/')
        ->and(app(SiteSettings::class)->publicPayload()['logo_url'])->toBe($logoUrl);

    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.settings.edit'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('hasCustomLogo', true)
            ->where('logoUrl', $logoUrl));

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->where('contactDetails.logo_url', $logoUrl))
        ->assertSee('href="'.$logoUrl.'"', false);
});

test('admins can remove a custom site logo and fall back to the default', function () {
    $logo = UploadedFile::fake()->image('remove-me.jpg', 200, 100);

    $this->actingAs($this->admin, 'admin')
        ->post(route('admin.settings.update'), [
            'site_name' => 'HavellsTech Power Engineering',
            'logo' => $logo,
        ])
        ->assertRedirect(route('admin.settings.edit'));

    $storedPath = Setting::query()->where('key', 'site_logo')->value('value');
    expect(File::isFile(public_path($storedPath)))->toBeTrue();

    $this->actingAs($this->admin, 'admin')
        ->post(route('admin.settings.update'), [
            'site_name' => 'HavellsTech Power Engineering',
            'remove_logo' => '1',
        ])
        ->assertRedirect(route('admin.settings.edit'));

    expect(Setting::query()->where('key', 'site_logo')->value('value'))->toBeNull()
        ->and(File::isFile(public_path($storedPath)))->toBeFalse()
        ->and(app(SiteSettings::class)->logoUrl())->toBe(SiteSettings::DEFAULT_LOGO_PATH);
});

test('site settings reject non image logo uploads', function () {
    $this->actingAs($this->admin, 'admin')
        ->from(route('admin.settings.edit'))
        ->post(route('admin.settings.update'), [
            'site_name' => 'HavellsTech Power Engineering',
            'logo' => UploadedFile::fake()->create('notes.txt', 10, 'text/plain'),
        ])
        ->assertRedirect(route('admin.settings.edit'))
        ->assertSessionHasErrors(['logo']);
});

test('missing logo files fall back to the default brand asset', function () {
    app(SiteSettings::class)->update([
        'site_logo' => 'testing/site-logos/missing-logo.png',
    ]);

    expect(app(SiteSettings::class)->hasCustomLogo())->toBeFalse()
        ->and(app(SiteSettings::class)->logoUrl())->toBe(SiteSettings::DEFAULT_LOGO_PATH);

    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.settings.edit'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('hasCustomLogo', false)
            ->where('logoUrl', SiteSettings::DEFAULT_LOGO_PATH));
});

test('site settings validation rejects invalid emails and urls', function () {
    $this->actingAs($this->admin, 'admin')
        ->from(route('admin.settings.edit'))
        ->post(route('admin.settings.update'), [
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
        'site_description' => 'Shared SEO description for search engines.',
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
            ->where('contactDetails.site_description', 'Shared SEO description for search engines.')
            ->where('contactDetails.logo_url', SiteSettings::DEFAULT_LOGO_PATH)
            ->where('contactDetails.social.facebook', 'https://facebook.com/shared'));
});

test('the home page html includes brand title and seo description', function () {
    app(SiteSettings::class)->update([
        'site_name' => 'HavellsTech Power Engineering',
        'site_description' => 'HavellsTech Power Engineering delivers industrial electrical products and certified engineering solutions across Bangladesh.',
    ]);

    $this->get(route('home'))
        ->assertOk()
        ->assertSee('<title inertia>HavellsTech Power Engineering</title>', false)
        ->assertSee(
            'HavellsTech Power Engineering delivers industrial electrical products and certified engineering solutions across Bangladesh.',
            false,
        )
        ->assertDontSee('Laravel: Home', false)
        ->assertDontSee('>Laravel</title>', false);
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
