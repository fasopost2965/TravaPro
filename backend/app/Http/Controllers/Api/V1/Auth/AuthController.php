<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(LoginRequest $request)
    {
        if (!Auth::attempt([
            'email'    => $request->email,
            'password' => $request->password,
        ])) {
            return response()->json([
                'data'    => null,
                'message' => 'Email ou mot de passe incorrect.',
                'status'  => false,
            ], 401);
        }

        $user = Auth::user();

        if ($user->role !== $request->role) {
            Auth::logout();
            return response()->json([
                'data'    => null,
                'message' => 'Rôle incorrect pour cet utilisateur.',
                'status'  => false,
            ], 403);
        }

        if ($user->status !== 'active') {
            Auth::logout();
            return response()->json([
                'data'    => null,
                'message' => 'Compte désactivé. Contactez l\'administrateur.',
                'status'  => false,
            ], 403);
        }

        $token = $user->createToken('travapro_token')->plainTextToken;

        return response()->json([
            'data' => [
                'user'  => new UserResource($user),
                'token' => $token,
            ],
            'message' => 'Connexion réussie.',
            'status'  => true,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'data'    => null,
            'message' => 'Déconnexion réussie.',
            'status'  => true,
        ]);
    }

    public function me(Request $request)
    {
        return response()->json([
            'data'    => new UserResource($request->user()),
            'message' => 'Utilisateur authentifié.',
            'status'  => true,
        ]);
    }
}
