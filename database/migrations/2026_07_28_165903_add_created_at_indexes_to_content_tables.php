<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Tables ordered by `created_at` on the public homepage and in the admin
     * data tables, none of which had an index to support it.
     *
     * @var list<string>
     */
    private array $tables = [
        'heroes',
        'products',
        'our_partners',
        'approveds',
        'sub_menus',
        'contacts',
    ];

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        foreach ($this->tables as $table) {
            Schema::table($table, function (Blueprint $blueprint) {
                $blueprint->index('created_at');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        foreach ($this->tables as $table) {
            Schema::table($table, function (Blueprint $blueprint) {
                $blueprint->dropIndex(['created_at']);
            });
        }
    }
};
