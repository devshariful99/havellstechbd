<?php

namespace Database\Seeders;

use App\Models\Header;
use Illuminate\Database\Seeder;

class HeaderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * The IDs are pinned because existing sub-menu rows reference them.
     */
    public function run(): void
    {
        $now = now();

        Header::upsert(
            [
                [
                    'id' => 1,
                    'title' => 'COMPANY OVERVIEW',
                    'slug' => 'company-overview',
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
                [
                    'id' => 2,
                    'title' => 'PRODUCTS & SERVICES',
                    'slug' => 'products-services',
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
            ],
            ['id'],
            ['title', 'slug', 'updated_at']
        );

        // `upsert` writes straight to the database, so the cached navigation
        // tree has to be invalidated by hand.
        Header::flushNavigationCache();
    }
}
