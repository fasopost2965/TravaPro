<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Client\StoreClientRequest;
use App\Http\Requests\Client\UpdateClientRequest;
use App\Http\Resources\ClientResource;
use App\Models\Client;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    public function index(Request $request)
    {
        $query = Client::withCount('chantiers');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nom_entreprise', 'like', "%{$search}%")
                  ->orWhere('contact_nom',  'like', "%{$search}%")
                  ->orWhere('telephone',    'like', "%{$search}%")
                  ->orWhere('ice',          'like', "%{$search}%");
            });
        }

        $clients = $query->orderBy('nom_entreprise')->paginate($request->get('per_page', 15));

        return ClientResource::collection($clients)->additional([
            'message' => 'Liste des clients.',
            'status'  => true,
        ]);
    }

    public function store(StoreClientRequest $request)
    {
        $client = Client::create($request->validated());

        return (new ClientResource($client))->additional([
            'message' => 'Client créé avec succès.',
            'status'  => true,
        ])->response()->setStatusCode(201);
    }

    public function show(Client $client)
    {
        $client->loadCount('chantiers');

        return (new ClientResource($client))->additional([
            'message' => 'Détail client.',
            'status'  => true,
        ]);
    }

    public function update(UpdateClientRequest $request, Client $client)
    {
        $client->update($request->validated());

        return (new ClientResource($client))->additional([
            'message' => 'Client mis à jour.',
            'status'  => true,
        ]);
    }

    public function destroy(Client $client)
    {
        $client->delete();

        return response()->json([
            'data'    => null,
            'message' => 'Client supprimé.',
            'status'  => true,
        ]);
    }
}
