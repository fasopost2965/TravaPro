<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Pointage;
use Illuminate\Http\Request;

class PointageController extends Controller
{
    public function index(Request $request)
    {
        $pointages = Pointage::where('user_id', auth()->id())
            ->whereDate('created_at', today())
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json(['data' => $pointages]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'chantier_id' => 'required|exists:chantiers,id',
            'type'        => 'required|in:arrivee,depart',
            'latitude'    => 'nullable|numeric',
            'longitude'   => 'nullable|numeric',
        ]);

        $pointage = Pointage::create([
            ...$validated,
            'user_id' => auth()->id(),
        ]);

        return response()->json(['data' => $pointage, 'message' => 'Pointage enregistré.'], 201);
    }
}
