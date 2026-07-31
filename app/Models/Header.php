<?php

namespace App\Models;

use Database\Factories\HeaderFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Cache;

class Header extends Model
{
    /** @use HasFactory<HeaderFactory> */
    use HasFactory;

    public const NAVIGATION_CACHE_KEY = 'navigation.headers';

    /**
     * @var list<string>
     */
    protected $fillable = [
        'title',
        'slug',
    ];

    /**
     * @return HasMany<SubMenu, $this>
     */
    public function subMenus(): HasMany
    {
        return $this->hasMany(SubMenu::class);
    }

    /**
     * The header and sub-menu tree used by the public navigation.
     *
     * This is read on every page load but only changes when an admin edits the
     * menu, so it is cached and flushed by the model events below.
     *
     * @return array<int, array<string, mixed>>
     */
    public static function navigationTree(): array
    {
        return Cache::rememberForever(
            self::NAVIGATION_CACHE_KEY,
            fn (): array => static::query()
                ->select(['id', 'title', 'slug'])
                ->with(['subMenus' => fn ($query) => $query
                    ->select(['id', 'header_id', 'name', 'file'])
                    ->orderBy('name'),
                ])
                ->orderBy('id')
                ->get()
                ->toArray()
        );
    }

    public static function flushNavigationCache(): void
    {
        Cache::forget(self::NAVIGATION_CACHE_KEY);
    }

    protected static function booted(): void
    {
        static::saved(static function (): void {
            static::flushNavigationCache();
        });

        static::deleted(static function (): void {
            static::flushNavigationCache();
        });
    }
}
