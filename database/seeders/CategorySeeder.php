<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Seed the application's database with luxury cosmetics categories.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Perfumes',
                'slug' => 'perfumes',
                'description' => 'Discover our exquisite collection of luxury fragrances from the world\'s most prestigious maisons. From timeless classics to modern masterpieces.',
                'image_url' => 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800',
                'sort_order' => 1,
            ],
            [
                'name' => 'Makeup',
                'slug' => 'makeup',
                'description' => 'Elevate your beauty routine with premium makeup from iconic luxury brands. Lipsticks, foundations, palettes, and more.',
                'image_url' => 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800',
                'sort_order' => 2,
            ],
            [
                'name' => 'Skincare',
                'slug' => 'skincare',
                'description' => 'Indulge in the finest skincare formulations. Anti-aging serums, moisturizers, and treatments from world-renowned laboratories.',
                'image_url' => 'https://images.unsplash.com/photo-1570194065650-d99fb4a38c5f?w=800',
                'sort_order' => 3,
            ],
            [
                'name' => 'Jewelry',
                'slug' => 'jewelry',
                'description' => 'Timeless elegance meets modern design. Fine jewelry from the most celebrated maisons in the world.',
                'image_url' => 'https://images.unsplash.com/photo-1515562141589-67f0d569b6fc?w=800',
                'sort_order' => 4,
            ],
            [
                'name' => 'Accessories',
                'slug' => 'accessories',
                'description' => 'Complete your look with luxury accessories. Sunglasses, scarves, and more from iconic fashion houses.',
                'image_url' => 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800',
                'sort_order' => 5,
            ],
            [
                'name' => 'Gift Sets',
                'slug' => 'gift-sets',
                'description' => 'The perfect luxury gift. Beautifully curated sets featuring the finest fragrances, skincare, and beauty products.',
                'image_url' => 'https://images.unsplash.com/photo-1549465220-1a8b9238f760?w=800',
                'sort_order' => 6,
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
