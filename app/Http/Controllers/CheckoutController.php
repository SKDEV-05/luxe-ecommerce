<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\StoreSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    /**
     * Display the checkout page.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        // Find cart for the authenticated user
        $cart = Cart::where('user_id', $user->id)->first();

        if (! $cart || $cart->items()->count() === 0) {
            return redirect()->route('shop')->with('error', 'Your shopping cart is empty.');
        }

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
                        'brand' => $item->product->brand ? [
                            'name' => $item->product->brand->name,
                        ] : null,
                    ],
                    'total' => $itemTotal,
                ];
            }
        }

        $settings = StoreSetting::getSettings();
        $shipping = $settings->delivery_free ? 0.00 : ($subtotal >= $settings->delivery_free_threshold ? 0.00 : $settings->delivery_fee);
        $tax = $settings->delete_tva ? 0.00 : ($subtotal * 0.08);
        $total = $subtotal + $shipping + $tax;

        // Parse user default address if exists
        $defaultAddress = $user->address ?? [
            'address_line_1' => '',
            'address_line_2' => '',
            'city' => '',
            'state' => '',
            'postal_code' => '',
            'country' => 'United States',
        ];

        return Inertia::render('checkout', [
            'items' => $items,
            'summary' => [
                'subtotal' => $subtotal,
                'shipping' => $shipping,
                'tax' => $tax,
                'total' => $total,
                'delete_tva' => $settings->delete_tva,
            ],
            'user_info' => [
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone ?? '',
                'address' => $defaultAddress,
            ],
        ]);
    }

    /**
     * Process the order.
     */
    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();

        // Find cart
        $cart = Cart::where('user_id', $user->id)->first();

        if (! $cart || $cart->items()->count() === 0) {
            return redirect()->route('shop')->with('error', 'Your shopping cart is empty.');
        }

        // Validate shipping info
        $validated = $request->validate([
            'phone' => 'required|string|max:20',
            'shipping_address_line_1' => 'required|string|max:255',
            'shipping_address_line_2' => 'nullable|string|max:255',
            'shipping_city' => 'required|string|max:100',
            'shipping_state' => 'required|string|max:100',
            'shipping_postal_code' => 'required|string|max:20',
            'shipping_country' => 'required|string|max:100',

            'same_as_shipping' => 'required|boolean',

            // Billing fields (required if same_as_shipping is false)
            'billing_address_line_1' => 'required_if:same_as_shipping,false|nullable|string|max:255',
            'billing_address_line_2' => 'nullable|string|max:255',
            'billing_city' => 'required_if:same_as_shipping,false|nullable|string|max:100',
            'billing_state' => 'required_if:same_as_shipping,false|nullable|string|max:100',
            'billing_postal_code' => 'required_if:same_as_shipping,false|nullable|string|max:20',
            'billing_country' => 'required_if:same_as_shipping,false|nullable|string|max:100',

            'payment_method' => 'required|string|in:cod',
            'notes' => 'nullable|string|max:1000',
            'save_address' => 'boolean',
        ]);

        $cart->load('items.product');

        // Compile addresses
        $shippingAddress = [
            'name' => $user->name,
            'address_line_1' => $validated['shipping_address_line_1'],
            'address_line_2' => $validated['shipping_address_line_2'] ?? null,
            'city' => $validated['shipping_city'],
            'state' => $validated['shipping_state'],
            'postal_code' => $validated['shipping_postal_code'],
            'country' => $validated['shipping_country'],
        ];

        if ($validated['same_as_shipping']) {
            $billingAddress = $shippingAddress;
        } else {
            $billingAddress = [
                'name' => $user->name,
                'address_line_1' => $validated['billing_address_line_1'],
                'address_line_2' => $validated['billing_address_line_2'] ?? null,
                'city' => $validated['billing_city'],
                'state' => $validated['billing_state'],
                'postal_code' => $validated['billing_postal_code'],
                'country' => $validated['billing_country'],
            ];
        }

        try {
            DB::beginTransaction();

            $subtotal = 0;
            $orderItemsToCreate = [];

            // 1. Verify and reserve stock
            foreach ($cart->items as $item) {
                $product = $item->product;

                if (! $product || ! $product->is_active) {
                    throw new \Exception("Product '{$item->product->name}' is no longer active.");
                }

                if ($product->stock_quantity < $item->quantity) {
                    throw new \Exception("Insufficient stock for '{$product->name}'. Only {$product->stock_quantity} remaining.");
                }

                $price = $product->sale_price ?? $product->price;
                $itemTotal = $price * $item->quantity;
                $subtotal += $itemTotal;

                $orderItemsToCreate[] = [
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'product_price' => $price,
                    'quantity' => $item->quantity,
                    'total' => $itemTotal,
                ];

                // Deduct stock
                $product->stock_quantity -= $item->quantity;
                $product->save();
            }

            // Calculate costs
            $settings = StoreSetting::getSettings();
            $shippingCost = $settings->delivery_free ? 0.00 : ($subtotal >= $settings->delivery_free_threshold ? 0.00 : $settings->delivery_fee);
            $tax = $settings->delete_tva ? 0.00 : ($subtotal * 0.08);
            $total = $subtotal + $shippingCost + $tax;

            // 2. Create the Order
            $order = Order::create([
                'user_id' => $user->id,
                'order_number' => 'LP-'.strtoupper(Str::random(10)),
                'status' => 'pending',
                'subtotal' => $subtotal,
                'tax' => $tax,
                'shipping_cost' => $shippingCost,
                'total' => $total,
                'shipping_address' => $shippingAddress,
                'billing_address' => $billingAddress,
                'notes' => $validated['notes'] ?? null,
            ]);

            // 3. Create OrderItems
            foreach ($orderItemsToCreate as $itemData) {
                $itemData['order_id'] = $order->id;
                OrderItem::create($itemData);
            }

            // 4. Update user info if requested
            if ($request->boolean('save_address') || ! $user->phone) {
                $user->phone = $validated['phone'];
                $user->address = [
                    'address_line_1' => $validated['shipping_address_line_1'],
                    'address_line_2' => $validated['shipping_address_line_2'] ?? null,
                    'city' => $validated['shipping_city'],
                    'state' => $validated['shipping_state'],
                    'postal_code' => $validated['shipping_postal_code'],
                    'country' => $validated['shipping_country'],
                ];
                $user->save();
            }

            // 5. Empty the cart
            $cart->items()->delete();
            $cart->delete();

            DB::commit();

            return redirect()->route('checkout.confirmation', ['order_number' => $order->order_number])
                ->with('success', 'Thank you! Your order has been placed successfully.');

        } catch (\Exception $e) {
            DB::rollBack();

            return back()->withInput()->with('error', $e->getMessage());
        }
    }

    /**
     * Display order confirmation page.
     */
    public function confirmation(Request $request, string $order_number): Response
    {
        $order = Order::with(['items.product.brand'])
            ->where('order_number', $order_number)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        return Inertia::render('order-confirmation', [
            'order' => [
                'order_number' => $order->order_number,
                'status' => $order->status,
                'subtotal' => $order->subtotal,
                'shipping_cost' => $order->shipping_cost,
                'tax' => $order->tax,
                'total' => $order->total,
                'shipping_address' => $order->shipping_address,
                'created_at' => $order->created_at->format('M d, Y h:i A'),
                'items' => $order->items->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'product_name' => $item->product_name,
                        'product_price' => $item->product_price,
                        'quantity' => $item->quantity,
                        'total' => $item->total,
                        'image_url' => $item->product ? $item->product->image_url : null,
                        'brand_name' => $item->product && $item->product->brand ? $item->product->brand->name : null,
                    ];
                }),
            ],
        ]);
    }
}
