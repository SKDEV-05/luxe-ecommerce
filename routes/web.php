<?php

use App\Http\Controllers\StorefrontController;

Route::get('/', [StorefrontController::class, 'home'])->name('home');
Route::get('/shop', [StorefrontController::class, 'shop'])->name('shop');
Route::get('/shop/{sku}', [StorefrontController::class, 'product'])->name('shop.product');
Route::get('/categories/{slug}', [StorefrontController::class, 'category'])->name('shop.category');
Route::get('/brands/{slug}', [StorefrontController::class, 'brand'])->name('shop.brand');

// Cart Routes
Route::get('/cart', [App\Http\Controllers\CartController::class, 'index'])->name('cart');
Route::post('/cart', [App\Http\Controllers\CartController::class, 'add'])->name('cart.add');
Route::post('/cart/add', [App\Http\Controllers\CartController::class, 'add']); // Handle legacy/browser cache POST
Route::put('/cart/{id}', [App\Http\Controllers\CartController::class, 'update'])->name('cart.update');
Route::delete('/cart/{id}', [App\Http\Controllers\CartController::class, 'remove'])->name('cart.remove');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        if (auth()->user()->is_admin) {
            return redirect()->route('admin.dashboard');
        }
        return redirect()->route('account.orders');
    })->name('dashboard');
    
    // Checkout Routes
    Route::get('/checkout', [App\Http\Controllers\CheckoutController::class, 'index'])->name('checkout');
    Route::post('/checkout', [App\Http\Controllers\CheckoutController::class, 'store'])->name('checkout.store');
    Route::get('/checkout/confirmation/{order_number}', [App\Http\Controllers\CheckoutController::class, 'confirmation'])->name('checkout.confirmation');

    // Wishlist Routes
    Route::get('/wishlist', [App\Http\Controllers\AccountController::class, 'wishlist'])->name('wishlist');
    Route::post('/wishlist', [App\Http\Controllers\AccountController::class, 'toggleWishlist'])->name('wishlist.toggle');
    Route::post('/wishlist/add', [App\Http\Controllers\AccountController::class, 'toggleWishlist']); // Handle legacy/browser cache POST

    // Account Orders Routes
    Route::get('/account/orders', [App\Http\Controllers\AccountController::class, 'orders'])->name('account.orders');
    Route::get('/account/orders/{order_number}', [App\Http\Controllers\AccountController::class, 'orderDetail'])->name('account.orders.show');
});

Route::middleware(['auth', 'verified', 'admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('dashboard', [App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');
        Route::resource('products', App\Http\Controllers\Admin\ProductController::class)->except(['show']);
        Route::resource('categories', App\Http\Controllers\Admin\CategoryController::class)->except(['show']);
        Route::resource('brands', App\Http\Controllers\Admin\BrandController::class)->except(['show']);
        Route::resource('orders', App\Http\Controllers\Admin\OrderController::class)->only(['index', 'show', 'update']);
    });

require __DIR__.'/settings.php';


