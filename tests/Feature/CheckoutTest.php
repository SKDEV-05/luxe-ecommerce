<?php

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('guests are redirected from checkout to login', function () {
    $response = $this->get(route('checkout'));
    $response->assertRedirect(route('login'));
});

test('users with empty cart are redirected from checkout', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('checkout'));
    $response->assertRedirect(route('shop'));
    $response->assertSessionHas('error');
});

test('users with items in cart can view checkout page', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $product = Product::factory()->create(['is_active' => true, 'stock_quantity' => 5]);
    
    // Create cart for user
    $cart = Cart::create(['user_id' => $user->id]);
    CartItem::create([
        'cart_id' => $cart->id,
        'product_id' => $product->id,
        'quantity' => 1,
    ]);

    $response = $this->get(route('checkout'));
    $response->assertOk();
});

test('authenticated users can place order successfully', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $product = Product::factory()->create([
        'is_active' => true,
        'stock_quantity' => 10,
        'price' => 100.00,
        'sale_price' => null,
    ]);
    
    $cart = Cart::create(['user_id' => $user->id]);
    CartItem::create([
        'cart_id' => $cart->id,
        'product_id' => $product->id,
        'quantity' => 2,
    ]);

    $response = $this->post(route('checkout.store'), [
        'phone' => '1234567890',
        'shipping_address_line_1' => '123 Test St',
        'shipping_address_line_2' => 'Apt 4B',
        'shipping_city' => 'Test City',
        'shipping_state' => 'TS',
        'shipping_postal_code' => '12345',
        'shipping_country' => 'Test Land',
        'same_as_shipping' => true,
        'payment_method' => 'cod',
        'save_address' => false,
    ]);

    // Should redirect to checkout confirmation route
    $order = Order::first();
    $this->assertNotNull($order);
    
    $response->assertRedirect(route('checkout.confirmation', ['order_number' => $order->order_number]));
    $response->assertSessionHas('success');

    // Assert order data was saved correctly
    $this->assertEquals($user->id, $order->user_id);
    $this->assertEquals(200.00, $order->subtotal);
    
    // Assert order items created
    $this->assertDatabaseHas('order_items', [
        'order_id' => $order->id,
        'product_id' => $product->id,
        'quantity' => 2,
        'product_price' => 100.00,
    ]);

    // Assert product stock was decremented
    $product->refresh();
    $this->assertEquals(8, $product->stock_quantity);

    // Assert cart was emptied
    $this->assertDatabaseMissing('carts', ['id' => $cart->id]);
    $this->assertDatabaseMissing('cart_items', ['cart_id' => $cart->id]);
});

test('order placement fails if stock is insufficient', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $product = Product::factory()->create([
        'is_active' => true,
        'stock_quantity' => 1,
    ]);
    
    $cart = Cart::create(['user_id' => $user->id]);
    CartItem::create([
        'cart_id' => $cart->id,
        'product_id' => $product->id,
        'quantity' => 2,
    ]);

    $response = $this->from(route('checkout'))->post(route('checkout.store'), [
        'phone' => '1234567890',
        'shipping_address_line_1' => '123 Test St',
        'shipping_city' => 'Test City',
        'shipping_state' => 'TS',
        'shipping_postal_code' => '12345',
        'shipping_country' => 'Test Land',
        'same_as_shipping' => true,
        'payment_method' => 'cod',
        'save_address' => false,
    ]);

    $response->assertRedirect(route('checkout'));
    $response->assertSessionHas('error');

    // Order should not be created
    $this->assertDatabaseEmpty('orders');
    
    // Stock should not be decremented
    $product->refresh();
    $this->assertEquals(1, $product->stock_quantity);

    // Cart items should remain
    $this->assertDatabaseHas('cart_items', [
        'cart_id' => $cart->id,
        'product_id' => $product->id,
    ]);
});
