<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\Auth\AuthController;
use App\Http\Controllers\Api\V1\ChantierController;
use App\Http\Controllers\Api\V1\ClientController;
use App\Http\Controllers\Api\V1\DashboardController;
use App\Http\Controllers\Api\V1\FactureController;
use App\Http\Controllers\Api\V1\PointageController;
use App\Http\Controllers\Api\V1\RapportController;
use App\Http\Controllers\Api\V1\PersonnelController;

/*
|--------------------------------------------------------------------------
| API Routes — TravaPro (Sprint 2)
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {

    // Routes publiques d'authentification
    Route::prefix('auth')->group(function () {
        Route::post('login', [AuthController::class, 'login']);
    });

    // Routes protégées d'authentification (Bearer Token Sanctum)
    Route::middleware('auth:sanctum')->group(function () {

        Route::prefix('auth')->group(function () {
            Route::post('logout', [AuthController::class, 'logout']);
            Route::get('me', [AuthController::class, 'me']);
        });

        Route::apiResource('clients', ClientController::class);
        Route::apiResource('chantiers', ChantierController::class);
        Route::get('chantiers/{chantier}/etapes', [ChantierController::class, 'etapes']);
        Route::get('chantiers/{chantier}/equipe', [ChantierController::class, 'equipe']);
        Route::get('chantiers/{chantier}/rapports', [RapportController::class, 'index']);
        Route::get('dashboard', [DashboardController::class, 'index']);

        Route::apiResource('factures', FactureController::class);
        Route::post('factures/{facture}/paiements', [FactureController::class, 'addPaiement']);

        Route::apiResource('pointages', PointageController::class)->only(['index', 'store']);
        Route::apiResource('rapports', RapportController::class)->only(['index', 'store', 'show']);

        Route::apiResource('personnel', PersonnelController::class);

    });

});
