<?php

use App\Models\Admin;
use App\Models\ContactPageSetting;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;

beforeEach(function () {
    $this->admin = Admin::factory()->create();
    ContactPageSetting::flushPublicCache();

    $this->contactDirectory = 'images/testing-contact';
    config()->set('media.contact_directory', $this->contactDirectory);
});

afterEach(function () {
    ContactPageSetting::flushPublicCache();
    File::deleteDirectory(public_path($this->contactDirectory));
});

test('guests cannot manage the contact page', function () {
    $this->get(route('admin.contact-page.edit'))->assertRedirect(route('admin.login'));
});

test('admins can view the contact page editor with defaults excluding feni and uae', function () {
    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.contact-page.edit'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('backend/ContactPage/Edit')
            ->has('settings.offices', 3)
            ->where('settings.offices.0.title', 'Corporate Office')
            ->where('settings.offices.1.title', 'Factory')
            ->where('settings.offices.2.title', 'Wire House'));

    $titles = collect(ContactPageSetting::current()->offices)->pluck('title');

    expect($titles)->not->toContain('Feni Office')
        ->and($titles)->not->toContain('Uae Office');
});

test('admins can update contact page settings including offices and phones', function () {
    ContactPageSetting::current();

    $this->actingAs($this->admin, 'admin')
        ->post(route('admin.contact-page.update'), [
            'hero_title' => 'Get In Touch',
            'hero_breadcrumb' => 'Reach Us',
            'hero_image_alt' => 'Updated banner',
            'map_embed_url' => ContactPageSetting::DEFAULT_MAP_EMBED_URL,
            'map_height' => 500,
            'offices' => [
                [
                    'title' => 'Head Office',
                    'lines' => "Line A\nLine B",
                ],
            ],
            'phones' => [
                [
                    'title' => 'Support',
                    'lines' => "+880111\n+880222",
                ],
            ],
            'form_name_placeholder' => 'Full name',
            'form_email_placeholder' => 'Work email',
            'form_phone_placeholder' => 'Mobile',
            'form_message_placeholder' => 'How can we help?',
            'form_submit_label' => 'Send',
            'form_success_message' => 'Thanks for reaching out!',
        ])
        ->assertRedirect(route('admin.contact-page.edit'))
        ->assertSessionHas('success');

    $settings = ContactPageSetting::current()->fresh();

    expect($settings->hero_title)->toBe('Get In Touch')
        ->and($settings->hero_breadcrumb)->toBe('Reach Us')
        ->and($settings->map_height)->toBe(500)
        ->and($settings->offices)->toBe([
            ['title' => 'Head Office', 'lines' => ['Line A', 'Line B']],
        ])
        ->and($settings->phones)->toBe([
            ['title' => 'Support', 'lines' => ['+880111', '+880222']],
        ])
        ->and($settings->form_submit_label)->toBe('Send');
});

test('contact page update validates the map embed url and required fields', function () {
    ContactPageSetting::current();

    $this->actingAs($this->admin, 'admin')
        ->from(route('admin.contact-page.edit'))
        ->post(route('admin.contact-page.update'), [
            'hero_title' => '',
            'hero_breadcrumb' => '',
            'map_embed_url' => 'https://example.com/not-a-map',
            'map_height' => 50,
            'form_name_placeholder' => '',
            'form_email_placeholder' => '',
            'form_phone_placeholder' => '',
            'form_message_placeholder' => '',
            'form_submit_label' => '',
            'form_success_message' => '',
        ])
        ->assertRedirect(route('admin.contact-page.edit'))
        ->assertSessionHasErrors([
            'hero_title',
            'hero_breadcrumb',
            'map_embed_url',
            'map_height',
            'form_name_placeholder',
            'form_email_placeholder',
            'form_phone_placeholder',
            'form_message_placeholder',
            'form_submit_label',
            'form_success_message',
        ]);
});

test('admins can replace and remove the contact banner image', function () {
    $settings = ContactPageSetting::current();

    $this->actingAs($this->admin, 'admin')
        ->post(route('admin.contact-page.update'), validContactPagePayload([
            'hero_image' => UploadedFile::fake()->image('banner.jpg'),
        ]))
        ->assertRedirect(route('admin.contact-page.edit'));

    $settings->refresh();

    expect($settings->hero_image)->toStartWith($this->contactDirectory.'/');
    expect(File::isFile(public_path($settings->hero_image)))->toBeTrue();

    $previousImage = $settings->hero_image;

    $this->actingAs($this->admin, 'admin')
        ->post(route('admin.contact-page.update'), validContactPagePayload([
            'remove_hero_image' => '1',
        ]))
        ->assertRedirect(route('admin.contact-page.edit'));

    $settings->refresh();

    expect($settings->hero_image)->toBeNull()
        ->and(File::isFile(public_path($previousImage)))->toBeFalse();
});

test('the public contact page uses managed settings without feni or uae offices', function () {
    ContactPageSetting::current();

    $this->get(route('contact'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('frontend/contact')
            ->has('contactData.offices', 3)
            ->where('contactData.hero_title', 'Contact Us')
            ->where('contactData.offices.0.title', 'Corporate Office')
            ->has('contactData.phones')
            ->has('contactData.map_embed_url')
            ->has('contactData.form_submit_label'));

    $titles = collect(ContactPageSetting::publicPayload()['offices'])
        ->pluck('title')
        ->map(fn (string $title) => strtolower($title));

    expect($titles->contains(fn (string $title) => str_contains($title, 'feni')))->toBeFalse()
        ->and($titles->contains(fn (string $title) => str_contains($title, 'uae')))->toBeFalse();
});

/**
 * @param  array<string, mixed>  $overrides
 * @return array<string, mixed>
 */
function validContactPagePayload(array $overrides = []): array
{
    return array_merge([
        'hero_title' => 'Contact Us',
        'hero_breadcrumb' => 'Contact Us',
        'hero_image_alt' => 'Contact banner',
        'map_embed_url' => ContactPageSetting::DEFAULT_MAP_EMBED_URL,
        'map_height' => 450,
        'offices' => [
            ['title' => 'Corporate Office', 'lines' => "Line 1\nLine 2"],
        ],
        'phones' => [
            ['title' => 'Help Line', 'lines' => '096 96 62 83 422'],
        ],
        'form_name_placeholder' => 'Your Name',
        'form_email_placeholder' => 'Your Email',
        'form_phone_placeholder' => 'Phone Number',
        'form_message_placeholder' => 'Message',
        'form_submit_label' => 'Submit',
        'form_success_message' => 'Message sent successfully!',
    ], $overrides);
}
