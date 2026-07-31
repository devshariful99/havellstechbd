<?php

namespace App\Models;

use Database\Factories\ContactPageSettingFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class ContactPageSetting extends Model
{
    /** @use HasFactory<ContactPageSettingFactory> */
    use HasFactory;

    public const CACHE_KEY = 'contact.page_settings';

    public const DEFAULT_HERO_IMAGE = 'assets/images/contact/Image03.jpg';

    public const DEFAULT_MAP_EMBED_URL = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.748994992966!2d90.4612909740269!3d23.756328688551193!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b900fdfe2cf3%3A0x7380a69d55a25f64!2sTECHNO%20POWER%20ELECTRIC%20BANGLADESH%20LTD!5e0!3m2!1sen!2sbd!4v1776797159778!5m2!1sen!2sbd';

    /**
     * @var list<string>
     */
    protected $fillable = [
        'hero_title',
        'hero_breadcrumb',
        'hero_image',
        'hero_image_alt',
        'map_embed_url',
        'map_height',
        'offices',
        'phones',
        'form_name_placeholder',
        'form_email_placeholder',
        'form_phone_placeholder',
        'form_message_placeholder',
        'form_submit_label',
        'form_success_message',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'map_height' => 'integer',
            'offices' => 'array',
            'phones' => 'array',
        ];
    }

    /**
     * Current singleton row, created with defaults when missing.
     */
    public static function current(): self
    {
        $existing = static::query()->first();

        if ($existing !== null) {
            return $existing;
        }

        return static::query()->create(static::defaults());
    }

    /**
     * Cached public payload for the contact page.
     *
     * @return array{
     *     hero_title: string,
     *     hero_breadcrumb: string,
     *     hero_image: string|null,
     *     hero_image_alt: string|null,
     *     map_embed_url: string|null,
     *     map_height: int,
     *     offices: list<array{title: string, lines: list<string>}>,
     *     phones: list<array{title: string, lines: list<string>}>,
     *     form_name_placeholder: string,
     *     form_email_placeholder: string,
     *     form_phone_placeholder: string,
     *     form_message_placeholder: string,
     *     form_submit_label: string,
     *     form_success_message: string
     * }
     */
    public static function publicPayload(): array
    {
        return Cache::rememberForever(self::CACHE_KEY, function (): array {
            $settings = static::current();

            return [
                'hero_title' => $settings->hero_title,
                'hero_breadcrumb' => $settings->hero_breadcrumb,
                'hero_image' => $settings->resolvedHeroImage(),
                'hero_image_alt' => $settings->hero_image_alt ?: 'Contact banner',
                'map_embed_url' => filled($settings->map_embed_url)
                    ? $settings->map_embed_url
                    : self::DEFAULT_MAP_EMBED_URL,
                'map_height' => $settings->map_height > 0 ? $settings->map_height : 450,
                'offices' => static::normalizeGroups($settings->offices ?? []),
                'phones' => static::normalizeGroups($settings->phones ?? []),
                'form_name_placeholder' => $settings->form_name_placeholder,
                'form_email_placeholder' => $settings->form_email_placeholder,
                'form_phone_placeholder' => $settings->form_phone_placeholder,
                'form_message_placeholder' => $settings->form_message_placeholder,
                'form_submit_label' => $settings->form_submit_label,
                'form_success_message' => $settings->form_success_message,
            ];
        });
    }

    /**
     * @return array<string, mixed>
     */
    public static function defaults(): array
    {
        return [
            'hero_title' => 'Contact Us',
            'hero_breadcrumb' => 'Contact Us',
            'hero_image' => null,
            'hero_image_alt' => 'Contact banner',
            'map_embed_url' => self::DEFAULT_MAP_EMBED_URL,
            'map_height' => 450,
            'offices' => [
                [
                    'title' => 'Corporate Office',
                    'lines' => [
                        'Sheba Nurjahan Eyecon Center',
                        '(8th Floor), 60 Purana Paltan,',
                        'Dhaka 1000',
                    ],
                ],
                [
                    'title' => 'Factory',
                    'lines' => [
                        'Banagram, Teghoria South Keranigonj, Bangladesh',
                    ],
                ],
                [
                    'title' => 'Wire House',
                    'lines' => [
                        '2279, Newazbagh, 13No Road',
                        'Kilgaon, Dhaka, Bangladesh',
                    ],
                ],
            ],
            'phones' => [
                [
                    'title' => 'Help Line',
                    'lines' => ['096 96 62 83 422'],
                ],
                [
                    'title' => 'Hotline',
                    'lines' => ['+88 01707 08 22 44', '+88 01707 08 22 55'],
                ],
                [
                    'title' => 'Sales & Service',
                    'lines' => [
                        '+ 88 01714 07 83 42',
                        '+ 88 01714 07 83 43',
                        '+ 88 01714 07 83 47',
                        '+ 88 01714 07 83 48',
                        '+ 88 01714 07 83 49',
                        '+ 88 01714 07 83 50',
                        '+ 88 01714 07 83 51',
                        '+ 88 01714 07 83 52',
                        '+ 88 01714 07 83 53',
                        '+ 88 01714 07 83 54',
                    ],
                ],
            ],
            'form_name_placeholder' => 'Your Name',
            'form_email_placeholder' => 'Your Email',
            'form_phone_placeholder' => 'Phone Number',
            'form_message_placeholder' => 'Message',
            'form_submit_label' => 'Submit',
            'form_success_message' => 'Message sent successfully!',
        ];
    }

    public function resolvedHeroImage(): ?string
    {
        if (filled($this->hero_image)) {
            return $this->hero_image;
        }

        return self::DEFAULT_HERO_IMAGE;
    }

    /**
     * Whether the stored hero image is a managed upload (safe to delete).
     */
    public function hasManagedHeroImage(): bool
    {
        if (blank($this->hero_image)) {
            return false;
        }

        return str_starts_with($this->hero_image, config('media.contact_directory').'/');
    }

    /**
     * @param  list<array{title?: mixed, lines?: mixed}>|array<int, mixed>  $groups
     * @return list<array{title: string, lines: list<string>}>
     */
    public static function normalizeGroups(array $groups): array
    {
        $normalized = [];

        foreach ($groups as $group) {
            if (! is_array($group)) {
                continue;
            }

            $title = trim((string) ($group['title'] ?? ''));
            $rawLines = $group['lines'] ?? [];

            if (is_string($rawLines)) {
                $rawLines = preg_split("/\r\n|\n|\r/", $rawLines) ?: [];
            }

            if (! is_array($rawLines)) {
                $rawLines = [];
            }

            $lines = [];

            foreach ($rawLines as $line) {
                $trimmed = trim((string) $line);

                if ($trimmed !== '') {
                    $lines[] = $trimmed;
                }
            }

            // Titles without any detail lines are omitted from the public page.
            if ($lines === []) {
                continue;
            }

            $normalized[] = [
                'title' => $title,
                'lines' => $lines,
            ];
        }

        return $normalized;
    }

    public static function flushPublicCache(): void
    {
        Cache::forget(self::CACHE_KEY);
    }

    protected static function booted(): void
    {
        static::saved(static function (): void {
            static::flushPublicCache();
        });

        static::deleted(static function (): void {
            static::flushPublicCache();
        });
    }
}
