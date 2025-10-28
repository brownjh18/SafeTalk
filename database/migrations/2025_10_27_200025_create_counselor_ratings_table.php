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
        Schema::create('counselor_ratings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('counselor_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('client_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('counseling_session_id')->nullable()->constrained()->onDelete('cascade');
            $table->integer('rating')->min(1)->max(5); // 1-5 star rating
            $table->text('review')->nullable();
            $table->boolean('anonymous')->default(false);
            $table->timestamps();

            // Prevent duplicate ratings from same client for same counselor
            $table->unique(['counselor_id', 'client_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('counselor_ratings');
    }
};
