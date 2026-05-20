<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RapportJournalier extends Model
{
    use HasFactory;

    protected $fillable = [
        'chantier_id', 'user_id', 'date_rapport',
        'avancement', 'observations', 'meteo',
    ];

    protected $casts = [
        'date_rapport' => 'date',
        'avancement'   => 'integer',
    ];

    public function chantier()
    {
        return $this->belongsTo(Chantier::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function materiaux()
    {
        return $this->hasMany(RapportMateriau::class);
    }

    public function photos()
    {
        return $this->hasMany(RapportPhoto::class);
    }
}
