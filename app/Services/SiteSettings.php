<?php

namespace App\Services;

use App\Models\Setting;
use Illuminate\Support\Facades\Cache;

class SiteSettings
{
    public const CACHE_KEY = 'site.settings';

    /**
     * Keys the admin site-settings form can read and write.
     *
     * @var list<string>
     */
    public const KEYS = [
        'site_name',
        'site_tagline',
        'primary_phone',
        'primary_email',
        'contact_email',
        'facebook_url',
        'twitter_url',
        'linkedin_url',
    ];

    /**
     * @return array<string, string|null>
     */
    public function all(): array
    {
        return Cache::rememberForever(self::CACHE_KEY, function (): array {
            $stored = Setting::query()
                ->whereIn('key', self::KEYS)
                ->pluck('value', 'key')
                ->all();

            $settings = [];

            foreach (self::KEYS as $key) {
                $settings[$key] = array_key_exists($key, $stored)
                    ? $stored[$key]
                    : $this->defaultFor($key);
            }

            return $settings;
        });
    }

    public function get(string $key, ?string $fallback = null): ?string
    {
        $settings = $this->all();

        if (! array_key_exists($key, $settings)) {
            return $fallback;
        }

        $value = $settings[$key];

        return filled($value) ? $value : $fallback;
    }

    /**
     * @param  array<string, string|null>  $values
     */
    public function update(array $values): void
    {
        foreach (self::KEYS as $key) {
            if (! array_key_exists($key, $values)) {
                continue;
            }

            $value = $values[$key];

            Setting::query()->updateOrCreate(
                ['key' => $key],
                ['value' => filled($value) ? trim((string) $value) : null],
            );
        }

        $this->flush();
    }

    public function flush(): void
    {
        Cache::forget(self::CACHE_KEY);
    }

    /**
     * Values shared with the public Inertia shell (header, footer, Head title).
     *
     * @return array{
     *     site_name: string,
     *     site_tagline: string|null,
     *     phone: string|null,
     *     email: string|null,
     *     social: array<string, string>
     * }
     */
    public function publicPayload(): array
    {
        return [
            'site_name' => $this->get('site_name', config('app.name')) ?? config('app.name'),
            'site_tagline' => $this->get('site_tagline'),
            'phone' => $this->get('primary_phone', config('contact.primary_phone')),
            'email' => $this->get('primary_email', config('contact.primary_email')),
            'social' => array_filter([
                'facebook' => $this->get('facebook_url', config('contact.social.facebook')),
                'twitter' => $this->get('twitter_url', config('contact.social.twitter')),
                'linkedin' => $this->get('linkedin_url', config('contact.social.linkedin')),
            ]),
        ];
    }

    public function contactRecipient(): string
    {
        return $this->get('contact_email')
            ?? $this->get('primary_email', config('contact.primary_email'))
            ?? config('mail.from.address');
    }

    private function defaultFor(string $key): ?string
    {
        return match ($key) {
            'site_name' => config('app.name'),
            'site_tagline' => null,
            'primary_phone' => config('contact.primary_phone'),
            'primary_email' => config('contact.primary_email'),
            'contact_email' => config('mail.from.address'),
            'facebook_url' => config('contact.social.facebook'),
            'twitter_url' => config('contact.social.twitter'),
            'linkedin_url' => config('contact.social.linkedin'),
            default => null,
        };
    }
}
