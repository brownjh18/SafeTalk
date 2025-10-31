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
        Schema::table('group_chat_participants', function (Blueprint $table) {
            $table->enum('status', ['active', 'removed', 'pending', 'invited'])->default('active')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('group_chat_participants', function (Blueprint $table) {
            //
        });
    }
};
