<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('contact_page_settings', function (Blueprint $table) {
            $table->id();
            $table->string('hero_title')->default('Contact Us');
            $table->string('hero_breadcrumb')->default('Contact Us');
            $table->string('hero_image')->nullable();
            $table->string('hero_image_alt')->nullable();
            $table->text('map_embed_url')->nullable();
            $table->unsignedSmallInteger('map_height')->default(450);
            $table->json('offices')->nullable();
            $table->json('phones')->nullable();
            $table->string('form_name_placeholder')->default('Your Name');
            $table->string('form_email_placeholder')->default('Your Email');
            $table->string('form_phone_placeholder')->default('Phone Number');
            $table->string('form_message_placeholder')->default('Message');
            $table->string('form_submit_label')->default('Submit');
            $table->string('form_success_message')->default('Message sent successfully!');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contact_page_settings');
    }
};
