import { Head, Link, router } from '@inertiajs/react';
import StorefrontLayout from '@/layouts/storefront-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';

interface CartItem {
    id: number;
    quantity: number;
    product: {
        id: number;
        name: string;
        sku: string;
        price: string;
        sale_price: string | null;
        image_url: string | null;
        volume: string | null;
        stock_quantity: number;
        brand: {
            name: string;
        } | null;
    };
    total: number;
}

interface CartSummary {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
}

interface Props {
    items: CartItem[];
    summary: CartSummary;
}

export default function CartPage({ items, summary }: Props) {
    const formatCurrency = (value: number) => {
        return `${value.toFixed(2)} MAD`;
    };

    const handleUpdateQuantity = (itemId: number, currentQty: number, change: number, maxStock: number) => {
        const newQty = currentQty + change;
        if (newQty < 1) return;
        if (newQty > maxStock) return;
        
        router.put(`/cart/${itemId}`, { quantity: newQty }, { preserveScroll: true });
    };

    const handleRemoveItem = (itemId: number) => {
        if (confirm('Are you sure you want to remove this item?')) {
            router.delete(`/cart/${itemId}`, { preserveScroll: true });
        }
    };

    return (
        <StorefrontLayout>
            <Head title="Your Shopping Cart - Luxe Parfum" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h1 className="text-3xl font-serif font-bold tracking-tight mb-10 text-neutral-900 dark:text-stone-100 uppercase">
                    Your Shopping Cart
                </h1>

                {items.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Cart Items List */}
                        <div className="lg:col-span-2 space-y-6">
                            {items.map((item) => {
                                const price = item.product.sale_price ? parseFloat(item.product.sale_price) : parseFloat(item.product.price);
                                return (
                                    <div 
                                        key={item.id} 
                                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 border border-stone-200/60 dark:border-neutral-900 bg-white dark:bg-neutral-950 gap-6"
                                    >
                                        <div className="flex items-center gap-6 flex-1">
                                            {/* Product Image */}
                                            <div className="h-24 w-20 shrink-0 bg-stone-100 dark:bg-neutral-900 overflow-hidden relative border border-stone-150 dark:border-neutral-850">
                                                {item.product.image_url ? (
                                                    <img 
                                                        src={item.product.image_url} 
                                                        alt={item.product.name} 
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center text-xs text-neutral-400">
                                                        No Image
                                                    </div>
                                                )}
                                            </div>

                                            {/* Details */}
                                            <div className="space-y-1">
                                                <span className="text-[10px] tracking-widest font-mono text-neutral-450 uppercase block">
                                                    {item.product.brand?.name}
                                                </span>
                                                <Link 
                                                    href={`/shop/${item.product.sku}`}
                                                    className="font-serif font-bold text-sm tracking-wide text-neutral-800 dark:text-stone-200 hover:text-amber-700 dark:hover:text-amber-500 transition-colors"
                                                >
                                                    {item.product.name}
                                                </Link>
                                                <div className="text-xs text-neutral-400 flex items-center gap-2">
                                                    <span>{item.product.volume}</span>
                                                    <span>&bull;</span>
                                                    <span>In Stock: {item.product.stock_quantity}</span>
                                                </div>
                                                <div className="text-xs font-mono font-semibold pt-1">
                                                    {formatCurrency(price)}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions & Quantity */}
                                        <div className="flex sm:flex-col items-end justify-between sm:justify-center w-full sm:w-auto gap-4 sm:gap-2">
                                            <div className="flex items-center border border-stone-200 dark:border-neutral-800 rounded-none bg-stone-50 dark:bg-neutral-900/50">
                                                <button 
                                                    onClick={() => handleUpdateQuantity(item.id, item.quantity, -1, item.product.stock_quantity)}
                                                    className="p-2 hover:text-amber-750 text-neutral-550 disabled:opacity-40"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </button>
                                                <span className="px-3 font-mono text-xs font-semibold">{item.quantity}</span>
                                                <button 
                                                    onClick={() => handleUpdateQuantity(item.id, item.quantity, 1, item.product.stock_quantity)}
                                                    className="p-2 hover:text-amber-750 text-neutral-550 disabled:opacity-40"
                                                    disabled={item.quantity >= item.product.stock_quantity}
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </button>
                                            </div>
                                            
                                            <div className="flex items-center gap-6">
                                                <span className="font-mono text-sm font-bold text-neutral-800 dark:text-stone-200">
                                                    {formatCurrency(item.total)}
                                                </span>
                                                <button 
                                                    onClick={() => handleRemoveItem(item.id)}
                                                    className="text-neutral-400 hover:text-red-600 transition-colors p-1"
                                                    title="Remove item"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="lg:col-span-1">
                            <Card className="border-stone-200 dark:border-neutral-900 bg-white dark:bg-neutral-950 rounded-none p-6 space-y-6">
                                <h3 className="font-serif font-bold text-lg tracking-wide border-b border-stone-100 dark:border-neutral-900 pb-3 uppercase text-neutral-850 dark:text-stone-250">
                                    Order Summary
                                </h3>

                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between text-neutral-600 dark:text-stone-300">
                                        <span>Subtotal</span>
                                        <span className="font-mono">{formatCurrency(summary.subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-neutral-600 dark:text-stone-300">
                                        <span>Estimated Shipping</span>
                                        <span className="font-mono">
                                            {summary.shipping === 0 ? 'Complimentary' : formatCurrency(summary.shipping)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-neutral-600 dark:text-stone-300">
                                        <span>Sales Tax (8%)</span>
                                        <span className="font-mono">{formatCurrency(summary.tax)}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-base border-t border-stone-100 dark:border-neutral-900 pt-4 text-neutral-850 dark:text-stone-100">
                                        <span>Total</span>
                                        <span className="font-mono text-amber-705 dark:text-amber-500">
                                            {formatCurrency(summary.total)}
                                        </span>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <Button asChild className="w-full bg-amber-600 hover:bg-amber-700 text-stone-100 text-sm py-6 rounded-none tracking-widest uppercase font-semibold">
                                        <Link href="/checkout" className="flex items-center justify-center gap-2">
                                            Proceed to Checkout <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                </div>

                                <div className="text-[10px] text-neutral-400 text-center leading-relaxed font-serif">
                                    Complimentary shipping is applied to orders over 150 MAD. Enjoy beautiful luxury packaging and 3 complimentary samples with every order.
                                </div>
                            </Card>
                        </div>
                    </div>
                ) : (
                    <div className="py-24 text-center border border-dashed border-stone-200 dark:border-neutral-900 rounded-none bg-white dark:bg-neutral-950/20 max-w-2xl mx-auto space-y-6">
                        <ShoppingBag className="h-16 w-16 mx-auto text-stone-300 dark:text-neutral-800" />
                        <div className="space-y-2">
                            <h3 className="font-serif text-xl font-bold">Your Cart is Empty</h3>
                            <p className="text-sm text-neutral-500 max-w-sm mx-auto">
                                Explore our curated collection of luxury fragrances, skincare, cosmetics, and fine jewelry.
                            </p>
                        </div>
                        <Button asChild className="bg-amber-600 hover:bg-amber-750 text-stone-100 rounded-none font-serif tracking-wider uppercase">
                            <Link href="/shop">Explore Shop</Link>
                        </Button>
                    </div>
                )}
            </div>
        </StorefrontLayout>
    );
}
