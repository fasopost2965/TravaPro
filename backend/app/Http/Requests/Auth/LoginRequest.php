<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email'    => ['required', 'email'],
            'password' => ['required', 'string', 'min:6'],
            'role'     => ['required', 'in:admin,chef_chantier,technicien'],
        ];
    }

    public function messages(): array
    {
        return [
            'email.required'    => 'L\'email est obligatoire.',
            'email.email'       => 'Format email invalide.',
            'password.required' => 'Le mot de passe est obligatoire.',
            'password.min'      => 'Minimum 6 caractères.',
            'role.required'     => 'Le rôle est obligatoire.',
            'role.in'           => 'Rôle invalide.',
        ];
    }
}
