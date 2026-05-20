<?php

namespace Database\Seeders;

use App\Models\Stock;
use Illuminate\Database\Seeder;

class StockSeeder extends Seeder
{
    public function run(): void
    {
        $stocks = [
            ['categorie_id' => 1, 'designation' => 'Ciment Portland 50kg', 'reference' => 'GRO-CIM-001', 'quantite' => 200, 'unite' => 'sac',    'prix_unitaire' => 85.00,  'seuil_alerte' => 30],
            ['categorie_id' => 1, 'designation' => 'Sable fin (m³)',        'reference' => 'GRO-SAB-001', 'quantite' => 50,  'unite' => 'm³',    'prix_unitaire' => 150.00, 'seuil_alerte' => 10],
            ['categorie_id' => 1, 'designation' => 'Gravier 8/15',          'reference' => 'GRO-GRA-001', 'quantite' => 40,  'unite' => 'm³',    'prix_unitaire' => 140.00, 'seuil_alerte' => 10],
            ['categorie_id' => 1, 'designation' => 'Brique creuse 8 trous', 'reference' => 'GRO-BRI-001', 'quantite' => 5000,'unite' => 'unité', 'prix_unitaire' => 2.50,   'seuil_alerte' => 500],
            ['categorie_id' => 2, 'designation' => 'Tube PVC Ø 100mm',     'reference' => 'PLO-TUB-001', 'quantite' => 80,  'unite' => 'ml',    'prix_unitaire' => 18.00,  'seuil_alerte' => 20],
            ['categorie_id' => 2, 'designation' => 'Robinet mitigeur',      'reference' => 'PLO-ROB-001', 'quantite' => 25,  'unite' => 'unité', 'prix_unitaire' => 220.00, 'seuil_alerte' => 5],
            ['categorie_id' => 3, 'designation' => 'Câble 2.5mm² (rl 100m)','reference' => 'ELE-CAB-001', 'quantite' => 15,  'unite' => 'rouleau','prix_unitaire' => 380.00,'seuil_alerte' => 3],
            ['categorie_id' => 3, 'designation' => 'Disjoncteur 16A',      'reference' => 'ELE-DIS-001', 'quantite' => 40,  'unite' => 'unité', 'prix_unitaire' => 65.00,  'seuil_alerte' => 10],
            ['categorie_id' => 6, 'designation' => 'Peinture blanche 25L',  'reference' => 'PEI-BLA-001', 'quantite' => 30,  'unite' => 'bidon', 'prix_unitaire' => 310.00, 'seuil_alerte' => 5],
            ['categorie_id' => 6, 'designation' => 'Enduit de finition 25kg','reference' => 'PEI-END-001','quantite' => 60,  'unite' => 'sac',   'prix_unitaire' => 95.00,  'seuil_alerte' => 10],
        ];

        foreach ($stocks as $stock) {
            Stock::create($stock);
        }
    }
}
