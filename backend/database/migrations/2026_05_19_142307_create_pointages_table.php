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
        Schema::create('pointages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('chantier_id')->constrained('chantiers')->onDelete('cascade');
            $table->date('date_pointage');
            $table->decimal('heures_normales', 4, 2)->default(8.00);
            $table->decimal('heures_supplementaires', 4, 2)->default(0.00);
            $table->string('description')->nullable();
            $table->enum('statut', ['soumis', 'approuve', 'rejete'])->default('soumis');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pointages');
    }
};
