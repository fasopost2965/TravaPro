<?php

namespace App\Http\Requests\Client;

use Illuminate\Foundation\Http\FormRequest;

class StoreClientRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nom_entreprise' => ['required', 'string', 'max:255'],
            'contact_nom'    => ['nullable', 'string', 'max:255'],
            'email'          => ['nullable', 'email', 'max:255'],
            'telephone'      => ['nullable', 'string', 'max:30'],
            'adresse'        => ['nullable', 'string'],
            'ice'            => ['nullable', 'string', 'max:15'],
        ];
    }

    public function messages(): array
    {
        return [
            'nom_entreprise.required' => 'Le nom de l\'entreprise est obligatoire.',
            'email.email'             => 'Format email invalide.',
            'ice.max'                 => 'L\'ICE ne peut pas dépasser 15 caractères.',
        ];
    }
}
