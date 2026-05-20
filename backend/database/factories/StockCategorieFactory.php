<?php

namespace Database\Factories;

use App\Models\StockCategorie;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\StockCategorie>
 */
class StockCategorieFactory extends Factory
{
    protected $model = StockCategorie::class;

    public function definition(): array
    {
        return [
            'nom' => fake()->unique()->word(),
            'description' => fake()->sentence(5),
        ];
    }
}
