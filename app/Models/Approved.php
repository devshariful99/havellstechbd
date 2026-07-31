<?php

namespace App\Models;

use Database\Factories\ApprovedFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Approved extends Model
{
    /** @use HasFactory<ApprovedFactory> */
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'title',
        'image',
        'file',
    ];
}
