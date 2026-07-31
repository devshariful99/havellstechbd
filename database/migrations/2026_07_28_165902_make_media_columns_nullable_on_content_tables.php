<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * The admin edit screens allow clearing an uploaded PDF or image, which the
     * controllers persist as null. These columns were NOT NULL, so every
     * removal failed at the database level.
     */
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->text('file')->nullable()->change();
            $table->string('image')->nullable()->change();
        });

        Schema::table('approveds', function (Blueprint $table) {
            $table->string('image')->nullable()->change();
            $table->string('file')->nullable()->change();
        });

        Schema::table('our_partners', function (Blueprint $table) {
            $table->string('image')->nullable()->change();
        });

        Schema::table('sub_menus', function (Blueprint $table) {
            $table->string('file')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->text('file')->nullable(false)->change();
            $table->string('image')->nullable(false)->change();
        });

        Schema::table('approveds', function (Blueprint $table) {
            $table->string('image')->nullable(false)->change();
            $table->string('file')->nullable(false)->change();
        });

        Schema::table('our_partners', function (Blueprint $table) {
            $table->string('image')->nullable(false)->change();
        });

        Schema::table('sub_menus', function (Blueprint $table) {
            $table->string('file')->nullable(false)->change();
        });
    }
};
