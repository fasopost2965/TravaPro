<?php

namespace App\Http\Requests\Chantier;

use Illuminate\Foundation\Http\FormRequest;

class StoreChantierRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'client_id'       => ['required', 'integer', 'exists:clients,id'],
            'chef_id'         => ['required', 'integer', 'exists:users,id'],
            'titre'           => ['required', 'string', 'max:255'],
            'description'     => ['nullable', 'string'],
            'adresse'         => ['required', 'string', 'max:255'],
            'ville'           => ['required', 'string', 'max:255'],
            'statut'          => ['required', 'in:planifie,preparation,en_cours,suspendu,termine,annule'],
            'date_debut'      => ['nullable', 'date'],
            'date_fin_prevue' => ['nullable', 'date'],
            'date_fin_reelle' => ['nullable', 'date'],
            'budget'          => ['nullable', 'numeric', 'min:0'],
            'budget_consomme' => ['nullable', 'numeric', 'min:0'],
            'latitude'        => ['nullable', 'numeric', 'between:-90,90'],
            'longitude'       => ['nullable', 'numeric', 'between:-180,180'],
        ];
    }

    public function messages(): array
    {
        return [
            'client_id.required' => 'Le client est requis.',
            'chef_id.required'   => 'Le chef de chantier est requis.',
            'titre.required'     => 'Le titre du chantier est requis.',
            'adresse.required'   => 'L\'adresse est requise.',
            'ville.required'     => 'La ville est requise.',
            'statut.in'          => 'Le statut sélectionné est invalide.',
        ];
    }
}
