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
        Schema::create('group_chat_participants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('group_chat_session_id')->constrained('group_chat_sessions')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->timestamp('joined_at')->useCurrent();
            $table->enum('role', ['creator', 'participant'])->default('participant');
            $table->enum('status', ['active', 'removed', 'pending'])->default('active');
            $table->timestamps();

            $table->unique(['group_chat_session_id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('group_chat_participants');
    }
};