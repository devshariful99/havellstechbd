<?php

namespace Database\Seeders;

use App\Models\ContactPageSetting;
use Illuminate\Database\Seeder;

class ContactPageSettingSeeder extends Seeder
{
    /**
     * Seed the singleton contact page settings without Feni or UAE offices.
     */
    public function run(): void
    {
        $existing = ContactPageSetting::query()->first();

        if ($existing === null) {
            ContactPageSetting::query()->create(ContactPageSetting::defaults());
        }

        ContactPageSetting::flushPublicCache();
    }
}
