<?php

namespace Database\Seeders;

use App\Models\Client;
use Illuminate\Database\Seeder;

class ClientSeeder extends Seeder
{
    public function run(): void
    {
        $clients = [
            [
                'nom_entreprise' => 'Groupe Immobilier Atlas',
                'contact_nom'    => 'Hassan Berrada',
                'email'          => 'h.berrada@atlas-immo.ma',
                'telephone'      => '+212522001001',
                'adresse'        => '45 Boulevard Zerktouni, Casablanca',
                'ice'            => '001234567000012',
            ],
            [
                'nom_entreprise' => 'Résidences du Bou Regreg',
                'contact_nom'    => 'Fatima Chraibi',
                'email'          => 'f.chraibi@bouregreg.ma',
                'telephone'      => '+212537002002',
                'adresse'        => '12 Avenue Hassan II, Rabat',
                'ice'            => '002345678000034',
            ],
            [
                'nom_entreprise' => 'Hôtel Palmeraie Marrakech',
                'contact_nom'    => 'Ahmed Tazi',
                'email'          => 'a.tazi@palmeraie.ma',
                'telephone'      => '+212524003003',
                'adresse'        => 'Route de Fès, Km 6, Marrakech',
                'ice'            => '003456789000056',
            ],
            [
                'nom_entreprise' => 'Complexe Souss Agadir',
                'contact_nom'    => 'Zineb Ait Benhaddou',
                'email'          => 'z.ait@souss-agadir.ma',
                'telephone'      => '+212528004004',
                'adresse'        => 'Zone Industrielle Aït Melloul, Agadir',
                'ice'            => '004567890000078',
            ],
            [
                'nom_entreprise' => 'Promoteur Détroit Tanger',
                'contact_nom'    => 'Omar Kettani',
                'email'          => 'o.kettani@detroit-tanger.ma',
                'telephone'      => '+212539005005',
                'adresse'        => '88 Avenue Mohammed VI, Tanger',
                'ice'            => '005678901000090',
            ],
        ];

        foreach ($clients as $client) {
            Client::create($client);
        }
    }
}
