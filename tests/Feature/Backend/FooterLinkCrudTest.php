<?php

use App\Models\Admin;
use App\Models\FooterLink;

beforeEach(function () {
    $this->admin = Admin::factory()->create();
    FooterLink::flushPublicCache();
});

afterEach(function () {
    FooterLink::flushPublicCache();
});

test('guests cannot manage footer links', function () {
    $this->get(route('admin.footer-link.index'))->assertRedirect(route('admin.login'));
    $this->get(route('admin.footer-link.create'))->assertRedirect(route('admin.login'));
});

test('admins can list footer links', function () {
    FooterLink::factory()->count(3)->create();

    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.footer-link.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('backend/FooterLink/Index')
            ->has('footerLinks', 3));
});

test('admins can create a footer link', function () {
    $this->actingAs($this->admin, 'admin')
        ->post(route('admin.footer-link.store'), [
            'title' => 'Power Cell',
            'url' => 'https://powercell.gov.bd',
            'sort_order' => 5,
            'is_active' => true,
        ])
        ->assertRedirect(route('admin.footer-link.index'))
        ->assertSessionHas('success');

    $this->assertDatabaseHas('footer_links', [
        'title' => 'Power Cell',
        'url' => 'https://powercell.gov.bd',
        'sort_order' => 5,
        'is_active' => true,
    ]);
});

test('footer link creation requires a valid title and url', function () {
    $this->actingAs($this->admin, 'admin')
        ->from(route('admin.footer-link.create'))
        ->post(route('admin.footer-link.store'), [
            'title' => '',
            'url' => 'not-a-url',
        ])
        ->assertRedirect(route('admin.footer-link.create'))
        ->assertSessionHasErrors(['title', 'url']);
});

test('admins can update a footer link', function () {
    $link = FooterLink::factory()->create([
        'title' => 'Old Title',
        'url' => 'https://old.example.com',
        'is_active' => true,
    ]);

    $this->actingAs($this->admin, 'admin')
        ->put(route('admin.footer-link.update', $link), [
            'title' => 'Updated Title',
            'url' => 'https://updated.example.com',
            'sort_order' => 12,
            'is_active' => false,
        ])
        ->assertRedirect(route('admin.footer-link.index'));

    expect($link->fresh())
        ->title->toBe('Updated Title')
        ->url->toBe('https://updated.example.com')
        ->sort_order->toBe(12)
        ->is_active->toBeFalse();
});

test('admins can delete a footer link', function () {
    $link = FooterLink::factory()->create();

    $this->actingAs($this->admin, 'admin')
        ->delete(route('admin.footer-link.destroy', $link))
        ->assertRedirect(route('admin.footer-link.index'));

    $this->assertDatabaseMissing('footer_links', ['id' => $link->id]);
});

test('the public site only receives active ordered footer links', function () {
    FooterLink::factory()->create([
        'title' => 'Second',
        'url' => 'https://second.example.com',
        'sort_order' => 2,
        'is_active' => true,
    ]);
    FooterLink::factory()->create([
        'title' => 'Hidden',
        'url' => 'https://hidden.example.com',
        'sort_order' => 1,
        'is_active' => false,
    ]);
    FooterLink::factory()->create([
        'title' => 'First',
        'url' => 'https://first.example.com',
        'sort_order' => 1,
        'is_active' => true,
    ]);

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('footerLinks', 2)
            ->where('footerLinks.0.title', 'First')
            ->where('footerLinks.0.url', 'https://first.example.com')
            ->where('footerLinks.1.title', 'Second'));
});

test('inactive footer links are omitted from the public cache helper', function () {
    FooterLink::factory()->create(['is_active' => true, 'title' => 'Visible']);
    FooterLink::factory()->inactive()->create(['title' => 'Invisible']);

    $links = FooterLink::publicLinks();

    expect($links)->toHaveCount(1)
        ->and($links[0]['title'])->toBe('Visible');
});
