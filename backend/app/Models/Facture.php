<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Facture extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id', 'chantier_id', 'devis_id', 'numero',
        'statut', 'date_emission', 'date_echeance',
        'montant_ht', 'tva', 'montant_ttc', 'notes',
    ];

    protected $casts = [
        'date_emission' => 'date',
        'date_echeance' => 'date',
        'montant_ht'    => 'decimal:2',
        'tva'           => 'decimal:2',
        'montant_ttc'   => 'decimal:2',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function chantier()
    {
        return $this->belongsTo(Chantier::class);
    }

    public function devis()
    {
        return $this->belongsTo(Devis::class);
    }

    public function lignes()
    {
        return $this->hasMany(FactureLigne::class);
    }

    public function paiements()
    {
        return $this->hasMany(Paiement::class);
    }
}
