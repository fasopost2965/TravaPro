<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RapportPhoto extends Model
{
    use HasFactory;

    protected $fillable = [
        'rapport_journalier_id', 'chemin', 'legende',
    ];

    public function rapport()
    {
        return $this->belongsTo(RapportJournalier::class, 'rapport_journalier_id');
    }
}
