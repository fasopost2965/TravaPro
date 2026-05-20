<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChantierEtape extends Model
{
    use HasFactory;

    protected $fillable = [
        'chantier_id', 'titre', 'description',
        'ordre', 'statut', 'date_debut', 'date_fin',
    ];

    protected $casts = [
        'date_debut' => 'date',
        'date_fin'   => 'date',
    ];

    public function chantier()
    {
        return $this->belongsTo(Chantier::class);
    }
}
