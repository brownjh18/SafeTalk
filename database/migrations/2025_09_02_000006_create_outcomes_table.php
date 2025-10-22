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
        Schema::create('outcomes', function (Blueprint $table) {
            $table->string('outcome_id')->primary();
            $table->string('project_id');
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('artifact_link')->nullable();
            $table->string('outcome_type'); // CAD, PCB, Prototype, Report, Business Plan
            $table->string('quality_certification')->nullable(); // e.g., UIRI certification
            $table->string('commercialization_status')->nullable(); // Demoed, Market Linked, Launched
            $table->timestamps();

            $table->foreign('project_id')
                ->references('project_id')
                ->on('projects')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('outcomes');
    }
};
