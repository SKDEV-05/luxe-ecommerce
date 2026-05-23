<?php

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('guests can visit storefront home page', function () {
    $response = $this->get(route('home'));
    $response->assertOk();
});

test('guests can visit shop catalog', function () {
    // Seed at least one brand, category and product to render without issues
    $product = Product::factory()->create();

    $response = $this->get(route('shop'));
    $response->assertOk();
});

test('guests can view a single product page', function () {
    $product = Product::factory()->create(['is_active' => true]);

    $response = $this->get(route('shop.product', ['sku' => $product->sku]));
    $response->assertOk();
    $response->assertSee($product->name);
});

test('guests can view products by category', function () {
    $category = Category::factory()->create(['is_active' => true]);
    $product = Product::factory()->create([
        'category_id' => $category->id,
        'is_active' => true,
    ]);

    $response = $this->get(route('shop.category', ['slug' => $category->slug]));
    $response->assertOk();
    $response->assertSee($product->name);
});

test('guests can view products by brand', function () {
    $brand = Brand::factory()->create();
    $product = Product::factory()->create([
        'brand_id' => $brand->id,
        'is_active' => true,
    ]);

    $response = $this->get(route('shop.brand', ['slug' => $brand->slug]));
    $response->assertOk();
    $response->assertSee($product->name);
});
