<?php

namespace Database\Factories;

use App\Models\Hero;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Hero>
 */
class HeroFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * Hero images are served straight out of `public/`, so the stored path is
     * relative to the public directory rather than the storage disk.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(3),
            'subtitle' => fake()->sentence(8),
            'image' => 'images/heroes/'.fake()->unique()->numerify('hero-######').'.jpg',
        ];
    }

    /**
     * Indicate that the hero has no image.
     */
    public function withoutImage(): static
    {
        return $this->state(fn (array $attributes) => [
            'image' => null,
        ]);
    }
}
