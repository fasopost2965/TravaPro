<?php

namespace Database\Factories;

use App\Models\Client;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Client>
 */
class ClientFactory extends Factory
{
    protected $model = Client::class;

    public function definition(): array
    {
        return [
            'nom_entreprise' => fake()->company(),
            'contact_nom'    => fake()->name(),
            'email'          => fake()->unique()->companyEmail(),
            'telephone'      => fake()->phoneNumber(),
            'adresse'        => fake()->address(),
            'ice'            => fake()->numerify('###############'),
        ];
    }
}
