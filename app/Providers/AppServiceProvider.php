<?php

namespace App\Providers;

use App\Models\Cart;
use App\Models\CartItem;
use Carbon\CarbonImmutable;
use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();

        Event::listen([Login::class, Registered::class], function ($event) {
            $user = $event->user;

            // Try to find guest cart ID from session
            $guestCartId = session('guest_cart_id');
            $guestCart = null;

            if ($guestCartId) {
                $guestCart = Cart::find($guestCartId);
            }

            // Fallback: search by session ID
            if (! $guestCart) {
                $sessionId = session()->getId();
                $guestCart = Cart::where('session_id', $sessionId)->first();
            }

            if ($guestCart && ! $guestCart->user_id) {
                // Find or create user cart
                $userCart = Cart::where('user_id', $user->id)->first();
                if ($userCart) {
                    // Merge items from guest cart to user cart
                    foreach ($guestCart->items as $guestItem) {
                        $existingItem = CartItem::where('cart_id', $userCart->id)
                            ->where('product_id', $guestItem->product_id)
                            ->first();

                        if ($existingItem) {
                            $existingItem->quantity += $guestItem->quantity;
                            $existingItem->save();
                        } else {
                            $guestItem->cart_id = $userCart->id;
                            $guestItem->save();
                        }
                    }
                    $guestCart->delete();
                } else {
                    // Just assign guest cart to user
                    $guestCart->user_id = $user->id;
                    $guestCart->session_id = null;
                    $guestCart->save();
                }
            }

            session()->forget('guest_cart_id');
        });
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}
