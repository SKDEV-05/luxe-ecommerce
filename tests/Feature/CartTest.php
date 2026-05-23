<?php

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('guests and users can view empty cart page', function () {
    $response = $this->get(route('cart'));
    $response->assertOk();
});

test('can add a product to cart', function () {
    $product = Product::factory()->create([
        'is_active' => true,
        'stock_quantity' => 10,
    ]);

    $response = $this->post(route('cart.add'), [
        'product_id' => $product->id,
        'quantity' => 2,
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('success');

    $this->assertDatabaseHas('cart_items', [
        'product_id' => $product->id,
        'quantity' => 2,
    ]);
});

test('cannot add an out of stock product to cart', function () {
    $product = Product::factory()->create([
        'is_active' => true,
        'stock_quantity' => 0,
    ]);

    $response = $this->from(route('shop'))->post(route('cart.add'), [
        'product_id' => $product->id,
        'quantity' => 1,
    ]);

    $response->assertRedirect(route('shop'));
    $response->assertSessionHas('error');

    $this->assertDatabaseMissing('cart_items', [
        'product_id' => $product->id,
    ]);
});

test('cannot add quantity exceeding available stock', function () {
    $product = Product::factory()->create([
        'is_active' => true,
        'stock_quantity' => 5,
    ]);

    $response = $this->from(route('shop'))->post(route('cart.add'), [
        'product_id' => $product->id,
        'quantity' => 6,
    ]);

    $response->assertRedirect(route('shop'));
    $response->assertSessionHas('error');

    $this->assertDatabaseMissing('cart_items', [
        'product_id' => $product->id,
    ]);
});

test('can update cart item quantity', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $product = Product::factory()->create([
        'is_active' => true,
        'stock_quantity' => 10,
    ]);

    // Create session cart
    $responseAdd = $this->post(route('cart.add'), [
        'product_id' => $product->id,
        'quantity' => 1,
    ]);

    $cartItem = CartItem::first();
    $this->assertNotNull($cartItem);

    $responseUpdate = $this->put(route('cart.update', ['id' => $cartItem->id]), [
        'quantity' => 5,
    ]);

    $responseUpdate->assertRedirect();
    $this->assertDatabaseHas('cart_items', [
        'id' => $cartItem->id,
        'quantity' => 5,
    ]);
});

test('can remove product from cart', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $product = Product::factory()->create(['is_active' => true]);

    $this->post(route('cart.add'), [
        'product_id' => $product->id,
        'quantity' => 1,
    ]);

    $cartItem = CartItem::first();
    $this->assertNotNull($cartItem);

    $responseRemove = $this->delete(route('cart.remove', ['id' => $cartItem->id]));
    $responseRemove->assertRedirect();

    $this->assertDatabaseMissing('cart_items', [
        'id' => $cartItem->id,
    ]);
});
