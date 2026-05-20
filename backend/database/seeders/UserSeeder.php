<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            [
                'name'          => 'Karim Alaoui',
                'email'         => 'karim@travapro.ma',
                'password'      => Hash::make('password'),
                'role'          => 'admin',
                'phone'         => '+212661001001',
                'status'        => 'active',
                'specialite'    => 'Gestion générale',
                'date_embauche' => '2020-01-15',
                'salaire_base'  => 15000.00,
            ],
            [
                'name'          => 'Khalid Mansouri',
                'email'         => 'khalid@travapro.ma',
                'password'      => Hash::make('password'),
                'role'          => 'chef_chantier',
                'phone'         => '+212662002002',
                'status'        => 'active',
                'specialite'    => 'Maçonnerie & Béton',
                'date_embauche' => '2021-03-01',
                'salaire_base'  => 8500.00,
            ],
            [
                'name'          => 'Mohammed Raji',
                'email'         => 'mohammed@travapro.ma',
                'password'      => Hash::make('password'),
                'role'          => 'technicien',
                'phone'         => '+212663003003',
                'status'        => 'active',
                'specialite'    => 'Plomberie',
                'date_embauche' => '2022-06-10',
                'salaire_base'  => 5500.00,
            ],
            [
                'name'          => 'Sara Benkirane',
                'email'         => 'sara@travapro.ma',
                'password'      => Hash::make('password'),
                'role'          => 'technicien',
                'phone'         => '+212664004004',
                'status'        => 'active',
                'specialite'    => 'Électricité',
                'date_embauche' => '2022-09-01',
                'salaire_base'  => 5800.00,
            ],
            [
                'name'          => 'Youssef Alami',
                'email'         => 'youssef@travapro.ma',
                'password'      => Hash::make('password'),
                'role'          => 'chef_chantier',
                'phone'         => '+212665005005',
                'status'        => 'active',
                'specialite'    => 'Carrelage & Finitions',
                'date_embauche' => '2021-11-15',
                'salaire_base'  => 8000.00,
            ],
        ];

        foreach ($users as $user) {
            User::create($user);
        }
    }
}
