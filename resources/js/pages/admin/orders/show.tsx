import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, Calendar, User, Mail, Phone, MapPin, FileText, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';

interface Product {
    name: string;
    sku: string;
    image_url: string | null;
    brand?: {
        name: string;
    };
}

interface OrderItem {
    id: number;
    product_name: string;
    product_price: string;
    quantity: number;
    total: string;
    product?: Product;
}

interface Address {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
}

interface Order {
    id: number;
    order_number: string;
    status: string;
    subtotal: string;
    tax: string;
    shipping_cost: string;
    total: string;
    notes: string | null;
    created_at: string;
    shipping_address: Address | null;
    billing_address: Address | null;
    user?: {
        name: string;
        email: string;
        phone: string | null;
    };
    items: OrderItem[];
}

interface Props {
    order: Order;
}

export default function Show({ order }: Props) {
    const breadcrumbs = [
        { title: 'Admin', href: '/admin/dashboard' },
        { title: 'Orders', href: '/admin/orders' },
        { title: `Order ${order.order_number}`, href: `/admin/orders/${order.id}` },
    ];

    const { data, setData, put, processing } = useForm({
        status: order.status,
    });

    const handleStatusChange = (val: string) => {
        setData('status', val);
        put(`/admin/orders/${order.id}`, {
            onSuccess: () => {
                toast.success('Order status updated successfully');
            },
            onError: () => {
                toast.error('Failed to update status');
            }
        });
    };

    const formatCurrency = (value: string | number) => {
        const num = typeof value === 'string' ? parseFloat(value) : value;
        return `${num.toFixed(2)} MAD`;
    };

    const getStatusBadge = (statusStr: string) => {
        const styles: Record<string, string> = {
            pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
            processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
            shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
            delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
            cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        };
        return (
            <Badge variant="secondary" className={`${styles[statusStr] || ''} capitalize font-semibold rounded-full px-3 py-1`}>
                {statusStr}
            </Badge>
        );
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={`Order ${order.order_number} - Admin`} />

            <div className="space-y-6 max-w-5xl mx-auto">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/orders">
                            <ChevronLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-serif font-bold tracking-tight text-neutral-900 dark:text-neutral-50 font-serif">Order Details: {order.order_number}</h1>
                            {getStatusBadge(order.status)}
                        </div>
                        <p className="text-neutral-550 text-sm flex items-center gap-1 mt-1">
                            <Calendar className="h-3.5 w-3.5" /> Placed on {new Date(order.created_at).toLocaleString()}
                        </p>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {/* Items & Invoice Summary */}
                    <div className="md:col-span-2 space-y-6">
                        <Card className="border-neutral-100 dark:border-neutral-800 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg font-serif">Order Items</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                                            {item.product?.image_url ? (
                                                <img
                                                    src={item.product.image_url}
                                                    alt={item.product_name}
                                                    className="h-16 w-16 object-cover rounded-md border border-neutral-100 dark:border-neutral-800"
                                                />
                                            ) : (
                                                <div className="h-16 w-16 bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center rounded-md border border-neutral-200 dark:border-neutral-700">
                                                    <ShoppingBag className="h-8 w-8 text-neutral-400" />
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <div className="font-semibold text-neutral-800 dark:text-neutral-200 truncate">{item.product_name}</div>
                                                <div className="text-xs text-neutral-400 mt-0.5">{item.product?.brand?.name || 'Luxury Brand'} &bull; SKU: <span className="font-mono">{item.product?.sku || 'N/A'}</span></div>
                                                <div className="text-sm text-neutral-555 mt-1 font-mono">{formatCurrency(item.product_price)} x {item.quantity}</div>
                                            </div>
                                            <div className="text-right font-mono font-semibold text-neutral-800 dark:text-neutral-200">
                                                {formatCurrency(item.total)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Order Notes */}
                        {order.notes && (
                            <Card className="border-neutral-100 dark:border-neutral-800 shadow-sm bg-neutral-50/50 dark:bg-neutral-900/10">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-md font-semibold flex items-center gap-1.5"><FileText className="h-4 w-4 text-neutral-450" /> Customer Notes</CardTitle>
                                </CardHeader>
                                <CardContent className="text-sm text-neutral-600 dark:text-neutral-350 italic">
                                    &ldquo;{order.notes}&rdquo;
                                </CardContent>
                            </Card>
                        )}

                        <Card className="border-neutral-100 dark:border-neutral-800 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg font-serif">Invoice Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 font-mono text-sm">
                                <div className="flex justify-between">
                                    <span className="text-neutral-450">Subtotal:</span>
                                    <span className="font-semibold">{formatCurrency(order.subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-neutral-450">Tax (20%):</span>
                                    <span className="font-semibold">{formatCurrency(order.tax)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-neutral-450">Shipping & Handling:</span>
                                    <span className="font-semibold">{formatCurrency(order.shipping_cost)}</span>
                                </div>
                                <div className="flex justify-between border-t border-neutral-100 dark:border-neutral-800 pt-3 text-base">
                                    <span className="font-serif font-bold text-neutral-800 dark:text-neutral-100">Total Invoice:</span>
                                    <span className="font-bold text-amber-600 dark:text-amber-500">{formatCurrency(order.total)}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Customer & Shipping Details */}
                    <div className="space-y-6">
                        <Card className="border-neutral-100 dark:border-neutral-800 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg font-serif">Processing Status</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Update Order Status</label>
                                    <Select value={data.status} onValueChange={handleStatusChange} disabled={processing}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">Pending Payment</SelectItem>
                                            <SelectItem value="processing">Processing</SelectItem>
                                            <SelectItem value="shipped">Shipped</SelectItem>
                                            <SelectItem value="delivered">Delivered</SelectItem>
                                            <SelectItem value="cancelled">Cancelled</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-neutral-100 dark:border-neutral-800 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg font-serif">Customer Profile</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div className="flex gap-2">
                                    <User className="h-4 w-4 text-neutral-400 mt-0.5 shrink-0" />
                                    <div>
                                        <div className="font-medium text-neutral-800 dark:text-neutral-200">{order.user?.name || 'Guest User'}</div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Mail className="h-4 w-4 text-neutral-400 mt-0.5 shrink-0" />
                                    <div className="font-mono text-xs text-neutral-500 dark:text-neutral-400 truncate">{order.user?.email || 'N/A'}</div>
                                </div>
                                {order.user?.phone && (
                                    <div className="flex gap-2">
                                        <Phone className="h-4 w-4 text-neutral-400 mt-0.5 shrink-0" />
                                        <div className="font-mono text-xs text-neutral-550">{order.user.phone}</div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {order.shipping_address && (
                            <Card className="border-neutral-100 dark:border-neutral-800 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-lg font-serif">Shipping Address</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-1.5 text-sm">
                                    <div className="font-semibold text-neutral-800 dark:text-neutral-200">{order.shipping_address.name}</div>
                                    <div className="flex gap-1.5">
                                        <MapPin className="h-4 w-4 text-neutral-450 mt-0.5 shrink-0" />
                                        <div>
                                            <div>{order.shipping_address.address}</div>
                                            <div>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}</div>
                                            <div className="text-xs text-neutral-400 uppercase font-medium tracking-wide mt-0.5">{order.shipping_address.country}</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
