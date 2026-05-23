<?php

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('cart count represents unique product count', function () {
    $product1 = Product::factory()->create(['is_active' => true]);
    $product2 = Product::factory()->create(['is_active' => true]);

    $cart = Cart::create();

    // Add product 1 with quantity 3
    CartItem::create([
        'cart_id' => $cart->id,
        'product_id' => $product1->id,
        'quantity' => 3,
    ]);

    // Add product 2 with quantity 1
    CartItem::create([
        'cart_id' => $cart->id,
        'product_id' => $product2->id,
        'quantity' => 1,
    ]);

    // Unique count should be 2 (since there are 2 unique products)
    $this->assertEquals(2, $cart->item_count);
});

test('guest cart is adopted by user on login', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create([
        'is_active' => true,
        'stock_quantity' => 10,
    ]);

    // Guest adds product to cart (this will create cart and set guest_cart_id in session)
    $this->post(route('cart.add'), [
        'product_id' => $product->id,
        'quantity' => 2,
    ]);

    $guestCart = Cart::whereNull('user_id')->first();
    $this->assertNotNull($guestCart);

    // Log the user in
    $response = $this->post(route('login'), [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $response->assertRedirect();

    // Verify guest cart was updated to belong to user
    $guestCart->refresh();
    $this->assertEquals($user->id, $guestCart->user_id);
    $this->assertNull($guestCart->session_id);

    // Verify count in DB
    $this->assertDatabaseHas('carts', [
        'id' => $guestCart->id,
        'user_id' => $user->id,
    ]);
});

test('guest cart items are merged with existing user cart items on login', function () {
    $user = User::factory()->create();

    $product1 = Product::factory()->create(['is_active' => true]);
    $product2 = Product::factory()->create(['is_active' => true]);

    // 1. Create existing user cart with product1 (qty = 1)
    $userCart = Cart::create(['user_id' => $user->id]);
    CartItem::create([
        'cart_id' => $userCart->id,
        'product_id' => $product1->id,
        'quantity' => 1,
    ]);

    // 2. Create guest cart with product1 (qty = 2) and product2 (qty = 3)
    $this->get('/');
    $sessionId = session()->getId();

    $guestCart = Cart::create(['session_id' => $sessionId]);

    // Store guest_cart_id in session to mock CartController behavior
    session(['guest_cart_id' => $guestCart->id]);

    CartItem::create([
        'cart_id' => $guestCart->id,
        'product_id' => $product1->id,
        'quantity' => 2,
    ]);

    CartItem::create([
        'cart_id' => $guestCart->id,
        'product_id' => $product2->id,
        'quantity' => 3,
    ]);

    // 3. Log the user in
    $response = $this->post(route('login'), [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $response->assertRedirect();

    // 4. Verify guest cart is deleted
    $this->assertDatabaseMissing('carts', ['id' => $guestCart->id]);

    // 5. Verify user cart has merged quantities
    // product1 quantity should be 1 + 2 = 3
    $this->assertDatabaseHas('cart_items', [
        'cart_id' => $userCart->id,
        'product_id' => $product1->id,
        'quantity' => 3,
    ]);

    // product2 quantity should be 3
    $this->assertDatabaseHas('cart_items', [
        'cart_id' => $userCart->id,
        'product_id' => $product2->id,
        'quantity' => 3,
    ]);
});
