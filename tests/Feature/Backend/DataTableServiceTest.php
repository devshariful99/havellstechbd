<?php

use App\Models\Header;
use App\Models\Product;
use App\Models\SubMenu;
use App\Services\DataTableService;
use Illuminate\Http\Request;

function processTable(array $query, array $config = []): array
{
    return app(DataTableService::class)->process(
        Product::query(),
        Request::create('/admin/product', 'GET', $query),
        array_merge([
            'searchable' => ['title'],
            'sortable' => ['id', 'title', 'created_at'],
            'filterable' => ['title'],
        ], $config)
    );
}

test('an unsupported page size falls back to the default', function () {
    Product::factory()->count(15)->create();

    $result = processTable(['per_page' => 999999]);

    expect($result['pagination']['per_page'])->toBe(10)
        ->and($result['data'])->toHaveCount(10);
});

test('a supported page size is honoured', function () {
    Product::factory()->count(15)->create();

    expect(processTable(['per_page' => 5])['pagination']['per_page'])->toBe(5);
});

test('search matches the configured columns', function () {
    Product::factory()->create(['title' => 'Diesel Generator']);
    Product::factory()->create(['title' => 'Solar Panel']);

    $result = processTable(['search' => 'Diesel']);

    expect($result['data'])->toHaveCount(1)
        ->and($result['data'][0]->title)->toBe('Diesel Generator');
});

test('wildcards typed into the search box are treated literally', function () {
    Product::factory()->create(['title' => 'Discount 50%off']);
    Product::factory()->create(['title' => 'Regular price']);

    expect(processTable(['search' => '%'])['data'])->toHaveCount(1);
});

test('an unknown sort column is ignored', function () {
    Product::factory()->count(3)->create();

    $result = processTable(['sort_by' => 'not_a_column', 'sort_order' => 'asc']);

    expect($result['data'])->toHaveCount(3)
        ->and($result['sort_by'])->toBe('not_a_column');
});

test('an invalid sort direction falls back to ascending', function () {
    Product::factory()->count(2)->create();

    expect(processTable(['sort_by' => 'title', 'sort_order' => 'sideways'])['sort_order'])->toBe('asc');
});

test('sorting by title orders the rows', function () {
    Product::factory()->create(['title' => 'Zebra']);
    Product::factory()->create(['title' => 'Apple']);

    $result = processTable(['sort_by' => 'title', 'sort_order' => 'asc']);

    expect($result['data'][0]->title)->toBe('Apple');
});

test('the offset reflects the current page', function () {
    Product::factory()->count(25)->create();

    $result = processTable(['per_page' => 10, 'page' => 3]);

    expect($result['offset'])->toBe(20)
        ->and($result['pagination']['current_page'])->toBe(3);
});

test('sorting across a belongs-to relation does not duplicate rows', function () {
    $alpha = Header::factory()->create(['title' => 'AAA']);
    $beta = Header::factory()->create(['title' => 'ZZZ']);

    SubMenu::factory()->forHeader($beta)->create(['name' => 'from-zzz']);
    SubMenu::factory()->forHeader($alpha)->create(['name' => 'from-aaa']);

    $result = app(DataTableService::class)->process(
        SubMenu::with('header'),
        Request::create('/admin', 'GET', ['sort_by' => 'header.title', 'sort_order' => 'asc']),
        ['searchable' => ['name'], 'sortable' => ['header.title'], 'filterable' => []]
    );

    expect($result['data'])->toHaveCount(2)
        ->and($result['data'][0]->name)->toBe('from-aaa');
});

test('filters only apply to configured columns', function () {
    Product::factory()->create(['title' => 'Keep me']);
    Product::factory()->create(['title' => 'Other']);

    $ignored = processTable(['filters' => ['image' => 'nonsense']]);
    $applied = processTable(['filters' => ['title' => 'Keep me']]);

    expect($ignored['data'])->toHaveCount(2)
        ->and($applied['data'])->toHaveCount(1);
});
