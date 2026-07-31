<?php

namespace Database\Factories;

use App\Models\Approved;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Approved>
 */
class ApprovedFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $slug = fake()->unique()->numerify('approved-######');

        return [
            'title' => fake()->words(3, true),
            'file' => 'approved/files/'.$slug.'.pdf',
            'image' => 'approved/images/'.$slug.'.jpg',
        ];
    }

    /**
     * Indicate that the certificate has no attached PDF.
     */
    public function withoutFile(): static
    {
        return $this->state(fn (array $attributes) => [
            'file' => null,
        ]);
    }
}
