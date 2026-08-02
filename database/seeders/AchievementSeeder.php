<?php

namespace Database\Seeders;

use App\Models\Achievement;
use Illuminate\Database\Seeder;

class AchievementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $defaults = [
            [
                'icon' => 'database',
                'value' => 800,
                'suffix' => '+',
                'title' => 'Projects',
                'sort_order' => 1,
            ],
            [
                'icon' => 'headphones',
                'value' => 700,
                'suffix' => '+',
                'title' => 'Clients',
                'sort_order' => 2,
            ],
            [
                'icon' => 'trophy',
                'value' => 500,
                'suffix' => '+',
                'title' => 'Awards Won',
                'sort_order' => 3,
            ],
            [
                'icon' => 'smile',
                'value' => 100,
                'suffix' => '%',
                'title' => 'Customer Satisfaction',
                'sort_order' => 4,
            ],
        ];

        foreach ($defaults as $achievement) {
            Achievement::query()->updateOrCreate(
                ['title' => $achievement['title']],
                $achievement,
            );
        }
    }
}
