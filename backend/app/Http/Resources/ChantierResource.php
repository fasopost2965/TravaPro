<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ChantierResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                => $this->id,
            'client_id'         => $this->client_id,
            'chef_id'           => $this->chef_id,
            'titre'             => $this->titre,
            'description'       => $this->description,
            'adresse'           => $this->adresse,
            'ville'             => $this->ville,
            'statut'            => $this->statut,
            'date_debut'        => optional($this->date_debut)->format('Y-m-d'),
            'date_fin_prevue'   => optional($this->date_fin_prevue)->format('Y-m-d'),
            'date_fin_reelle'   => optional($this->date_fin_reelle)->format('Y-m-d'),
            'budget'            => $this->budget,
            'budget_consomme'   => $this->budget_consomme,
            'latitude'          => $this->latitude,
            'longitude'         => $this->longitude,
            'client'            => $this->whenLoaded('client') ? [
                'id'             => $this->client->id,
                'nom_entreprise' => $this->client->nom_entreprise,
            ] : null,
            'chef'              => $this->whenLoaded('chef') ? [
                'id'   => $this->chef->id,
                'name' => $this->chef->name,
            ] : null,
            'etapes_count'      => $this->whenCounted('etapes'),
            'equipe_count'      => $this->whenCounted('equipe'),
            'created_at'        => optional($this->created_at)->format('Y-m-d H:i:s'),
            'updated_at'        => optional($this->updated_at)->format('Y-m-d H:i:s'),
        ];
    }
}
