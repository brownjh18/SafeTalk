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
        Schema::create('participant_project', function (Blueprint $table) {
            $table->id();
            $table->string('participant_id');
            $table->string('project_id');
            $table->timestamps();

            $table->unique(['participant_id', 'project_id']);

            $table->foreign('participant_id')
                ->references('participant_id')
                ->on('participants')
                ->onDelete('cascade');

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
        Schema::dropIfExists('participant_project');
    }
};
