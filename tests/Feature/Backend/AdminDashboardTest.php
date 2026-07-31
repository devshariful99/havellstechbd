<?php

use App\Models\Admin;
use App\Models\Approved;
use App\Models\Contact;
use App\Models\Hero;
use App\Models\OurPartner;
use App\Models\Product;
use App\Models\SubMenu;

beforeEach(function () {
    $this->admin = Admin::factory()->create();
});

test('guests cannot open the admin dashboard', function () {
    $this->get(route('admin.dashboard'))
        ->assertRedirect(route('admin.login'));
});

test('admins see dashboard stats and recent activity', function () {
    Hero::factory()->count(2)->create();
    Product::factory()->count(3)->create();
    OurPartner::factory()->count(1)->create();
    Approved::factory()->count(4)->create();
    SubMenu::factory()->count(2)->create();
    Contact::factory()->count(3)->create();

    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.dashboard'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('backend/Admin/AdminDashboard')
            ->where('stats.heroes', 2)
            ->where('stats.products', 3)
            ->where('stats.partners', 1)
            ->where('stats.approved', 4)
            ->where('stats.subMenus', 2)
            ->where('stats.contacts', 3)
            ->has('recentContacts', 3)
            ->has('recentProducts', 3)
            ->where('admin.name', $this->admin->name)
            ->where('admin.email', $this->admin->email));
});
