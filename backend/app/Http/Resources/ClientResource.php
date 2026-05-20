<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClientResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'              => $this->id,
            'nom_entreprise'  => $this->nom_entreprise,
            'contact_nom'     => $this->contact_nom,
            'email'           => $this->email,
            'telephone'       => $this->telephone,
            'adresse'         => $this->adresse,
            'ice'             => $this->ice,
            'chantiers_count' => $this->whenCounted('chantiers'),
            'created_at'      => $this->created_at->format('Y-m-d'),
        ];
    }
}
