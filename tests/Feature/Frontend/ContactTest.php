<?php

use App\Mail\ContactMailable;
use App\Models\Contact;
use App\Models\ContactPageSetting;
use Illuminate\Support\Facades\Mail;

beforeEach(function () {
    ContactPageSetting::flushPublicCache();
});

afterEach(function () {
    ContactPageSetting::flushPublicCache();
});

test('the contact page renders with managed office details', function () {
    ContactPageSetting::current();

    $this->get(route('contact'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('frontend/contact')
            ->has('contactData.offices', 3)
            ->has('contactData.phones')
            ->has('contactData.hero_title')
            ->has('contactData.map_embed_url')
            ->where('contactData.offices.0.title', 'Corporate Office')
            ->where('contactData.offices.1.title', 'Factory')
            ->where('contactData.offices.2.title', 'Wire House'));
});

test('the contact page omits office and phone titles that have no detail lines', function () {
    ContactPageSetting::current()->update([
        'offices' => [
            [
                'title' => 'Corporate Office',
                'lines' => ['Sheba Nurjahan Eyecon Center', 'Dhaka 1000'],
            ],
            [
                'title' => 'Wire House',
                'lines' => [],
            ],
        ],
        'phones' => [
            [
                'title' => 'Help Line',
                'lines' => ['096 96 62 83 422'],
            ],
            [
                'title' => 'Hotline',
                'lines' => [''],
            ],
        ],
    ]);

    ContactPageSetting::flushPublicCache();

    $this->get(route('contact'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('frontend/contact')
            ->has('contactData.offices', 1)
            ->has('contactData.phones', 1)
            ->where('contactData.offices.0.title', 'Corporate Office')
            ->where('contactData.phones.0.title', 'Help Line'));
});

test('a visitor can submit the contact form', function () {
    Mail::fake();
    ContactPageSetting::current();

    $this->post(route('contact.store'), [
        'name' => 'Rahim Uddin',
        'email' => 'rahim@example.com',
        'phone' => '+8801711223344',
        'message' => 'Please send me a quotation.',
    ])->assertSessionHas('success');

    $contact = Contact::sole();

    expect($contact->name)->toBe('Rahim Uddin')
        ->and($contact->email)->toBe('rahim@example.com')
        ->and($contact->read_at)->toBeNull();

    Mail::assertQueued(ContactMailable::class);
});

test('the contact form validates its input', function (array $payload, string $field) {
    Mail::fake();

    $this->post(route('contact.store'), $payload)->assertSessionHasErrors($field);

    expect(Contact::count())->toBe(0);
    Mail::assertNothingQueued();
})->with([
    'missing name' => [['email' => 'a@b.com', 'phone' => '123', 'message' => 'Hi'], 'name'],
    'missing email' => [['name' => 'A', 'phone' => '123', 'message' => 'Hi'], 'email'],
    'invalid email' => [['name' => 'A', 'email' => 'nope', 'phone' => '123', 'message' => 'Hi'], 'email'],
    'missing phone' => [['name' => 'A', 'email' => 'a@b.com', 'message' => 'Hi'], 'phone'],
    'missing message' => [['name' => 'A', 'email' => 'a@b.com', 'phone' => '123'], 'message'],
    'overlong phone' => [['name' => 'A', 'email' => 'a@b.com', 'phone' => str_repeat('9', 21), 'message' => 'Hi'], 'phone'],
]);

test('the contact form is rate limited', function () {
    Mail::fake();

    $payload = [
        'name' => 'Spammer',
        'email' => 'spam@example.com',
        'phone' => '+8801711223344',
        'message' => 'Buy my product.',
    ];

    for ($attempt = 0; $attempt < 6; $attempt++) {
        $this->post(route('contact.store'), $payload);
    }

    $this->post(route('contact.store'), $payload)->assertTooManyRequests();
});
