<?php

namespace Database\Seeders;

use App\Models\Chantier;
use App\Models\ChantierEtape;
use App\Models\ChantierEquipe;
use Illuminate\Database\Seeder;

class ChantierSeeder extends Seeder
{
    public function run(): void
    {
        $c1 = Chantier::create([
            'client_id'       => 1,
            'chef_id'         => 2,
            'titre'           => 'Construction Villa R+2 Casablanca',
            'description'     => 'Construction d\'une villa R+2 avec piscine, quartier Californie.',
            'adresse'         => 'Lot 12, Quartier Californie',
            'ville'           => 'Casablanca',
            'statut'          => 'en_cours',
            'date_debut'      => '2026-02-01',
            'date_fin_prevue' => '2026-09-30',
            'budget'          => 1850000.00,
            'latitude'        => 33.5731,
            'longitude'       => -7.5898,
        ]);

        ChantierEtape::insert([
            ['chantier_id' => $c1->id, 'titre' => 'Fondations',        'ordre' => 1, 'statut' => 'termine',   'date_debut' => '2026-02-01', 'date_fin' => '2026-03-15', 'description' => null, 'created_at' => now(), 'updated_at' => now()],
            ['chantier_id' => $c1->id, 'titre' => 'Gros œuvre',        'ordre' => 2, 'statut' => 'en_cours',  'date_debut' => '2026-03-16', 'date_fin' => '2026-06-30', 'description' => null, 'created_at' => now(), 'updated_at' => now()],
            ['chantier_id' => $c1->id, 'titre' => 'Plomberie & Élec.', 'ordre' => 3, 'statut' => 'en_attente','date_debut' => '2026-07-01', 'date_fin' => '2026-08-15', 'description' => null, 'created_at' => now(), 'updated_at' => now()],
            ['chantier_id' => $c1->id, 'titre' => 'Finitions',         'ordre' => 4, 'statut' => 'en_attente','date_debut' => '2026-08-16', 'date_fin' => '2026-09-30', 'description' => null, 'created_at' => now(), 'updated_at' => now()],
        ]);

        ChantierEquipe::insert([
            ['chantier_id' => $c1->id, 'user_id' => 2, 'role_chantier' => 'Chef de chantier', 'date_affectation' => '2026-02-01', 'created_at' => now(), 'updated_at' => now()],
            ['chantier_id' => $c1->id, 'user_id' => 3, 'role_chantier' => 'Plombier',         'date_affectation' => '2026-02-01', 'created_at' => now(), 'updated_at' => now()],
            ['chantier_id' => $c1->id, 'user_id' => 4, 'role_chantier' => 'Électricien',      'date_affectation' => '2026-02-01', 'created_at' => now(), 'updated_at' => now()],
        ]);

        $c2 = Chantier::create([
            'client_id'       => 2,
            'chef_id'         => 5,
            'titre'           => 'Rénovation Appartements Rabat',
            'description'     => 'Rénovation complète de 8 appartements, résidence Souissi.',
            'adresse'         => 'Résidence Souissi, Bloc B',
            'ville'           => 'Rabat',
            'statut'          => 'en_cours',
            'date_debut'      => '2026-03-15',
            'date_fin_prevue' => '2026-07-31',
            'budget'          => 640000.00,
            'latitude'        => 33.9716,
            'longitude'       => -6.8498,
        ]);

        ChantierEtape::insert([
            ['chantier_id' => $c2->id, 'titre' => 'Démolition & Préparation', 'ordre' => 1, 'statut' => 'termine',  'date_debut' => '2026-03-15', 'date_fin' => '2026-04-01', 'description' => null, 'created_at' => now(), 'updated_at' => now()],
            ['chantier_id' => $c2->id, 'titre' => 'Carrelage & Revêtements',  'ordre' => 2, 'statut' => 'en_cours', 'date_debut' => '2026-04-02', 'date_fin' => '2026-06-15', 'description' => null, 'created_at' => now(), 'updated_at' => now()],
            ['chantier_id' => $c2->id, 'titre' => 'Peinture & Finitions',     'ordre' => 3, 'statut' => 'en_attente','date_debut' => '2026-06-16', 'date_fin' => '2026-07-31', 'description' => null, 'created_at' => now(), 'updated_at' => now()],
        ]);

        ChantierEquipe::insert([
            ['chantier_id' => $c2->id, 'user_id' => 5, 'role_chantier' => 'Chef de chantier', 'date_affectation' => '2026-03-15', 'created_at' => now(), 'updated_at' => now()],
            ['chantier_id' => $c2->id, 'user_id' => 3, 'role_chantier' => 'Technicien',       'date_affectation' => '2026-03-15', 'created_at' => now(), 'updated_at' => now()],
        ]);

        Chantier::create([
            'client_id'       => 3,
            'chef_id'         => 2,
            'titre'           => 'Extension Hôtel Palmeraie Marrakech',
            'description'     => 'Construction d\'une aile supplémentaire de 20 chambres.',
            'adresse'         => 'Route de Fès, Km 6',
            'ville'           => 'Marrakech',
            'statut'          => 'planifie',
            'date_debut'      => '2026-07-01',
            'date_fin_prevue' => '2027-01-31',
            'budget'          => 3200000.00,
            'latitude'        => 31.6295,
            'longitude'       => -7.9811,
        ]);
    }
}
