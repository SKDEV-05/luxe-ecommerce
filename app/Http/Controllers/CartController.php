<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    /**
     * Get or create the current cart for the request.
     */
    protected function getOrCreateCart(Request $request): Cart
    {
        if ($user = $request->user()) {
            // Check for user cart
            $cart = Cart::where('user_id', $user->id)->first();

            if (!$cart) {
                // Check if there's a guest cart in this session we can adopt
                $sessionId = session()->getId();
                $cart = Cart::where('session_id', $sessionId)->first();

                if ($cart) {
                    $cart->user_id = $user->id;
                    $cart->session_id = null; // Clear session ID once adopted
                    $cart->save();
                } else {
                    $cart = Cart::create(['user_id' => $user->id]);
                }
            }
            return $cart;
        }

        // Guest user
        $sessionId = session()->getId();
        $cart = Cart::where('session_id', $sessionId)->first();

        if (!$cart) {
            $cart = Cart::create(['session_id' => $sessionId]);
        }

        return $cart;
    }

    /**
     * Display the cart page.
     */
    public function index(Request $request): Response
    {
        $cart = $this->getOrCreateCart($request);
        
        // Eager load items and products with brand
        $cart->load(['items.product.brand']);

        $subtotal = 0;
        $items = [];

        foreach ($cart->items as $item) {
            if ($item->product) {
                $price = $item->product->sale_price ?? $item->product->price;
                $itemTotal = $price * $item->quantity;
                $subtotal += $itemTotal;

                $items[] = [
                    'id' => $item->id,
                    'quantity' => $item->quantity,
                    'product' => [
                        'id' => $item->product->id,
                        'name' => $item->product->name,
                        'sku' => $item->product->sku,
                        'price' => $item->product->price,
                        'sale_price' => $item->product->sale_price,
                        'image_url' => $item->product->image_url,
                        'volume' => $item->product->volume,
                        'stock_quantity' => $item->product->stock_quantity,
                        'brand' => $item->product->brand ? [
                            'name' => $item->product->brand->name,
                        ] : null,
                    ],
                    'total' => $itemTotal,
                ];
            }
        }

        // Simulating shipping and tax
        $shipping = $subtotal > 150 || $subtotal === 0 ? 0.00 : 15.00;
        $tax = $subtotal * 0.08; // 8% sales tax
        $total = $subtotal + $shipping + $tax;

        return Inertia::render('cart', [
            'items' => $items,
            'summary' => [
                'subtotal' => $subtotal,
                'shipping' => $shipping,
                'tax' => $tax,
                'total' => $total,
            ]
        ]);
    }

    /**
     * Add a product to the cart.
     */
    public function add(Request $request): RedirectResponse
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'nullable|integer|min:1',
        ]);

        $productId = $request->input('product_id');
        $quantity = $request->input('quantity', 1);

        $product = Product::findOrFail($productId);

        if (!$product->is_active || $product->stock_quantity < 1) {
            return back()->with('error', 'This product is currently out of stock.');
        }

        $cart = $this->getOrCreateCart($request);

        // Check if item already exists in cart
        $cartItem = CartItem::where('cart_id', $cart->id)
            ->where('product_id', $product->id)
            ->first();

        $newQuantity = $quantity;
        if ($cartItem) {
            $newQuantity += $cartItem->quantity;
        }

        if ($product->stock_quantity < $newQuantity) {
            return back()->with('error', "Only {$product->stock_quantity} units are available in stock.");
        }

        if ($cartItem) {
            $cartItem->quantity = $newQuantity;
            $cartItem->save();
        } else {
            CartItem::create([
                'cart_id' => $cart->id,
                'product_id' => $product->id,
                'quantity' => $quantity,
            ]);
        }

        return back()->with('success', "{$product->name} added to your cart.");
    }

    /**
     * Update the quantity of a cart item.
     */
    public function update(Request $request, int $id): RedirectResponse
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $cartItem = CartItem::findOrFail($id);
        $cart = $this->getOrCreateCart($request);

        // Ensure user owns this cart item
        if ($cartItem->cart_id !== $cart->id) {
            abort(403);
        }

        $product = $cartItem->product;
        $quantity = $request->input('quantity');

        if ($product->stock_quantity < $quantity) {
            return back()->with('error', "Only {$product->stock_quantity} units are available in stock.");
        }

        $cartItem->quantity = $quantity;
        $cartItem->save();

        return back()->with('success', 'Cart updated successfully.');
    }

    /**
     * Remove an item from the cart.
     */
    public function remove(Request $request, int $id): RedirectResponse
    {
        $cartItem = CartItem::findOrFail($id);
        $cart = $this->getOrCreateCart($request);

        // Ensure user owns this cart item
        if ($cartItem->cart_id !== $cart->id) {
            abort(403);
        }

        $productName = $cartItem->product->name;
        $cartItem->delete();

        return back()->with('success', "{$productName} removed from cart.");
    }
}
