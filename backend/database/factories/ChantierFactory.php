<?php

namespace Database\Factories;

use App\Models\Chantier;
use App\Models\Client;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Chantier>
 */
class ChantierFactory extends Factory
{
    protected $model = Chantier::class;

    public function definition(): array
    {
        return [
            'client_id'       => Client::factory(),
            'chef_id'         => User::factory(),
            'titre'           => fake()->sentence(3),
            'description'     => fake()->paragraph(),
            'adresse'         => fake()->streetAddress(),
            'ville'           => fake()->city(),
            'statut'          => fake()->randomElement(['planifie', 'en_cours', 'termine']),
            'date_debut'      => fake()->date(),
            'date_fin_prevue' => fake()->date(),
            'date_fin_reelle' => null,
            'budget'          => fake()->randomFloat(2, 100000, 5000000),
            'latitude'        => fake()->latitude(),
            'longitude'       => fake()->longitude(),
        ];
    }
}
