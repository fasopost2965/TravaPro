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
        Schema::create('chantier_equipes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('chantier_id')->constrained('chantiers')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('role_chantier')->nullable();
            $table->date('date_affectation')->nullable();
            $table->timestamps();

            $table->unique(['chantier_id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chantier_equipes');
    }
};
