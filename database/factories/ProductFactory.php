<?php

namespace Database\Factories;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->words(3, true);
        $price = fake()->randomFloat(2, 25, 500);

        return [
            'brand_id' => Brand::factory(),
            'category_id' => Category::factory(),
            'name' => ucwords($name),
            'slug' => Str::slug($name),
            'description' => fake()->paragraphs(3, true),
            'short_description' => fake()->sentence(),
            'price' => $price,
            'sale_price' => fake()->boolean(20) ? round($price * 0.85, 2) : null,
            'sku' => strtoupper(fake()->unique()->bothify('LP-####-???')),
            'stock_quantity' => fake()->numberBetween(0, 100),
            'image_url' => 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600',
            'is_featured' => fake()->boolean(20),
            'is_active' => true,
            'gender' => fake()->randomElement(['men', 'women', 'unisex']),
            'volume' => fake()->randomElement(['30ml', '50ml', '75ml', '100ml', '150ml']),
            'type' => fake()->randomElement(['perfume', 'makeup', 'skincare', 'jewelry', 'accessory']),
        ];
    }
}
