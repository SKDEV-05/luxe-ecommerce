import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ArrowLeft, MapPin, CreditCard, ShoppingBag, Truck, CheckCircle, Package } from 'lucide-react';

interface OrderItem {
    id: number;
    product_name: string;
    product_price: string;
    quantity: number;
    total: string;
    sku: string | null;
    image_url: string | null;
    brand_name: string | null;
}

interface OrderDetails {
    id: number;
    order_number: string;
    status: string;
    subtotal: string;
    shipping_cost: string;
    tax: string;
    total: string;
    notes: string | null;
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
    billing_address: {
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

export default function OrderDetailPage({ order }: Props) {
    const formatCurrency = (value: string | number) => {
        const val = typeof value === 'string' ? parseFloat(value) : value;
        return `${val.toFixed(2)} MAD`;
    };

    const getStatusStep = (status: string): number => {
        switch (status) {
            case 'pending':
                return 1;
            case 'processing':
                return 2;
            case 'shipped':
                return 3;
            case 'delivered':
                return 4;
            default:
                return 0; // cancelled
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-amber-100 text-amber-800 dark:bg-amber-955/30 dark:text-amber-400 border-amber-250';
            case 'processing':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-955/30 dark:text-blue-400 border-blue-250';
            case 'shipped':
                return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-955/30 dark:text-indigo-400 border-indigo-250';
            case 'delivered':
                return 'bg-green-105 text-green-800 dark:bg-green-955/30 dark:text-green-400 border-green-250';
            case 'cancelled':
                return 'bg-red-100 text-red-800 dark:bg-red-955/30 dark:text-red-400 border-red-250';
            default:
                return 'bg-stone-100 text-stone-850 dark:bg-stone-900 dark:text-stone-300';
        }
    };

    const currentStep = getStatusStep(order.status);

    const steps = [
        { label: 'Placed', icon: ShoppingBag, num: 1 },
        { label: 'Processing', icon: Package, num: 2 },
        { label: 'Shipped', icon: Truck, num: 3 },
        { label: 'Delivered', icon: CheckCircle, num: 4 },
    ];

    return (
        <>
            <Head title={`Order ${order.order_number}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header controls */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-stone-200 dark:border-neutral-900 pb-4">
                    <div className="space-y-1">
                        <Link href="/account/orders" className="inline-flex items-center gap-1 text-xs uppercase tracking-widest text-neutral-450 hover:text-amber-600 transition-colors font-mono">
                            <ArrowLeft className="h-3 w-3" /> Back to History
                        </Link>
                        <h1 className="text-2xl font-serif font-bold tracking-tight text-neutral-900 dark:text-stone-100 uppercase flex items-center gap-3">
                            Order <span className="font-mono text-xl font-medium">{order.order_number}</span>
                        </h1>
                        <p className="text-xs text-neutral-500 font-mono">Placed on {order.created_at}</p>
                    </div>
                    <div>
                        <Badge className={`rounded-none font-serif text-[10px] tracking-widest uppercase px-3 py-1 border ${getStatusColor(order.status)}`}>
                            Status: {order.status}
                        </Badge>
                    </div>
                </div>

                {/* Progress Tracker (only if not cancelled) */}
                {currentStep > 0 ? (
                    <div className="bg-white dark:bg-neutral-950 p-6 border border-stone-200/50 dark:border-neutral-900 rounded-none max-w-4xl">
                        <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-stone-500 mb-6">Delivery Progress</h3>
                        <div className="relative flex items-center justify-between">
                            {/* Connector Line */}
                            <div className="absolute left-6 right-6 top-1/2 h-0.5 bg-stone-100 dark:bg-neutral-900 -translate-y-1/2 z-0" />
                            <div 
                                className="absolute left-6 top-1/2 h-0.5 bg-amber-600 dark:bg-amber-500 -translate-y-1/2 z-0 transition-all duration-500" 
                                style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                            />

                            {steps.map((step) => {
                                const StepIcon = step.icon;
                                const isCompleted = step.num <= currentStep;
                                const isActive = step.num === currentStep;

                                return (
                                    <div key={step.num} className="relative z-10 flex flex-col items-center gap-2">
                                        <div 
                                            className={`h-12 w-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                                                isCompleted 
                                                    ? 'bg-amber-600 border-amber-605 text-stone-100 dark:bg-amber-500 dark:border-amber-495' 
                                                    : 'bg-white border-stone-200 text-stone-300 dark:bg-neutral-950 dark:border-neutral-850 dark:text-neutral-700'
                                            } ${isActive ? 'ring-4 ring-amber-100 dark:ring-amber-950/40' : ''}`}
                                        >
                                            <StepIcon className="h-5 w-5" />
                                        </div>
                                        <span className={`text-[10px] uppercase font-mono tracking-wider font-semibold ${
                                            isCompleted ? 'text-neutral-850 dark:text-stone-200' : 'text-stone-400'
                                        }`}>
                                            {step.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="bg-red-50 dark:bg-red-955/10 p-4 border border-red-200 dark:border-red-900 rounded-none text-red-700 dark:text-red-400 text-xs font-mono">
                        This order was cancelled. Please contact customer support if you have questions.
                    </div>
                )}

                {/* Details Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Items List */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="border border-stone-200/50 dark:border-neutral-900 bg-white dark:bg-neutral-950 p-6 rounded-none space-y-4">
                            <h3 className="font-serif font-bold text-sm uppercase tracking-wide border-b border-stone-100 dark:border-neutral-900 pb-2">
                                Order Items
                            </h3>
                            <div className="divide-y divide-stone-100 dark:divide-neutral-900">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                                        <div className="h-16 w-12 shrink-0 bg-stone-100 dark:bg-neutral-900 border border-stone-150 dark:border-neutral-850 overflow-hidden relative">
                                            {item.image_url ? (
                                                <img src={item.image_url} alt={item.product_name} className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center text-[10px] text-neutral-400">No Image</div>
                                            )}
                                        </div>
                                        <div className="flex-grow min-w-0 space-y-0.5">
                                            <h4 className="font-serif text-xs font-semibold text-neutral-800 dark:text-stone-200 hover:text-amber-700 dark:hover:text-amber-500 transition-colors">
                                                {item.sku ? (
                                                    <Link href={`/shop/${item.sku}`}>{item.product_name}</Link>
                                                ) : (
                                                    item.product_name
                                                )}
                                            </h4>
                                            <p className="text-[10px] text-neutral-450">{item.brand_name}</p>
                                            <p className="text-xs text-neutral-500 font-mono">
                                                {formatCurrency(item.product_price)} x {item.quantity}
                                            </p>
                                        </div>
                                        <div className="shrink-0 text-right font-mono text-xs font-bold text-neutral-850 dark:text-stone-200">
                                            {formatCurrency(item.total)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address and Payment Details */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Summary Cost Card */}
                        <Card className="border-stone-200/50 dark:border-neutral-900 bg-white dark:bg-neutral-950 rounded-none p-6 space-y-4">
                            <h3 className="font-serif font-bold text-sm uppercase tracking-wide border-b border-stone-100 dark:border-neutral-900 pb-2">
                                Cost Summary
                            </h3>
                            <div className="space-y-3 text-xs">
                                <div className="flex justify-between text-neutral-600 dark:text-stone-300">
                                    <span>Subtotal</span>
                                    <span className="font-mono">{formatCurrency(order.subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-neutral-600 dark:text-stone-300">
                                    <span>Shipping</span>
                                    <span className="font-mono">{parseFloat(order.shipping_cost) === 0 ? 'Complimentary' : formatCurrency(order.shipping_cost)}</span>
                                </div>
                                <div className="flex justify-between text-neutral-600 dark:text-stone-300">
                                    <span>Sales Tax (8%)</span>
                                    <span className="font-mono">{formatCurrency(order.tax)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-sm border-t border-stone-100 dark:border-neutral-900 pt-3 text-neutral-850 dark:text-stone-100">
                                    <span>Grand Total</span>
                                    <span className="font-mono text-amber-705 dark:text-amber-500">{formatCurrency(order.total)}</span>
                                </div>
                            </div>
                        </Card>

                        {/* Customer Information details */}
                        <Card className="border-stone-200/50 dark:border-neutral-900 bg-white dark:bg-neutral-950 rounded-none p-6 space-y-4">
                            <h3 className="font-serif font-bold text-sm uppercase tracking-wide border-b border-stone-100 dark:border-neutral-900 pb-2">
                                Shipping &amp; Payment
                            </h3>
                            <div className="space-y-4 text-xs">
                                <div className="flex gap-2">
                                    <MapPin className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                                    <div className="space-y-1">
                                        <span className="font-semibold block">Shipping Address</span>
                                        <p className="text-neutral-600 dark:text-stone-350 leading-relaxed">
                                            {order.shipping_address.name}<br />
                                            {order.shipping_address.address_line_1}<br />
                                            {order.shipping_address.address_line_2 && <>{order.shipping_address.address_line_2}<br /></>}
                                            {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}<br />
                                            {order.shipping_address.country}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-2 border-t border-stone-100 dark:border-neutral-900 pt-4">
                                    <CreditCard className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                                    <div className="space-y-1">
                                        <span className="font-semibold block">Payment Method</span>
                                        <span className="text-neutral-600 dark:text-stone-350 capitalize font-mono">Simulated Card/PayPal</span>
                                    </div>
                                </div>

                                {order.notes && (
                                    <div className="border-t border-stone-100 dark:border-neutral-900 pt-4 space-y-1">
                                        <span className="font-semibold block">Order Notes</span>
                                        <p className="text-neutral-600 dark:text-stone-350 italic leading-relaxed bg-stone-50 dark:bg-neutral-900 p-2 border border-stone-100 dark:border-neutral-850">
                                            {order.notes}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

OrderDetailPage.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Order History',
            href: '/account/orders',
        },
        {
            title: 'Details',
            href: '',
        },
    ],
};
