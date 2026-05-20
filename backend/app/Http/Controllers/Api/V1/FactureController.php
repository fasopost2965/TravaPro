<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Facture;
use App\Models\Paiement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FactureController extends Controller
{
    public function index(Request $request)
    {
        $query = Facture::with(['chantier', 'client'])
            ->withSum('paiements', 'montant');

        if ($request->filled('statut')) {
            $query->where('statut', $request->statut);
        }
        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('numero', 'like', "%{$s}%")
                  ->orWhereHas('client', fn($c) => $c->where('nom_entreprise', 'like', "%{$s}%"));
            });
        }

        return response()->json($query->orderBy('created_at', 'desc')->paginate(15));
    }

    public function show(Facture $facture)
    {
        $facture->load(['chantier', 'client', 'lignes', 'paiements']);
        return response()->json(['data' => $facture]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'chantier_id'   => 'required|exists:chantiers,id',
            'client_id'     => 'required|exists:clients,id',
            'date_emission' => 'required|date',
            'date_echeance' => 'required|date|after_or_equal:date_emission',
            'montant_ht'    => 'required|numeric|min:0',
            'tva'           => 'nullable|numeric|min:0|max:100',
            'notes'         => 'nullable|string',
            'lignes'        => 'nullable|array',
            'lignes.*.description' => 'required|string',
            'lignes.*.quantite'    => 'required|numeric|min:0',
            'lignes.*.prix_unitaire' => 'required|numeric|min:0',
        ]);

        DB::beginTransaction();
        try {
            $tva = $validated['tva'] ?? 20;
            $montant_ttc = $validated['montant_ht'] * (1 + $tva / 100);
            $numero = 'FAC-' . date('Y') . '-' . str_pad(Facture::count() + 1, 4, '0', STR_PAD_LEFT);

            $facture = Facture::create([
                'numero'        => $numero,
                'chantier_id'   => $validated['chantier_id'],
                'client_id'     => $validated['client_id'],
                'date_emission' => $validated['date_emission'],
                'date_echeance' => $validated['date_echeance'],
                'montant_ht'    => $validated['montant_ht'],
                'tva'           => $tva,
                'montant_ttc'   => $montant_ttc,
                'statut'        => 'brouillon',
                'notes'         => $validated['notes'] ?? null,
            ]);

            if (!empty($validated['lignes'])) {
                foreach ($validated['lignes'] as $ligne) {
                    $facture->lignes()->create([
                        'description'   => $ligne['description'],
                        'quantite'      => $ligne['quantite'],
                        'prix_unitaire' => $ligne['prix_unitaire'],
                        'total'         => $ligne['quantite'] * $ligne['prix_unitaire'],
                    ]);
                }
            }

            DB::commit();
            return response()->json(['data' => $facture->load(['lignes', 'paiements']), 'message' => 'Facture créée.'], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Erreur: ' . $e->getMessage()], 500);
        }
    }

    public function update(Request $request, Facture $facture)
    {
        $validated = $request->validate([
            'statut'        => 'sometimes|in:brouillon,envoyee,payee,partiellement_payee,en_retard',
            'date_echeance' => 'sometimes|date',
            'notes'         => 'nullable|string',
        ]);
        $facture->update($validated);
        return response()->json(['data' => $facture, 'message' => 'Facture mise à jour.']);
    }

    public function destroy(Facture $facture)
    {
        $facture->delete();
        return response()->json(['message' => 'Facture supprimée.']);
    }

    public function addPaiement(Request $request, Facture $facture)
    {
        $validated = $request->validate([
            'montant' => 'required|numeric|min:0',
            'date'    => 'required|date',
            'mode'    => 'required|in:especes,virement,cheque,carte',
            'notes'   => 'nullable|string',
        ]);

        $paiement = $facture->paiements()->create($validated);

        // Recalculate status
        $totalPaye = $facture->paiements()->sum('montant');
        if ($totalPaye >= $facture->montant_ttc) {
            $facture->update(['statut' => 'payee']);
        } elseif ($totalPaye > 0) {
            $facture->update(['statut' => 'partiellement_payee']);
        }

        return response()->json(['data' => $paiement, 'message' => 'Paiement ajouté.'], 201);
    }
}
