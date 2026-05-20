<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pointage extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'chantier_id', 'date_pointage',
        'heure_entree', 'heure_sortie', 'latitude_entree',
        'longitude_entree', 'latitude_sortie', 'longitude_sortie',
        'notes',
    ];

    protected $casts = [
        'date_pointage'    => 'date',
        'latitude_entree'  => 'decimal:7',
        'longitude_entree' => 'decimal:7',
        'latitude_sortie'  => 'decimal:7',
        'longitude_sortie' => 'decimal:7',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function chantier()
    {
        return $this->belongsTo(Chantier::class);
    }
}
