<?php

use App\Models\Approved;
use App\Models\Product;
use App\Models\SubMenu;

test('guests can view a product document page', function () {
    $product = Product::factory()->create([
        'title' => 'Fire Hose Spec',
        'file' => 'products/files/hose.pdf',
    ]);

    $this->get(route('documents.product', $product))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('frontend/document-viewer')
            ->where('title', 'Fire Hose Spec')
            ->where('file', 'products/files/hose.pdf')
            ->where('downloadUrl', '/storage/products/files/hose.pdf')
            ->where('type', 'product')
            ->where('backUrl', route('home'))
        );
});

test('guests can view an approved certificate document page', function () {
    $approved = Approved::factory()->create([
        'title' => 'ISO Certificate',
        'file' => 'approved/files/iso.pdf',
    ]);

    $this->get(route('documents.approved', $approved))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('frontend/document-viewer')
            ->where('title', 'ISO Certificate')
            ->where('file', 'approved/files/iso.pdf')
            ->where('type', 'approved')
        );
});

test('guests can view a submenu document page', function () {
    $subMenu = SubMenu::factory()->create([
        'name' => 'Company Profile',
        'file' => 'submenus/profile.pdf',
    ]);

    $this->get(route('documents.submenu', $subMenu))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('frontend/document-viewer')
            ->where('title', 'Company Profile')
            ->where('file', 'submenus/profile.pdf')
            ->where('type', 'menu')
        );
});

test('document pages return not found when no pdf is attached', function () {
    $product = Product::factory()->withoutFile()->create();
    $approved = Approved::factory()->withoutFile()->create();
    $subMenu = SubMenu::factory()->withoutFile()->create();

    $this->get(route('documents.product', $product))->assertNotFound();
    $this->get(route('documents.approved', $approved))->assertNotFound();
    $this->get(route('documents.submenu', $subMenu))->assertNotFound();
});

test('missing document models return not found', function () {
    $this->get(route('documents.product', 999999))->assertNotFound();
    $this->get(route('documents.approved', 999999))->assertNotFound();
    $this->get(route('documents.submenu', 999999))->assertNotFound();
});
