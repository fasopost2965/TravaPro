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
        Schema::create('paiements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('facture_id')->constrained('factures')->onDelete('cascade');
            $table->string('reference')->unique()->nullable();
            $table->enum('mode_paiement', ['especes', 'cheque', 'virement', 'effet']);
            $table->decimal('montant', 12, 2);
            $table->date('date_paiement');
            $table->enum('statut', ['en_attente', 'encaisse', 'rejete'])->default('encaisse');
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
        Schema::dropIfExists('paiements');
    }
};
