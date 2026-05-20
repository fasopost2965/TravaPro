<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockCategorie extends Model
{
    use HasFactory;

    protected $fillable = ['nom', 'description'];

    public function stocks()
    {
        return $this->hasMany(Stock::class, 'categorie_id');
    }
}
