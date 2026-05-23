<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function index(): Response
    {
        $totalSales = Order::whereIn('status', ['processing', 'shipped', 'delivered'])->sum('total');
        $ordersCount = Order::count();
        $confirmedOrdersCount = Order::whereIn('status', ['processing', 'shipped', 'delivered'])->count();
        $productsCount = Product::count();
        $usersCount = User::count();

        $lowStockCount = Product::where('stock_quantity', '<=', 5)->count();

        $recentOrders = Order::with('user')
            ->latest()
            ->limit(5)
            ->get();

        $recentUsers = User::latest()
            ->limit(5)
            ->get();

        // Get monthly sales data for a simple chart
        $monthlySales = Order::whereIn('status', ['processing', 'shipped', 'delivered'])
            ->selectRaw("strftime('%Y-%m', created_at) as month, sum(total) as total_amount")
            ->groupBy('month')
            ->orderBy('month', 'asc')
            ->limit(6)
            ->get()
            ->map(function ($item) {
                return [
                    'month' => $item->month,
                    'sales' => (float) $item->total_amount,
                ];
            });

        return Inertia::render('admin/dashboard', [
            'stats' => [
                'total_sales' => round($totalSales, 2),
                'orders_count' => $ordersCount,
                'confirmed_orders_count' => $confirmedOrdersCount,
                'products_count' => $productsCount,
                'users_count' => $usersCount,
                'low_stock_count' => $lowStockCount,
            ],
            'recent_orders' => $recentOrders,
            'recent_users' => $recentUsers,
            'monthly_sales' => $monthlySales,
        ]);
    }
}
