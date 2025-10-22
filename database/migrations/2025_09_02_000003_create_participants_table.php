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
        Schema::create('participants', function (Blueprint $table) {
            $table->string('participant_id')->primary();
            $table->string('full_name');
            $table->string('email')->unique();
            $table->string('affiliation'); // CS, SE, Engineering, Other
            $table->string('specialization'); // Software, Hardware, Business
            $table->boolean('cross_skill_trained')->default(false);
            $table->string('institution'); // SCIT, CEDAT, UniPod, UIRI, Lwera
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('participants');
    }
};
