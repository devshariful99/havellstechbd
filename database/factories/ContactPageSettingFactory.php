<?php

namespace Database\Factories;

use App\Models\ContactPageSetting;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ContactPageSetting>
 */
class ContactPageSettingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return array_merge(ContactPageSetting::defaults(), [
            'hero_title' => 'Contact Us',
            'hero_breadcrumb' => 'Contact Us',
            'map_height' => 450,
        ]);
    }
}
