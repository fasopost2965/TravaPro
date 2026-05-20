<?php

namespace Database\Seeders;

use App\Models\StockCategorie;
use Illuminate\Database\Seeder;

class StockCategorieSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['nom' => 'Gros œuvre',        'description' => 'Ciment, sable, gravier, béton'],
            ['nom' => 'Plomberie',         'description' => 'Tuyaux, raccords, robinetterie'],
            ['nom' => 'Électricité',       'description' => 'Câbles, disjoncteurs, prises'],
            ['nom' => 'Carrelage',         'description' => 'Carreaux, colle, joint'],
            ['nom' => 'Menuiserie',        'description' => 'Portes, fenêtres, bois'],
            ['nom' => 'Peinture',          'description' => 'Peinture, enduit, primaire'],
            ['nom' => 'Outillage',         'description' => 'Outils manuels et électroportatifs'],
            ['nom' => 'Équipements lourds','description' => 'Bétonnières, échafaudages, compresseurs'],
        ];

        foreach ($categories as $cat) {
            StockCategorie::create($cat);
        }
    }
}
