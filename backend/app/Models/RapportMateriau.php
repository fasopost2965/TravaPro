<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RapportMateriau extends Model
{
    use HasFactory;

    protected $fillable = [
        'rapport_journalier_id', 'stock_id', 'designation',
        'quantite', 'unite',
    ];

    protected $casts = [
        'quantite' => 'decimal:2',
    ];

    public function rapport()
    {
        return $this->belongsTo(RapportJournalier::class, 'rapport_journalier_id');
    }

    public function stock()
    {
        return $this->belongsTo(Stock::class);
    }
}
