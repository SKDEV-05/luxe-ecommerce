import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, Calendar, Eye } from 'lucide-react';

interface Order {
    id: number;
    order_number: string;
    status: string;
    subtotal: string;
    tax: string;
    shipping_cost: string;
    total: string;
    created_at: string;
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
}

export default function OrderHistoryPage({ orders }: Props) {
    const formatCurrency = (value: string) => {
        return `${parseFloat(value).toFixed(2)} MAD`;
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400 border-amber-250';
            case 'processing':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-400 border-blue-250';
            case 'shipped':
                return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/30 dark:text-indigo-400 border-indigo-250';
            case 'delivered':
                return 'bg-green-105 text-green-800 dark:bg-green-950/30 dark:text-green-400 border-green-250';
            case 'cancelled':
                return 'bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-400 border-red-250';
            default:
                return 'bg-stone-100 text-stone-850 dark:bg-stone-900 dark:text-stone-300';
        }
    };

    return (
        <>
            <Head title="Order History" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="border-b border-stone-200 dark:border-neutral-900 pb-4">
                    <h1 className="text-2xl font-serif font-bold tracking-tight text-neutral-900 dark:text-stone-100 uppercase">
                        Order History
                    </h1>
                    <p className="text-xs text-neutral-500 font-mono mt-1">View and track all your purchases.</p>
                </div>

                {orders.data.length > 0 ? (
                    <div className="space-y-6">
                        {/* Table layout for desktop, list layout for mobile */}
                        <div className="hidden md:block overflow-hidden border border-stone-200/50 dark:border-neutral-900 bg-white dark:bg-neutral-950 rounded-none">
                            <table className="w-full text-left border-collapse text-sm">
                                <thead>
                                    <tr className="bg-stone-50 dark:bg-neutral-900/50 border-b border-stone-200/50 dark:border-neutral-900 font-mono uppercase text-[10px] tracking-wider text-neutral-450">
                                        <th className="p-4 font-semibold">Order Number</th>
                                        <th className="p-4 font-semibold">Date Placed</th>
                                        <th className="p-4 font-semibold">Status</th>
                                        <th className="p-4 font-semibold">Total Amount</th>
                                        <th className="p-4 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-100 dark:divide-neutral-900">
                                    {orders.data.map((order) => (
                                        <tr key={order.id} className="hover:bg-stone-50/50 dark:hover:bg-neutral-900/20 transition-colors">
                                            <td className="p-4 font-mono font-semibold text-neutral-800 dark:text-stone-250">
                                                {order.order_number}
                                            </td>
                                            <td className="p-4 text-neutral-600 dark:text-stone-300">
                                                {formatDate(order.created_at)}
                                            </td>
                                            <td className="p-4">
                                                <Badge className={`rounded-none font-serif text-[10px] tracking-wider uppercase px-2 py-0.5 border ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </Badge>
                                            </td>
                                            <td className="p-4 font-mono font-bold text-neutral-800 dark:text-stone-200">
                                                {formatCurrency(order.total)}
                                            </td>
                                            <td className="p-4 text-right">
                                                <Button variant="ghost" size="sm" asChild className="text-xs font-serif text-amber-700 hover:text-amber-800 dark:text-amber-500 rounded-none border border-stone-200 dark:border-neutral-800 hover:bg-stone-50 dark:hover:bg-neutral-900 px-3 h-8">
                                                    <Link href={`/account/orders/${order.order_number}`} className="flex items-center gap-1.5">
                                                        <Eye className="h-3.5 w-3.5" /> Details
                                                    </Link>
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile view list */}
                        <div className="md:hidden space-y-4">
                            {orders.data.map((order) => (
                                <div key={order.id} className="border border-stone-200/50 dark:border-neutral-900 bg-white dark:bg-neutral-950 p-4 space-y-4">
                                    <div className="flex items-center justify-between border-b border-stone-100 dark:border-neutral-900 pb-2">
                                        <span className="font-mono text-sm font-bold text-neutral-800 dark:text-stone-200">{order.order_number}</span>
                                        <Badge className={`rounded-none font-serif text-[9px] tracking-widest uppercase px-2 py-0.5 border ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </Badge>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="space-y-0.5">
                                            <span className="text-[10px] text-neutral-450 uppercase font-mono">Date Placed</span>
                                            <span className="block font-semibold text-neutral-700 dark:text-stone-300">{formatDate(order.created_at)}</span>
                                        </div>
                                        <div className="space-y-0.5 text-right">
                                            <span className="text-[10px] text-neutral-450 uppercase font-mono">Total Amount</span>
                                            <span className="block font-mono font-bold text-amber-705 dark:text-amber-550">{formatCurrency(order.total)}</span>
                                        </div>
                                    </div>
                                    <div className="pt-2">
                                        <Button variant="outline" asChild className="w-full text-xs font-serif text-amber-705 hover:bg-stone-50 rounded-none h-9">
                                            <Link href={`/account/orders/${order.order_number}`} className="flex items-center justify-center gap-1.5">
                                                <Eye className="h-4 w-4" /> View Details
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {orders.last_page > 1 && (
                            <div className="flex items-center justify-between border-t border-stone-200/50 dark:border-neutral-900 pt-6">
                                <span className="text-xs text-neutral-450 font-mono">Page {orders.current_page} of {orders.last_page}</span>
                                <div className="flex items-center gap-1">
                                    {orders.links.map((link, idx) => (
                                        <Button
                                            key={idx}
                                            variant={link.active ? 'secondary' : 'ghost'}
                                            size="sm"
                                            disabled={!link.url}
                                            asChild={!!link.url}
                                            className="rounded-none font-mono text-xs"
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
                    </div>
                ) : (
                    <div className="py-16 text-center border border-dashed border-stone-200 dark:border-neutral-900 bg-white dark:bg-neutral-950/20 max-w-lg mx-auto space-y-4">
                        <Package className="h-12 w-12 mx-auto text-stone-300 dark:text-neutral-800" />
                        <div className="space-y-1">
                            <h3 className="font-serif text-lg font-bold">No Orders Placed</h3>
                            <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                                You have not placed any orders yet. Once you place an order, it will appear here.
                            </p>
                        </div>
                        <Button asChild className="bg-amber-600 hover:bg-amber-750 text-stone-105 rounded-none font-serif tracking-wider uppercase text-xs">
                            <Link href="/shop">Start Shopping</Link>
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
}

OrderHistoryPage.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Order History',
            href: '/account/orders',
        },
    ],
};
