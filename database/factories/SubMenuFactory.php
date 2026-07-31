<?php

namespace Database\Factories;

use App\Models\Header;
use App\Models\SubMenu;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SubMenu>
 */
class SubMenuFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'header_id' => Header::factory(),
            'name' => fake()->words(3, true),
            'file' => 'submenus/'.fake()->unique()->numerify('submenu-######').'.pdf',
        ];
    }

    /**
     * Attach the sub-menu to a specific header.
     */
    public function forHeader(Header $header): static
    {
        return $this->state(fn (array $attributes) => [
            'header_id' => $header->id,
        ]);
    }

    /**
     * Indicate that the sub-menu has no attached PDF.
     */
    public function withoutFile(): static
    {
        return $this->state(fn (array $attributes) => [
            'file' => null,
        ]);
    }
}
