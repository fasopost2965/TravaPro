<?php

namespace Database\Factories;

use App\Models\ChantierEtape;
use App\Models\Chantier;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ChantierEtape>
 */
class ChantierEtapeFactory extends Factory
{
    protected $model = ChantierEtape::class;

    public function definition(): array
    {
        return [
            'chantier_id' => Chantier::factory(),
            'titre'       => fake()->sentence(2),
            'description' => fake()->sentence(),
            'ordre'       => fake()->numberBetween(1, 10),
            'statut'      => fake()->randomElement(['en_attente', 'en_cours', 'termine']),
            'date_debut'  => fake()->date(),
            'date_fin'    => fake()->date(),
        ];
    }
}
