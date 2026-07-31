<?php

namespace App\Models;

use Database\Factories\FooterLinkFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class FooterLink extends Model
{
    /** @use HasFactory<FooterLinkFactory> */
    use HasFactory;

    public const CACHE_KEY = 'footer.useful_links';

    /**
     * @var list<string>
     */
    protected $fillable = [
        'title',
        'url',
        'sort_order',
        'is_active',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    /**
     * @param  Builder<FooterLink>  $query
     * @return Builder<FooterLink>
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    /**
     * @param  Builder<FooterLink>  $query
     * @return Builder<FooterLink>
     */
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderBy('id');
    }

    /**
     * Public footer links, cached because they are read on every page load.
     *
     * @return list<array{id: int, title: string, url: string}>
     */
    public static function publicLinks(): array
    {
        return Cache::rememberForever(
            self::CACHE_KEY,
            fn (): array => static::query()
                ->active()
                ->ordered()
                ->get(['id', 'title', 'url'])
                ->map(fn (FooterLink $link): array => [
                    'id' => $link->id,
                    'title' => $link->title,
                    'url' => $link->url,
                ])
                ->all()
        );
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
