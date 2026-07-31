<?php

namespace Database\Seeders;

use App\Services\SiteSettings;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    /**
     * Seed default site settings from config so the admin form is populated
     * on a fresh install without requiring a manual save first.
     */
    public function run(): void
    {
        app(SiteSettings::class)->update([
            'site_name' => config('app.name'),
            'site_tagline' => 'Powering industrial excellence',
            'primary_phone' => config('contact.primary_phone'),
            'primary_email' => config('contact.primary_email'),
            'contact_email' => config('mail.from.address'),
            'facebook_url' => config('contact.social.facebook'),
            'twitter_url' => config('contact.social.twitter'),
            'linkedin_url' => config('contact.social.linkedin'),
        ]);
    }
}
