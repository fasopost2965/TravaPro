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
        Schema::create('rapports_journaliers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('chantier_id')->constrained('chantiers')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->date('date_rapport');
            $table->text('contenu');
            $table->string('meteo')->nullable();
            $table->decimal('heures_travaillees', 5, 2)->nullable();
            $table->enum('statut', ['brouillon', 'soumis', 'valide'])->default('brouillon');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rapports_journaliers');
    }
};
