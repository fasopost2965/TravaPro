<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class PersonnelController extends Controller
{
    public function index(Request $request)
    {
        $query = User::where('role', '!=', 'admin')
            ->withCount('pointages');

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('name', 'like', "%{$s}%")
                  ->orWhere('email', 'like', "%{$s}%");
            });
        }

        return response()->json($query->orderBy('name')->paginate(20));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'  => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'role'  => 'required|in:chef_chantier,technicien',
        ]);

        $user = User::create([
            ...$validated,
            'password' => Hash::make('TravaPro2024!'),
        ]);

        return response()->json(['data' => $user, 'message' => 'Membre créé.'], 201);
    }

    public function show(User $user)
    {
        return response()->json(['data' => $user->loadCount('pointages')]);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name'  => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'role'  => 'sometimes|in:chef_chantier,technicien',
        ]);
        $user->update($validated);
        return response()->json(['data' => $user, 'message' => 'Membre mis à jour.']);
    }

    public function destroy(User $user)
    {
        $user->delete();
        return response()->json(['message' => 'Membre supprimé.']);
    }
}
