<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\Admin\BrandController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\StoreSettingController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\StorefrontController;

Route::get('/', [StorefrontController::class, 'home'])->name('home');
Route::get('/shop', [StorefrontController::class, 'shop'])->name('shop');
Route::get('/shop/{sku}', [StorefrontController::class, 'product'])->name('shop.product');
Route::get('/categories/{slug}', [StorefrontController::class, 'category'])->name('shop.category');
Route::get('/brands/{slug}', [StorefrontController::class, 'brand'])->name('shop.brand');

// Cart Routes
Route::get('/cart', [CartController::class, 'index'])->name('cart');
Route::post('/cart', [CartController::class, 'add'])->name('cart.add');
Route::post('/cart/add', [CartController::class, 'add']); // Handle legacy/browser cache POST
Route::put('/cart/{id}', [CartController::class, 'update'])->name('cart.update');
Route::delete('/cart/{id}', [CartController::class, 'remove'])->name('cart.remove');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        if (auth()->user()->is_admin) {
            return redirect()->route('admin.dashboard');
        }

        return redirect()->route('account.orders');
    })->name('dashboard');

    // Checkout Routes
    Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout');
    Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');
    Route::get('/checkout/confirmation/{order_number}', [CheckoutController::class, 'confirmation'])->name('checkout.confirmation');

    // Wishlist Routes
    Route::get('/wishlist', [AccountController::class, 'wishlist'])->name('wishlist');
    Route::post('/wishlist', [AccountController::class, 'toggleWishlist'])->name('wishlist.toggle');
    Route::post('/wishlist/add', [AccountController::class, 'toggleWishlist']); // Handle legacy/browser cache POST

    // Account Orders Routes
    Route::get('/account/orders', [AccountController::class, 'orders'])->name('account.orders');
    Route::get('/account/orders/{order_number}', [AccountController::class, 'orderDetail'])->name('account.orders.show');
});

Route::middleware(['auth', 'verified', 'admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
        Route::resource('products', ProductController::class)->except(['show']);
        Route::resource('categories', CategoryController::class)->except(['show']);
        Route::resource('brands', BrandController::class)->except(['show']);
        Route::resource('orders', OrderController::class)->only(['index', 'show', 'update']);
        Route::get('settings', [StoreSettingController::class, 'edit'])->name('settings.edit');
        Route::put('settings', [StoreSettingController::class, 'update'])->name('settings.update');
    });

require __DIR__.'/settings.php';
