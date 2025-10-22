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
        Schema::table('programs', function (Blueprint $table) {
            $table->string('program_code')->nullable()->unique()->after('program_id');
        });

        Schema::table('projects', function (Blueprint $table) {
            $table->string('project_code')->nullable()->unique()->after('project_id');
        });

        Schema::table('facilities', function (Blueprint $table) {
            $table->string('facility_code')->nullable()->unique()->after('facility_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('programs', function (Blueprint $table) {
            $table->dropColumn('program_code');
        });

        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn('project_code');
        });

        Schema::table('facilities', function (Blueprint $table) {
            $table->dropColumn('facility_code');
        });
    }
};
