import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Eye, ShoppingBag } from 'lucide-react';
import { useState } from 'react';

interface Order {
    id: number;
    order_number: string;
    status: string;
    subtotal: string;
    tax: string;
    shipping_cost: string;
    total: string;
    created_at: string;
    user?: {
        name: string;
        email: string;
    };
}

interface PaginatedOrders {
    data: Order[];
    links: any[];
    current_page: number;
    last_page: number;
    total: number;
}

interface Props {
    orders: PaginatedOrders;
    filters: {
        status?: string;
        search?: string;
    };
}

export default function Index({ orders, filters }: Props) {
    const breadcrumbs = [
        { title: 'Admin', href: '/admin/dashboard' },
        { title: 'Orders', href: '/admin/orders' },
    ];

    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/orders', {
            search: search || undefined,
            status: status === 'all' ? undefined : status,
        }, { preserveState: true });
    };

    const handleReset = () => {
        setSearch('');
        setStatus('all');
        router.get('/admin/orders');
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
            <Badge variant="secondary" className={`${styles[statusStr] || ''} capitalize font-medium rounded-full px-2.5 py-0.5 text-xs`}>
                {statusStr}
            </Badge>
        );
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Orders - Admin" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-serif font-bold tracking-tight text-neutral-900 dark:text-neutral-50 font-serif">Orders</h1>
                    <p className="text-neutral-550 dark:text-neutral-450 mt-1">Monitor sales, process shipments, and manage purchase history.</p>
                </div>

                {/* Filters */}
                <Card className="border-neutral-100 dark:border-neutral-800 shadow-sm">
                    <CardContent className="p-4">
                        <form onSubmit={handleFilter} className="flex flex-col md:flex-row gap-4 items-end">
                            <div className="flex-1 space-y-1">
                                <span className="text-xs font-semibold text-neutral-400 uppercase">Search Orders</span>
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-400" />
                                    <Input
                                        placeholder="Search by Order #, customer name or email..."
                                        className="pl-9"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="w-full md:w-48 space-y-1">
                                <span className="text-xs font-semibold text-neutral-400 uppercase">Order Status</span>
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Statuses</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="processing">Processing</SelectItem>
                                        <SelectItem value="shipped">Shipped</SelectItem>
                                        <SelectItem value="delivered">Delivered</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex w-full md:w-auto gap-2">
                                <Button type="submit" className="bg-neutral-800 hover:bg-neutral-900 text-white dark:bg-neutral-200 dark:text-neutral-900 dark:hover:bg-neutral-100 flex-1 md:flex-none">
                                    Filter
                                </Button>
                                <Button type="button" variant="outline" onClick={handleReset} className="flex-1 md:flex-none">
                                    Reset
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Table */}
                <Card className="border-neutral-100 dark:border-neutral-800 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-serif">All Customer Orders ({orders.total})</CardTitle>
                    </CardHeader>
                    <CardContent className="px-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-neutral-100 dark:border-neutral-800 text-xs font-semibold text-neutral-400 uppercase tracking-wider bg-neutral-50 dark:bg-neutral-900 px-6 py-3">
                                        <th className="px-6 py-3">Order Number</th>
                                        <th className="px-6 py-3">Customer</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3 font-mono">Date</th>
                                        <th className="px-6 py-3 text-right">Total</th>
                                        <th className="px-6 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                    {orders.data.length > 0 ? (
                                        orders.data.map((order) => (
                                            <tr key={order.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/10 text-sm">
                                                <td className="px-6 py-4 font-mono font-semibold text-amber-600 dark:text-amber-500">
                                                    {order.order_number}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-semibold text-neutral-850 dark:text-neutral-200">{order.user?.name || 'Guest'}</div>
                                                    <div className="text-xs font-mono text-neutral-400">{order.user?.email || ''}</div>
                                                </td>
                                                <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                                                <td className="px-6 py-4 font-mono text-xs text-neutral-500 dark:text-neutral-400">
                                                    {new Date(order.created_at).toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 text-right font-mono font-semibold text-neutral-800 dark:text-neutral-200">
                                                    {formatCurrency(order.total)}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <Button variant="ghost" size="icon" asChild title="View Details">
                                                        <Link href={`/admin/orders/${order.id}`}>
                                                            <Eye className="h-4 w-4 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200" />
                                                        </Link>
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-8 text-center text-neutral-400">No orders found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Links */}
                        {orders.last_page > 1 && (
                            <div className="flex items-center justify-between border-t border-neutral-100 dark:border-neutral-800 px-6 py-4">
                                <span className="text-xs text-neutral-400">Page {orders.current_page} of {orders.last_page}</span>
                                <div className="flex items-center gap-1">
                                    {orders.links.map((link, idx) => (
                                        <Button
                                            key={idx}
                                            variant={link.active ? 'secondary' : 'ghost'}
                                            size="sm"
                                            disabled={!link.url}
                                            asChild={!!link.url}
                                        >
                                            {link.url ? (
                                                <Link href={link.url} dangerouslySetInnerHTML={{ __html: link.label }} />
                                            ) : (
                                                <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                            )}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
