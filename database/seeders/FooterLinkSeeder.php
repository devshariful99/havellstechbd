<?php

namespace Database\Seeders;

use App\Models\FooterLink;
use Illuminate\Database\Seeder;

class FooterLinkSeeder extends Seeder
{
    /**
     * Seed the public "Useful Links" footer with the established agency portals.
     */
    public function run(): void
    {
        $links = [
            ['title' => 'Ministry of Power Energy and Mineral Resources', 'url' => 'https://mpemr.gov.bd'],
            ['title' => 'Bangladesh Power Development Board (BPDB)', 'url' => 'https://bpdb.gov.bd'],
            ['title' => 'Power Cell', 'url' => 'https://powercell.gov.bd'],
            ['title' => 'Bangladesh Investment Development Authority', 'url' => 'https://bida.gov.bd'],
            ['title' => 'e-Government Procurement (e-GP) System', 'url' => 'https://www.eprocure.gov.bd'],
            ['title' => 'Bangladesh Electrical Licence Board (ELB)', 'url' => 'https://elb.gov.bd'],
            ['title' => 'Bangladesh Rural Electrification Board', 'url' => 'https://reb.gov.bd'],
            ['title' => 'Dhaka Power Distribution Company Ltd. (DPDC)', 'url' => 'https://dpdc.gov.bd'],
            ['title' => 'Dhaka Electric Supply Company Limited (DESCO)', 'url' => 'https://desco.gov.bd'],
            ['title' => 'West Zone Power Distribution Company', 'url' => 'https://wzpdcl.gov.bd'],
            ['title' => 'Sustainable and Renewable Energy Development Authority (SREDA)', 'url' => 'https://sreda.gov.bd'],
            ['title' => 'Bangladesh Energy Regulatory Commission (BERC)', 'url' => 'https://berc.gov.bd'],
            ['title' => 'Central Procurement Technical Unit (CPTU)', 'url' => 'https://cptu.gov.bd'],
            ['title' => 'Power Grid Company of Bangladesh', 'url' => 'https://pgcb.gov.bd'],
            ['title' => 'Northern Electricity Supply Company Limited', 'url' => 'https://nesco.gov.bd'],
            ['title' => 'Bangladesh Fire Service & Civil Defense', 'url' => 'https://fireservice.gov.bd'],
            ['title' => 'Department of Environment', 'url' => 'https://doe.gov.bd'],
            ['title' => 'Department of Inspection for Factories and Establishments (DIFE)', 'url' => 'https://dife.gov.bd'],
            ['title' => 'Bangladesh Police', 'url' => 'https://police.gov.bd'],
            ['title' => 'Bangladesh RAB', 'url' => 'https://rab.gov.bd'],
            ['title' => 'Bangladesh Army', 'url' => 'https://army.mil.bd'],
            ['title' => 'Anti-Corruption Commission', 'url' => 'https://acc.org.bd'],
            ['title' => 'National Board of Revenue (NBR)', 'url' => 'https://nbr.gov.bd'],
            ['title' => 'VAT Online Service', 'url' => 'https://vat.gov.bd'],
        ];

        foreach ($links as $index => $link) {
            FooterLink::query()->updateOrCreate(
                ['url' => $link['url']],
                [
                    'title' => $link['title'],
                    'sort_order' => $index + 1,
                    'is_active' => true,
                ],
            );
        }

        FooterLink::flushPublicCache();
    }
}
