<?php

namespace Database\Factories;

use App\Models\OurPartner;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<OurPartner>
 */
class OurPartnerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * Partner logos are served straight out of `public/`, matching the path the
     * controller stores.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->company(),
            'image' => 'images/our-partners/'.fake()->unique()->numerify('partner-######').'.png',
        ];
    }

    /**
     * Indicate that the partner has no logo.
     */
    public function withoutImage(): static
    {
        return $this->state(fn (array $attributes) => [
            'image' => null,
        ]);
    }
}
