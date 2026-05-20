<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Chantier\StoreChantierRequest;
use App\Http\Requests\Chantier\UpdateChantierRequest;
use App\Http\Resources\ChantierResource;
use App\Models\Chantier;
use Illuminate\Http\Request;

class ChantierController extends Controller
{
    public function index(Request $request)
    {
        $query = Chantier::with(['client', 'chef'])->withCount(['etapes', 'equipe']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('titre', 'like', "%{$search}%")
                    ->orWhere('adresse', 'like', "%{$search}%")
                    ->orWhere('ville', 'like', "%{$search}%")
                    ->orWhere('statut', 'like', "%{$search}%");
            });
        }

        if ($request->filled('statut')) {
            $query->where('statut', $request->statut);
        }

        $chantiers = $query->orderBy('date_debut', 'desc')
            ->paginate($request->get('per_page', 15));

        return ChantierResource::collection($chantiers)->additional([
            'message' => 'Liste des chantiers.',
            'status'  => true,
        ]);
    }

    public function store(StoreChantierRequest $request)
    {
        $chantier = Chantier::create($request->validated());

        return (new ChantierResource($chantier->load(['client', 'chef'])))->additional([
            'message' => 'Chantier créé avec succès.',
            'status'  => true,
        ])->response()->setStatusCode(201);
    }

    public function show(Chantier $chantier)
    {
        $chantier->load(['client', 'chef'])->loadCount(['etapes', 'equipe']);

        return (new ChantierResource($chantier))->additional([
            'message' => 'Détail du chantier.',
            'status'  => true,
        ]);
    }

    public function update(UpdateChantierRequest $request, Chantier $chantier)
    {
        $chantier->update($request->validated());

        return (new ChantierResource($chantier->load(['client', 'chef'])))->additional([
            'message' => 'Chantier mis à jour.',
            'status'  => true,
        ]);
    }

    public function destroy(Chantier $chantier)
    {
        $chantier->delete();

        return response()->json([
            'data'    => null,
            'message' => 'Chantier supprimé.',
            'status'  => true,
        ]);
    }

    public function etapes(Chantier $chantier)
    {
        return response()->json(['data' => $chantier->etapes()->orderBy('ordre')->get()]);
    }

    public function equipe(Chantier $chantier)
    {
        return response()->json(['data' => $chantier->equipe()->with('user')->get()]);
    }
}
