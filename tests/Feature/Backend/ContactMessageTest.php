<?php

use App\Models\Admin;
use App\Models\Contact;

beforeEach(function () {
    $this->admin = Admin::factory()->create();
});

test('guests cannot view contact messages', function () {
    $this->get(route('admin.contact-message.index'))->assertRedirect(route('admin.login'));
});

test('admins can list contact messages', function () {
    Contact::factory()->count(3)->create();

    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.contact-message.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('backend/ContactMessage/Index')
            ->has('messages', 3));
});

test('admins can search and filter contact messages by read status', function () {
    Contact::factory()->create([
        'name' => 'Findable Person',
        'email' => 'findable@example.com',
        'read_at' => null,
    ]);
    Contact::factory()->read()->create([
        'name' => 'Already Read',
        'email' => 'read@example.com',
    ]);
    Contact::factory()->create([
        'name' => 'Other Person',
        'email' => 'other@example.com',
        'read_at' => null,
    ]);

    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.contact-message.index', [
            'search' => 'Findable',
        ]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('messages', 1)
            ->where('messages.0.name', 'Findable Person'));

    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.contact-message.index', [
            'filters' => ['read_status' => 'unread'],
        ]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('messages', 2));

    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.contact-message.index', [
            'filters' => ['read_status' => 'read'],
        ]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('messages', 1)
            ->where('messages.0.name', 'Already Read'));
});

test('viewing a message marks it as read', function () {
    $message = Contact::factory()->create(['read_at' => null]);

    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.contact-message.show', $message))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('backend/ContactMessage/Show')
            ->where('message.id', $message->id)
            ->where('message.name', $message->name));

    expect($message->fresh()->read_at)->not->toBeNull();
});

test('admins can mark a message as unread and read', function () {
    $message = Contact::factory()->read()->create();

    $this->actingAs($this->admin, 'admin')
        ->post(route('admin.contact-message.unread', $message))
        ->assertRedirect();

    expect($message->fresh()->read_at)->toBeNull();

    $this->actingAs($this->admin, 'admin')
        ->post(route('admin.contact-message.read', $message))
        ->assertRedirect();

    expect($message->fresh()->read_at)->not->toBeNull();
});

test('admins can delete a contact message', function () {
    $message = Contact::factory()->create();

    $this->actingAs($this->admin, 'admin')
        ->delete(route('admin.contact-message.destroy', $message))
        ->assertRedirect(route('admin.contact-message.index'))
        ->assertSessionHas('success');

    $this->assertDatabaseMissing('contacts', ['id' => $message->id]);
});
