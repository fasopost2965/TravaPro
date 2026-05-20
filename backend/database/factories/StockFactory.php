<?php

namespace Database\Factories;

use App\Models\Stock;
use App\Models\StockCategorie;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Stock>
 */
class StockFactory extends Factory
{
    protected $model = Stock::class;

    public function definition(): array
    {
        return [
            'categorie_id' => StockCategorie::factory(),
            'designation'  => fake()->words(3, true),
            'reference'    => fake()->unique()->bothify('STK-???-###'),
            'quantite'     => fake()->randomFloat(2, 1, 500),
            'unite'        => fake()->randomElement(['unité', 'm³', 'sac', 'ml', 'rouleau', 'bidon']),
            'prix_unitaire'=> fake()->randomFloat(2, 10, 500),
            'seuil_alerte' => fake()->randomFloat(2, 1, 50),
        ];
    }
}
