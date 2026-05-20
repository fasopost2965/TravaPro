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
        Schema::create('factures', function (Blueprint $table) {
            $table->id();
            $table->foreignId('devis_id')->nullable()->constrained('devis')->onDelete('set null');
            $table->foreignId('chantier_id')->constrained('chantiers')->onDelete('cascade');
            $table->string('reference')->unique();
            $table->date('date_emission');
            $table->date('date_echeance')->nullable();
            $table->enum('statut', ['brouillon', 'impayee', 'partiel', 'payee', 'annulee'])->default('brouillon');
            $table->decimal('montant_ht', 12, 2)->default(0.00);
            $table->decimal('tva_taux', 5, 2)->default(20.00);
            $table->decimal('montant_tva', 12, 2)->default(0.00);
            $table->decimal('montant_ttc', 12, 2)->default(0.00);
            $table->decimal('montant_paye', 12, 2)->default(0.00);
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('factures');
    }
};
