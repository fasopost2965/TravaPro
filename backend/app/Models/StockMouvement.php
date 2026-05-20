<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockMouvement extends Model
{
    use HasFactory;

    protected $fillable = [
        'stock_id', 'chantier_id', 'user_id',
        'type', 'quantite', 'motif',
    ];

    protected $casts = [
        'quantite' => 'decimal:2',
    ];

    public function stock()
    {
        return $this->belongsTo(Stock::class);
    }

    public function chantier()
    {
        return $this->belongsTo(Chantier::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
