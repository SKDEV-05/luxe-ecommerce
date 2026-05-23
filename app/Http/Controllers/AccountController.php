<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Models\Wishlist;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AccountController extends Controller
{
    /**
     * Display the user's order history.
     */
    public function orders(Request $request): Response
    {
        $orders = Order::where('user_id', $request->user()->id)
            ->latest()
            ->paginate(10);

        return Inertia::render('account/orders', [
            'orders' => $orders,
        ]);
    }

    /**
     * Display a specific order.
     */
    public function orderDetail(Request $request, string $orderNumber): Response
    {
        $order = Order::with(['items.product.brand'])
            ->where('order_number', $orderNumber)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        return Inertia::render('account/order-detail', [
            'order' => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status,
                'subtotal' => $order->subtotal,
                'shipping_cost' => $order->shipping_cost,
                'tax' => $order->tax,
                'total' => $order->total,
                'shipping_address' => $order->shipping_address,
                'billing_address' => $order->billing_address,
                'notes' => $order->notes,
                'created_at' => $order->created_at->format('M d, Y h:i A'),
                'items' => $order->items->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'product_name' => $item->product_name,
                        'product_price' => $item->product_price,
                        'quantity' => $item->quantity,
                        'total' => $item->total,
                        'sku' => $item->product ? $item->product->sku : null,
                        'image_url' => $item->product ? $item->product->image_url : null,
                        'brand_name' => $item->product && $item->product->brand ? $item->product->brand->name : null,
                    ];
                })
            ]
        ]);
    }

    /**
     * Display the user's wishlist.
     */
    public function wishlist(Request $request): Response
    {
        $wishlistItems = Wishlist::with(['product.brand'])
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();

        $products = [];
        foreach ($wishlistItems as $item) {
            if ($item->product) {
                $products[] = [
                    'id' => $item->product->id,
                    'name' => $item->product->name,
                    'sku' => $item->product->sku,
                    'price' => $item->product->price,
                    'sale_price' => $item->product->sale_price,
                    'image_url' => $item->product->image_url,
                    'gender' => $item->product->gender,
                    'volume' => $item->product->volume,
                    'brand' => $item->product->brand ? [
                        'name' => $item->product->brand->name,
                    ] : null,
                ];
            }
        }

        return Inertia::render('wishlist', [
            'products' => $products,
        ]);
    }

    /**
     * Toggle a product in/out of the user's wishlist.
     */
    public function toggleWishlist(Request $request): RedirectResponse
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        $productId = $request->input('product_id');
        $user = $request->user();

        $wishlistItem = Wishlist::where('user_id', $user->id)
            ->where('product_id', $productId)
            ->first();

        $product = Product::findOrFail($productId);

        if ($wishlistItem) {
            $wishlistItem->delete();
            $message = "{$product->name} removed from your wishlist.";
            $action = 'removed';
        } else {
            Wishlist::create([
                'user_id' => $user->id,
                'product_id' => $productId,
            ]);
            $message = "{$product->name} added to your wishlist.";
            $action = 'added';
        }

        return back()->with('success', $message);
    }
}
