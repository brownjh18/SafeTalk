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
        // Add deleted_at column to programs table
        Schema::table('programs', function (Blueprint $table) {
            $table->softDeletes();
        });

        // Add deleted_at column to projects table
        Schema::table('projects', function (Blueprint $table) {
            $table->softDeletes();
        });

        // Add deleted_at column to facilities table
        Schema::table('facilities', function (Blueprint $table) {
            $table->softDeletes();
        });

        // Add deleted_at column to services table
        Schema::table('services', function (Blueprint $table) {
            $table->softDeletes();
        });

        // Add deleted_at column to equipment table
        Schema::table('equipment', function (Blueprint $table) {
            $table->softDeletes();
        });

        // Add deleted_at column to participants table
        Schema::table('participants', function (Blueprint $table) {
            $table->softDeletes();
        });

        // Add deleted_at column to outcomes table
        Schema::table('outcomes', function (Blueprint $table) {
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove deleted_at column from programs table
        Schema::table('programs', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });

        // Remove deleted_at column from projects table
        Schema::table('projects', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });

        // Remove deleted_at column from facilities table
        Schema::table('facilities', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });

        // Remove deleted_at column from services table
        Schema::table('services', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });

        // Remove deleted_at column from equipment table
        Schema::table('equipment', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });

        // Remove deleted_at column from participants table
        Schema::table('participants', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });

        // Remove deleted_at column from outcomes table
        Schema::table('outcomes', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
    }
};
