<?php

namespace Database\Seeders;

use App\Models\Brand;
use Illuminate\Database\Seeder;

class BrandSeeder extends Seeder
{
    /**
     * Seed the application's database with luxury cosmetics brands.
     */
    public function run(): void
    {
        $brands = [
            [
                'name' => 'Dior',
                'slug' => 'dior',
                'description' => 'Founded in 1946 by Christian Dior, the House of Dior has been defining luxury with timeless elegance and revolutionary style for over seven decades.',
                'country' => 'France',
                'is_featured' => true,
            ],
            [
                'name' => 'Chanel',
                'slug' => 'chanel',
                'description' => 'Chanel is a Parisian fashion house founded in 1910 by Coco Chanel. The brand is synonymous with refined luxury, femininity, and timeless style.',
                'country' => 'France',
                'is_featured' => true,
            ],
            [
                'name' => 'Yves Saint Laurent',
                'slug' => 'yves-saint-laurent',
                'description' => 'YSL is a French luxury fashion house founded in 1961. Known for its bold, provocative designs and iconic fragrances that embody modern sensuality.',
                'country' => 'France',
                'is_featured' => true,
            ],
            [
                'name' => 'Tom Ford',
                'slug' => 'tom-ford',
                'description' => 'Tom Ford Beauty represents the pinnacle of luxury and sophistication. Each product is crafted with obsessive attention to detail and the finest ingredients.',
                'country' => 'United States',
                'is_featured' => true,
            ],
            [
                'name' => 'Guerlain',
                'slug' => 'guerlain',
                'description' => 'Since 1828, Guerlain has been crafting exceptional fragrances and beauty products. A heritage of innovation, elegance, and artistic mastery.',
                'country' => 'France',
                'is_featured' => true,
            ],
            [
                'name' => 'La Mer',
                'slug' => 'la-mer',
                'description' => 'Born from the sea, La Mer\'s legendary Miracle Broth™ infuses every product. Ultra-luxurious skincare that transforms skin with the power of the ocean.',
                'country' => 'United States',
                'is_featured' => true,
            ],
            [
                'name' => 'Charlotte Tilbury',
                'slug' => 'charlotte-tilbury',
                'description' => 'Celebrity makeup artist Charlotte Tilbury created her eponymous brand to share her decades of expertise. Glamorous, easy-to-use makeup loved by stars.',
                'country' => 'United Kingdom',
                'is_featured' => true,
            ],
            [
                'name' => 'Lancôme',
                'slug' => 'lancome',
                'description' => 'Lancôme is a French luxury perfumes and cosmetics house, founded in 1935. A symbol of French elegance with a passion for innovation.',
                'country' => 'France',
                'is_featured' => false,
            ],
            [
                'name' => 'Cartier',
                'slug' => 'cartier',
                'description' => 'Cartier is a French luxury goods conglomerate founded in 1847. The "jeweler of kings and king of jewelers" — synonymous with exquisite craftsmanship.',
                'country' => 'France',
                'is_featured' => true,
            ],
            [
                'name' => 'Bulgari',
                'slug' => 'bulgari',
                'description' => 'Bulgari is an Italian luxury brand known for its jewelry, watches, fragrances, and leather goods. Bold Roman style meets contemporary magnificence.',
                'country' => 'Italy',
                'is_featured' => false,
            ],
            [
                'name' => 'Hermès',
                'slug' => 'hermes',
                'description' => 'Hermès is a French luxury goods manufacturer established in 1837. Their fragrances embody the house\'s spirit of craftsmanship and creative freedom.',
                'country' => 'France',
                'is_featured' => true,
            ],
            [
                'name' => 'Jo Malone',
                'slug' => 'jo-malone',
                'description' => 'Jo Malone London is a British perfume and scented candle brand known for its elegant simplicity and the art of fragrance combining.',
                'country' => 'United Kingdom',
                'is_featured' => false,
            ],
            [
                'name' => 'Creed',
                'slug' => 'creed',
                'description' => 'House of Creed is a multi-generational, privately held fragrance house founded in 1760. The oldest privately held fragrance house in the world.',
                'country' => 'France',
                'is_featured' => true,
            ],
            [
                'name' => 'Louis Vuitton',
                'slug' => 'louis-vuitton',
                'description' => 'Louis Vuitton is a French fashion house and luxury retail company founded in 1854. Their fragrance collection captures the spirit of travel and adventure.',
                'country' => 'France',
                'is_featured' => true,
            ],
            [
                'name' => 'Givenchy',
                'slug' => 'givenchy',
                'description' => 'Givenchy is a French luxury fashion and perfume house. Founded in 1952, it embodies aristocratic elegance combined with audacious style.',
                'country' => 'France',
                'is_featured' => false,
            ],
            [
                'name' => 'Versace',
                'slug' => 'versace',
                'description' => 'Versace is an Italian luxury fashion company founded in 1978. Bold, glamorous, and unapologetically luxurious fragrances and beauty products.',
                'country' => 'Italy',
                'is_featured' => false,
            ],
        ];

        foreach ($brands as $brand) {
            Brand::create($brand);
        }
    }
}
