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
        Schema::create('chantier_etapes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('chantier_id')->constrained('chantiers')->onDelete('cascade');
            $table->string('titre');
            $table->text('description')->nullable();
            $table->enum('statut', ['a_faire', 'en_cours', 'en_attente', 'bloque', 'termine'])->default('a_faire');
            $table->date('date_debut')->nullable();
            $table->date('date_fin')->nullable();
            $table->integer('ordre')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chantier_etapes');
    }
};
