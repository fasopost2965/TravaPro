<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DevisLigne extends Model
{
    use HasFactory;

    protected $fillable = [
        'devis_id', 'designation', 'quantite',
        'unite', 'prix_unitaire', 'total',
    ];

    protected $casts = [
        'quantite'      => 'decimal:2',
        'prix_unitaire' => 'decimal:2',
        'total'         => 'decimal:2',
    ];

    public function devis()
    {
        return $this->belongsTo(Devis::class);
    }
}
