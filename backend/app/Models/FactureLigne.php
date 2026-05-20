<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FactureLigne extends Model
{
    use HasFactory;

    protected $fillable = [
        'facture_id', 'designation', 'quantite',
        'unite', 'prix_unitaire', 'total',
    ];

    protected $casts = [
        'quantite'      => 'decimal:2',
        'prix_unitaire' => 'decimal:2',
        'total'         => 'decimal:2',
    ];

    public function facture()
    {
        return $this->belongsTo(Facture::class);
    }
}
