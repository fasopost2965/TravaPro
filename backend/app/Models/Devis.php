<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Devis extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id', 'chantier_id', 'numero', 'statut',
        'date_emission', 'date_validite', 'montant_ht',
        'tva', 'montant_ttc', 'notes',
    ];

    protected $casts = [
        'date_emission' => 'date',
        'date_validite' => 'date',
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

    public function lignes()
    {
        return $this->hasMany(DevisLigne::class);
    }

    public function facture()
    {
        return $this->hasOne(Facture::class);
    }
}
