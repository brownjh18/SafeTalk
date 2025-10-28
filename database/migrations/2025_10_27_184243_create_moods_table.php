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
        Schema::create('moods', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('counseling_session_id')->nullable()->constrained()->onDelete('cascade');
            $table->enum('mood_type', ['daily', 'post_session']);
            $table->integer('mood_level')->min(1)->max(10); // 1-10 scale
            $table->text('notes')->nullable();
            $table->timestamp('logged_at');
            $table->json('activities')->nullable(); // What the person was doing
            $table->json('triggers')->nullable(); // What triggered this mood
            $table->string('location')->nullable(); // Where they were
            $table->string('weather')->nullable(); // Weather conditions
            $table->integer('energy_level')->nullable()->min(1)->max(10); // Energy level 1-10
            $table->integer('sleep_quality')->nullable()->min(1)->max(10); // Sleep quality 1-10
            $table->integer('stress_level')->nullable()->min(1)->max(10); // Stress level 1-10
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('moods');
    }
};
