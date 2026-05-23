<?php

namespace App\Http\Middleware;

use App\Models\Cart;
use App\Models\Wishlist;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $cartCount = 0;
        $wishlistCount = 0;

        if ($user = $request->user()) {
            $cart = Cart::where('user_id', $user->id)->first();
            $cartCount = $cart ? $cart->items()->count() : 0;
            $wishlistCount = Wishlist::where('user_id', $user->id)->count();
        } else {
            $sessionId = session()->getId();
            $cart = Cart::where('session_id', $sessionId)->first();
            $cartCount = $cart ? $cart->items()->count() : 0;
        }

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'cart_count' => $cartCount,
            'wishlist_count' => $wishlistCount,
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
            ],
        ];
    }
}
