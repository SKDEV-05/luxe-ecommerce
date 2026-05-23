<?php

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Models\Wishlist;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('guests are redirected from account pages to login', function () {
    $this->get(route('account.orders'))->assertRedirect(route('login'));
    $this->get(route('account.orders.show', ['order_number' => '123']))->assertRedirect(route('login'));
    $this->get(route('wishlist'))->assertRedirect(route('login'));
});

test('users can visit order history page', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('account.orders'));
    $response->assertOk();
});

test('users can view their own order details', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $order = Order::create([
        'user_id' => $user->id,
        'order_number' => 'LP-1234567890',
        'subtotal' => 100.00,
        'total' => 108.00,
        'tax' => 8.00,
        'shipping_cost' => 0.00,
        'shipping_address' => ['name' => $user->name, 'city' => 'Test'],
        'billing_address' => ['name' => $user->name, 'city' => 'Test'],
    ]);

    $response = $this->get(route('account.orders.show', ['order_number' => $order->order_number]));
    $response->assertOk();
});

test('users cannot view other users order details', function () {
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();
    
    $order = Order::create([
        'user_id' => $user2->id,
        'order_number' => 'LP-1234567890',
        'subtotal' => 100.00,
        'total' => 108.00,
        'tax' => 8.00,
        'shipping_cost' => 0.00,
        'shipping_address' => ['name' => $user2->name, 'city' => 'Test'],
        'billing_address' => ['name' => $user2->name, 'city' => 'Test'],
    ]);

    $this->actingAs($user1);

    // Should return 404 since we query order_number and user_id in controller using firstOrFail
    $this->get(route('account.orders.show', ['order_number' => $order->order_number]))
        ->assertStatus(404);
});

test('users can view their wishlist', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('wishlist'));
    $response->assertOk();
});

test('users can add and remove items in their wishlist', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $product = Product::factory()->create();

    // Toggle on (should add to wishlist)
    $responseOn = $this->post(route('wishlist.toggle'), [
        'product_id' => $product->id,
    ]);

    $responseOn->assertRedirect();
    $responseOn->assertSessionHas('success');
    
    $this->assertDatabaseHas('wishlists', [
        'user_id' => $user->id,
        'product_id' => $product->id,
    ]);

    // Toggle off (should remove from wishlist)
    $responseOff = $this->post(route('wishlist.toggle'), [
        'product_id' => $product->id,
    ]);

    $responseOff->assertRedirect();
    $responseOff->assertSessionHas('success');

    $this->assertDatabaseMissing('wishlists', [
        'user_id' => $user->id,
        'product_id' => $product->id,
    ]);
});
