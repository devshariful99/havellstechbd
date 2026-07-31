<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $slug = fake()->unique()->numerify('product-######');

        return [
            'title' => fake()->words(3, true),
            'file' => 'products/files/'.$slug.'.pdf',
            'image' => 'products/images/'.$slug.'.jpg',
        ];
    }

    /**
     * Indicate that the product has no attached PDF.
     */
    public function withoutFile(): static
    {
        return $this->state(fn (array $attributes) => [
            'file' => null,
        ]);
    }

    /**
     * Indicate that the product has no image.
     */
    public function withoutImage(): static
    {
        return $this->state(fn (array $attributes) => [
            'image' => null,
        ]);
    }
}
