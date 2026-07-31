<?php

use App\Models\Header;
use App\Models\SubMenu;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

test('the navigation tree is cached after the first read', function () {
    Header::factory()->has(SubMenu::factory()->count(2))->create();

    Header::flushNavigationCache();
    Header::navigationTree();

    DB::enableQueryLog();
    Header::navigationTree();
    $queries = count(DB::getQueryLog());
    DB::disableQueryLog();

    expect($queries)->toBe(0)
        ->and(Cache::has(Header::NAVIGATION_CACHE_KEY))->toBeTrue();
});

test('the navigation tree nests sub-menus under their header', function () {
    $header = Header::factory()->create(['title' => 'COMPANY OVERVIEW']);
    SubMenu::factory()->forHeader($header)->create(['name' => 'Profile']);

    $tree = Header::navigationTree();

    expect($tree)->toHaveCount(1)
        ->and($tree[0]['title'])->toBe('COMPANY OVERVIEW')
        ->and($tree[0]['sub_menus'])->toHaveCount(1)
        ->and($tree[0]['sub_menus'][0]['name'])->toBe('Profile');
});

test('saving a header invalidates the navigation cache', function () {
    $header = Header::factory()->create();
    Header::navigationTree();

    $header->update(['title' => 'RENAMED']);

    expect(Cache::has(Header::NAVIGATION_CACHE_KEY))->toBeFalse()
        ->and(Header::navigationTree()[0]['title'])->toBe('RENAMED');
});

test('saving a sub-menu invalidates the navigation cache', function () {
    $header = Header::factory()->create();
    Header::navigationTree();

    SubMenu::factory()->forHeader($header)->create(['name' => 'Brand new']);

    expect(Cache::has(Header::NAVIGATION_CACHE_KEY))->toBeFalse()
        ->and(Header::navigationTree()[0]['sub_menus'][0]['name'])->toBe('Brand new');
});

test('deleting a sub-menu invalidates the navigation cache', function () {
    $header = Header::factory()->create();
    $subMenu = SubMenu::factory()->forHeader($header)->create();
    Header::navigationTree();

    $subMenu->delete();

    expect(Cache::has(Header::NAVIGATION_CACHE_KEY))->toBeFalse()
        ->and(Header::navigationTree()[0]['sub_menus'])->toBeEmpty();
});

test('the navigation tree is not queried for non-inertia requests', function () {
    Header::factory()->create();
    Header::flushNavigationCache();

    $this->get('/up')->assertOk();

    expect(Cache::has(Header::NAVIGATION_CACHE_KEY))->toBeFalse();
});
