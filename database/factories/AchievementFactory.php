<?php

namespace Database\Factories;

use App\Models\Achievement;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Achievement>
 */
class AchievementFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'icon' => fake()->randomElement(Achievement::ICONS),
            'value' => fake()->numberBetween(10, 999),
            'suffix' => fake()->randomElement(['+', '%', null]),
            'title' => fake()->words(2, true),
            'sort_order' => fake()->numberBetween(0, 20),
        ];
    }
}
