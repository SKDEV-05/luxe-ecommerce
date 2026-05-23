import { Head, Link } from '@inertiajs/react';
import StorefrontLayout from '@/layouts/storefront-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck, ShoppingBag, Calendar, MapPin } from 'lucide-react';
import ProductImage from '@/components/product-image';

interface OrderItem {
    id: number;
    product_name: string;
    product_price: string;
    quantity: number;
    total: string;
    image_url: string | null;
    brand_name: string | null;
}

interface OrderDetails {
    order_number: string;
    status: string;
    subtotal: string;
    shipping_cost: string;
    tax: string;
    total: string;
    created_at: string;
    shipping_address: {
        name: string;
        address_line_1: string;
        address_line_2: string | null;
        city: string;
        state: string;
        postal_code: string;
        country: string;
    };
    items: OrderItem[];
}

interface Props {
    order: OrderDetails;
}

export default function OrderConfirmationPage({ order }: Props) {
    const formatCurrency = (value: string | number) => {
        const val = typeof value === 'string' ? parseFloat(value) : value;
        return `${val.toFixed(2)} MAD`;
    };

    return (
        <StorefrontLayout>
            <Head title={`Order Confirmed ${order.order_number} - Luxe Parfum`} />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-12">
                {/* Success Header */}
                <div className="space-y-4 max-w-lg mx-auto">
                    <div className="h-16 w-16 bg-amber-100 dark:bg-amber-950/40 rounded-full flex items-center justify-center mx-auto text-amber-700 dark:text-amber-500">
                        <ShieldCheck className="h-9 w-9" />
                    </div>
                    <h1 className="text-3xl font-serif font-bold tracking-tight uppercase">Order Confirmed</h1>
                    <p className="text-sm text-neutral-500 font-serif leading-relaxed">
                        Thank you for your purchase. We have received your order and are preparing your luxury products with the utmost care.
                    </p>
                </div>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto bg-stone-105/50 dark:bg-neutral-900/10 p-6 border border-stone-200/50 dark:border-neutral-900 rounded-none text-left">
                    <div className="flex gap-3">
                        <ShoppingBag className="h-5 w-5 text-amber-600 shrink-0" />
                        <div className="space-y-0.5">
                            <span className="text-[10px] font-mono uppercase text-stone-500 block">Order Number</span>
                            <span className="text-sm font-semibold font-mono">{order.order_number}</span>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Calendar className="h-5 w-5 text-amber-600 shrink-0" />
                        <div className="space-y-0.5">
                            <span className="text-[10px] font-mono uppercase text-stone-500 block">Order Date</span>
                            <span className="text-sm font-semibold">{order.created_at}</span>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <MapPin className="h-5 w-5 text-amber-600 shrink-0" />
                        <div className="space-y-0.5">
                            <span className="text-[10px] font-mono uppercase text-stone-500 block">Delivery To</span>
                            <span className="text-sm font-semibold">{order.shipping_address.name}</span>
                        </div>
                    </div>
                </div>

                {/* Details Section */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-left max-w-3xl mx-auto">
                    {/* Items List */}
                    <div className="md:col-span-7 space-y-4">
                        <h3 className="font-serif font-bold text-base border-b border-stone-150 dark:border-neutral-900 pb-2 uppercase tracking-wide">
                            Your Items
                        </h3>
                        <div className="divide-y divide-stone-100 dark:divide-neutral-900">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex gap-4 py-3 first:pt-0 last:pb-0">
                                    <div className="h-16 w-12 shrink-0 bg-stone-100 dark:bg-neutral-900 border border-stone-150 dark:border-neutral-850 overflow-hidden relative">
                                        <ProductImage
                                            src={item.image_url}
                                            alt={item.product_name}
                                            brandName={item.brand_name ?? undefined}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-grow min-w-0 space-y-0.5">
                                        <h4 className="font-serif text-xs font-semibold text-neutral-800 dark:text-stone-200 truncate">{item.product_name}</h4>
                                        <p className="text-[10px] text-neutral-400 truncate">{item.brand_name}</p>
                                        <p className="text-xs text-neutral-500 font-mono">Qty: {item.quantity}</p>
                                    </div>
                                    <div className="shrink-0 text-right font-mono text-xs font-bold text-neutral-850 dark:text-stone-200">
                                        {formatCurrency(item.total)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Delivery & Billing Summary */}
                    <div className="md:col-span-5 space-y-6 bg-stone-50 dark:bg-neutral-950 p-6 border border-stone-200/50 dark:border-neutral-900">
                        <div>
                            <h4 className="font-serif font-bold text-xs uppercase text-amber-705 mb-2">Shipping Address</h4>
                            <p className="text-xs text-neutral-600 dark:text-stone-300 space-y-1">
                                <span className="block font-semibold">{order.shipping_address.name}</span>
                                <span className="block">{order.shipping_address.address_line_1}</span>
                                {order.shipping_address.address_line_2 && <span className="block">{order.shipping_address.address_line_2}</span>}
                                <span className="block">{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}</span>
                                <span className="block">{order.shipping_address.country}</span>
                            </p>
                        </div>

                        <div className="border-t border-stone-150 dark:border-neutral-900 pt-4 space-y-2 text-xs">
                            <div className="flex justify-between text-neutral-600 dark:text-stone-300">
                                <span>Subtotal</span>
                                <span className="font-mono">{formatCurrency(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-neutral-600 dark:text-stone-300">
                                <span>Shipping</span>
                                <span className="font-mono">{parseFloat(order.shipping_cost) === 0 ? 'Complimentary' : formatCurrency(order.shipping_cost)}</span>
                            </div>
                            <div className="flex justify-between text-neutral-600 dark:text-stone-300">
                                <span>Sales Tax</span>
                                <span className="font-mono">{formatCurrency(order.tax)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-sm border-t border-stone-200 dark:border-neutral-900 pt-2 text-neutral-850 dark:text-stone-100">
                                <span>Paid Total</span>
                                <span className="font-mono text-amber-705 dark:text-amber-500">{formatCurrency(order.total)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
                    <Button asChild className="bg-amber-600 hover:bg-amber-700 text-stone-105 rounded-none font-serif uppercase tracking-wider px-8 py-6 text-xs">
                        <Link href="/shop">Continue Shopping</Link>
                    </Button>
                    <Button variant="outline" asChild className="rounded-none font-serif uppercase tracking-wider px-8 py-6 text-xs">
                        <Link href="/dashboard">View Order History</Link>
                    </Button>
                </div>
            </div>
        </StorefrontLayout>
    );
}
