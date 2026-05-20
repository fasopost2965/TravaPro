<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Chantier extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'client_id', 'chef_id', 'titre', 'description',
        'adresse', 'ville', 'statut', 'date_debut',
        'date_fin_prevue', 'date_fin_reelle', 'budget',
        'latitude', 'longitude',
    ];

    protected $casts = [
        'date_debut'      => 'date',
        'date_fin_prevue' => 'date',
        'date_fin_reelle' => 'date',
        'budget'          => 'decimal:2',
        'latitude'        => 'decimal:7',
        'longitude'       => 'decimal:7',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function chef()
    {
        return $this->belongsTo(User::class, 'chef_id');
    }

    public function etapes()
    {
        return $this->hasMany(ChantierEtape::class);
    }

    public function equipe()
    {
        return $this->hasMany(ChantierEquipe::class);
    }

    public function rapportsJournaliers()
    {
        return $this->hasMany(RapportJournalier::class);
    }

    public function devis()
    {
        return $this->hasMany(Devis::class);
    }

    public function factures()
    {
        return $this->hasMany(Facture::class);
    }
}
