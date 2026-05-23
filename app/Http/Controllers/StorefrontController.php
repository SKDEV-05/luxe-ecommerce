<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\Wishlist;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StorefrontController extends Controller
{
    /**
     * Display the storefront homepage.
     */
    public function home(): Response
    {
        $featuredProducts = Product::with(['brand', 'category'])
            ->where('is_active', true)
            ->where('is_featured', true)
            ->latest()
            ->limit(8)
            ->get();

        $newArrivals = Product::with(['brand', 'category'])
            ->where('is_active', true)
            ->latest()
            ->limit(4)
            ->get();

        $categories = Category::where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        $featuredBrands = Brand::where('is_featured', true)
            ->limit(6)
            ->get();

        return Inertia::render('welcome', [
            'featuredProducts' => $featuredProducts,
            'newArrivals' => $newArrivals,
            'categories' => $categories,
            'featuredBrands' => $featuredBrands,
        ]);
    }

    /**
     * Display the shop page with filters.
     */
    public function shop(Request $request): Response
    {
        $query = Product::with(['brand', 'category'])->where('is_active', true);

        // Search Filter
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhereHas('brand', function ($b) use ($search) {
                        $b->where('name', 'like', "%{$search}%");
                    });
            });
        }

        // Category Filter
        if ($request->filled('category')) {
            $categorySlug = $request->input('category');
            $query->whereHas('category', function ($c) use ($categorySlug) {
                $c->where('slug', $categorySlug);
            });
        }

        // Brand Filter
        if ($request->filled('brand')) {
            $brandSlug = $request->input('brand');
            $query->whereHas('brand', function ($b) use ($brandSlug) {
                $b->where('slug', $brandSlug);
            });
        }

        // Product Type Filter
        if ($request->filled('type')) {
            $query->where('type', $request->input('type'));
        }

        // Gender Filter
        if ($request->filled('gender')) {
            $query->where('gender', $request->input('gender'));
        }

        // Price Filter
        if ($request->filled('price_min')) {
            $query->where('price', '>=', $request->input('price_min'));
        }
        if ($request->filled('price_max')) {
            $query->where('price', '<=', $request->input('price_max'));
        }

        // Sorting
        $sort = $request->input('sort', 'newest');
        switch ($sort) {
            case 'price_low_high':
                $query->orderBy('price', 'asc');
                break;
            case 'price_high_low':
                $query->orderBy('price', 'desc');
                break;
            case 'name_asc':
                $query->orderBy('name', 'asc');
                break;
            case 'newest':
            default:
                $query->latest();
                break;
        }

        $products = $query->paginate(12)->withQueryString();
        $categories = Category::where('is_active', true)->orderBy('sort_order')->get();
        $brands = Brand::orderBy('name')->get();

        return Inertia::render('shop/index', [
            'products' => $products,
            'categories' => $categories,
            'brands' => $brands,
            'filters' => $request->only(['search', 'category', 'brand', 'type', 'gender', 'price_min', 'price_max', 'sort']),
        ]);
    }

    /**
     * Display a single product.
     */
    public function product(string $sku): Response
    {
        $product = Product::with(['brand', 'category', 'images'])
            ->where('sku', $sku)
            ->where('is_active', true)
            ->firstOrFail();

        $relatedProducts = Product::with(['brand', 'category'])
            ->where('is_active', true)
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->limit(4)
            ->get();

        $isInWishlist = false;
        if (auth()->check()) {
            $isInWishlist = Wishlist::where('user_id', auth()->id())
                ->where('product_id', $product->id)
                ->exists();
        }

        return Inertia::render('shop/show', [
            'product' => $product,
            'relatedProducts' => $relatedProducts,
            'isInWishlist' => $isInWishlist,
        ]);
    }

    /**
     * Display a category landing page.
     */
    public function category(string $slug): Response
    {
        $category = Category::where('slug', $slug)->where('is_active', true)->firstOrFail();

        $products = Product::with(['brand', 'category'])
            ->where('is_active', true)
            ->where('category_id', $category->id)
            ->latest()
            ->paginate(12);

        return Inertia::render('shop/category', [
            'category' => $category,
            'products' => $products,
        ]);
    }

    /**
     * Display a brand landing page.
     */
    public function brand(string $slug): Response
    {
        $brand = Brand::where('slug', $slug)->firstOrFail();

        $products = Product::with(['brand', 'category'])
            ->where('is_active', true)
            ->where('brand_id', $brand->id)
            ->latest()
            ->paginate(12);

        return Inertia::render('shop/brand', [
            'brand' => $brand,
            'products' => $products,
        ]);
    }
}
