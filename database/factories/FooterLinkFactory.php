<?php

namespace Database\Factories;

use App\Models\FooterLink;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<FooterLink>
 */
class FooterLinkFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->unique()->company().' Portal',
            'url' => fake()->unique()->url(),
            'sort_order' => fake()->numberBetween(0, 100),
            'is_active' => true,
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}
