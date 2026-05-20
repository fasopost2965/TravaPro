<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'name', 'email', 'password', 'role', 'phone', 'avatar',
        'status', 'specialite', 'date_embauche', 'salaire_base',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'date_embauche'     => 'date',
        'salaire_base'      => 'decimal:2',
        'password'          => 'hashed',
    ];

    public function chantiersChef()
    {
        return $this->hasMany(Chantier::class, 'chef_id');
    }

    public function chantierEquipes()
    {
        return $this->hasMany(ChantierEquipe::class);
    }

    public function rapportsJournaliers()
    {
        return $this->hasMany(RapportJournalier::class);
    }

    public function pointages()
    {
        return $this->hasMany(Pointage::class);
    }
}