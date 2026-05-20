<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\RapportJournalier;
use Illuminate\Http\Request;

class RapportController extends Controller
{
    public function index(Request $request)
    {
        $query = RapportJournalier::with(['user', 'chantier'])
            ->where('user_id', auth()->id());

        if ($request->filled('chantier_id')) {
            $query->where('chantier_id', $request->chantier_id);
        }

        return response()->json(['data' => $query->orderBy('date', 'desc')->get()]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'chantier_id'  => 'required|exists:chantiers,id',
            'date'         => 'required|date',
            'description'  => 'required|string',
            'observations' => 'nullable|string',
        ]);

        $rapport = RapportJournalier::create([
            ...$validated,
            'user_id' => auth()->id(),
        ]);

        return response()->json(['data' => $rapport->load(['user', 'chantier']), 'message' => 'Rapport enregistré.'], 201);
    }

    public function show(RapportJournalier $rapport)
    {
        return response()->json(['data' => $rapport->load(['user', 'chantier'])]);
    }
}
