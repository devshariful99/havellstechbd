<?php

use App\Models\Achievement;
use App\Models\Approved;
use App\Models\Hero;
use App\Models\OurPartner;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\DB;

test('the home page renders for guests', function () {
    $this->get(route('home'))->assertOk();
});

test('the home page renders for authenticated users', function () {
    $this->actingAs(User::factory()->create())
        ->get(route('home'))
        ->assertOk();
});

test('the home page exposes content with download links', function () {
    Hero::factory()->create(['title' => 'Powering Progress']);
    OurPartner::factory()->create();
    Achievement::factory()->create([
        'icon' => 'database',
        'value' => 800,
        'suffix' => '+',
        'title' => 'Projects',
    ]);
    $product = Product::factory()->create(['file' => 'products/files/spec.pdf']);
    $approved = Approved::factory()->create(['file' => 'approved/files/cert.pdf']);

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('frontend/home')
            ->has('heros', 1)
            ->has('ourPartners', 1)
            ->has('achievements', 1)
            ->where('achievements.0.title', 'Projects')
            ->where('achievements.0.value', 800)
            ->where('products.0.downloadLink', '/storage/'.$product->file)
            ->where('approveds.0.downloadLink', '/storage/'.$approved->file)
            ->where('approveds.0.link', null)
        );
});

test('the home page exposes approved external links', function () {
    Approved::factory()->withLink('https://example.com/cert')->create([
        'file' => null,
    ]);

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('approveds.0.link', 'https://example.com/cert')
            ->where('approveds.0.downloadLink', null)
        );
});

test('products without a pdf expose a null download link', function () {
    Product::factory()->withoutFile()->create();

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->where('products.0.downloadLink', null));
});

test('the home page does not query the same table twice', function () {
    Approved::factory()->count(2)->create();

    DB::enableQueryLog();

    $this->get(route('home'))->assertOk();

    $approvedQueries = collect(DB::getQueryLog())
        ->filter(fn (array $entry) => str_contains($entry['query'], 'from "approveds"'))
        ->count();

    DB::disableQueryLog();

    expect($approvedQueries)->toBe(1);
});
