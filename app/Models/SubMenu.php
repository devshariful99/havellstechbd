<?php

namespace App\Models;

use Database\Factories\SubMenuFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SubMenu extends Model
{
    /** @use HasFactory<SubMenuFactory> */
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'header_id',
        'name',
        'file',
    ];

    /**
     * @return BelongsTo<Header, $this>
     */
    public function header(): BelongsTo
    {
        return $this->belongsTo(Header::class);
    }

    protected static function booted(): void
    {
        static::saved(static function (): void {
            Header::flushNavigationCache();
        });

        static::deleted(static function (): void {
            Header::flushNavigationCache();
        });
    }
}
