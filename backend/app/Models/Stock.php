<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Stock extends Model
{
    use HasFactory;

    protected $fillable = [
        'categorie_id', 'designation', 'reference',
        'quantite', 'unite', 'prix_unitaire', 'seuil_alerte',
    ];

    protected $casts = [
        'quantite'      => 'decimal:2',
        'prix_unitaire' => 'decimal:2',
        'seuil_alerte'  => 'decimal:2',
    ];

    public function categorie()
    {
        return $this->belongsTo(StockCategorie::class, 'categorie_id');
    }

    public function mouvements()
    {
        return $this->hasMany(StockMouvement::class);
    }
}
