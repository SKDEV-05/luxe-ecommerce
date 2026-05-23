<?php

use App\Models\StoreSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('guests are redirected from store settings page', function () {
    $response = $this->get(route('admin.settings.edit'));
    $response->assertRedirect(route('login'));
});

test('non-admin users cannot access store settings page', function () {
    $user = User::factory()->create(['is_admin' => false]);
    $response = $this->actingAs($user)->get(route('admin.settings.edit'));
    $response->assertStatus(403);
});

test('admin users can view store settings page', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $response = $this->actingAs($admin)->get(route('admin.settings.edit'));
    $response->assertStatus(200);
});

test('admin users can update store settings', function () {
    $admin = User::factory()->create(['is_admin' => true]);

    // Default settings should exist via helper
    $settings = StoreSetting::getSettings();
    expect($settings->delete_tva)->toBeFalse();

    $response = $this->actingAs($admin)->put(route('admin.settings.update'), [
        'delete_tva' => true,
        'delivery_free' => true,
        'delivery_fee' => 20.00,
        'delivery_free_threshold' => 200.00,
    ]);

    $response->assertRedirect();

    $settings->refresh();
    expect($settings->delete_tva)->toBeTrue();
    expect($settings->delivery_free)->toBeTrue();
    expect((float) $settings->delivery_fee)->toEqual(20.00);
    expect((float) $settings->delivery_free_threshold)->toEqual(200.00);
});
