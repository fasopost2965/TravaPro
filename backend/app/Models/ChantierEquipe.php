<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChantierEquipe extends Model
{
    use HasFactory;

    protected $fillable = [
        'chantier_id', 'user_id', 'role_chantier', 'date_affectation',
    ];

    protected $casts = [
        'date_affectation' => 'date',
    ];

    public function chantier()
    {
        return $this->belongsTo(Chantier::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
