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
        Schema::table('resources', function (Blueprint $table) {
            $table->string('file_name')->nullable()->after('file_path');
            $table->bigInteger('file_size')->nullable()->after('file_name');
            $table->string('mime_type')->nullable()->after('file_size');
            $table->string('category')->nullable()->after('mime_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('resources', function (Blueprint $table) {
            $table->dropColumn(['file_name', 'file_size', 'mime_type', 'category']);
        });
    }
};
