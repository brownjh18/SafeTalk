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
        Schema::create('projects', function (Blueprint $table) {
            $table->string('project_id')->primary();
            $table->string('program_id');
            $table->string('facility_id')->nullable();
            $table->string('title');
            $table->string('nature_of_project');
            $table->text('description')->nullable();
            $table->string('innovation_focus')->nullable();
            $table->string('prototype_stage')->nullable();
            $table->text('testing_requirements')->nullable();
            $table->text('commercialization_plan')->nullable();
            $table->timestamps();

            $table->foreign('program_id')
                ->references('program_id')
                ->on('programs')
                ->onDelete('cascade');

                    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
