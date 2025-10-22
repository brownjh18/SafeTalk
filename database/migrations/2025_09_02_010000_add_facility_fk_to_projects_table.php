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
        Schema::table('projects', function (Blueprint $table) {
            // Ensure column exists and is nullable
            if (!Schema::hasColumn('projects', 'facility_id')) {
                $table->string('facility_id')->nullable()->after('program_id');
            } else {
                $table->string('facility_id')->nullable()->change();
            }
            // Add foreign key constraint
            $table->foreign('facility_id')
                ->references('facility_id')
                ->on('facilities')
                ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropForeign(['facility_id']);
        });
    }
};
