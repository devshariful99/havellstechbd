<?php

namespace App\Models;

use Database\Factories\AchievementFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Achievement extends Model
{
    /** @use HasFactory<AchievementFactory> */
    use HasFactory;

    /**
     * Lucide icon keys allowed in the admin and on the homepage.
     *
     * @var list<string>
     */
    public const ICONS = [
        'database',
        'headphones',
        'trophy',
        'smile',
        'users',
        'award',
        'building-2',
        'briefcase',
        'circle-check',
        'star',
        'heart',
        'thumbs-up',
        'target',
        'zap',
        'globe',
        'factory',
        'handshake',
        'medal',
        'chart-column',
        'trending-up',
    ];

    /**
     * @var list<string>
     */
    protected $fillable = [
        'icon',
        'value',
        'suffix',
        'title',
        'sort_order',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'value' => 'integer',
            'sort_order' => 'integer',
        ];
    }

    /**
     * @param  Builder<Achievement>  $query
     * @return Builder<Achievement>
     */
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderBy('id');
    }
}
