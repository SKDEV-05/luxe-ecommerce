import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Banknote, ShoppingCart, Package, Users, AlertTriangle, CheckSquare } from 'lucide-react';

interface Stats {
    total_sales: number;
    orders_count: number;
    confirmed_orders_count: number;
    products_count: number;
    users_count: number;
    low_stock_count: number;
}

interface Order {
    id: number;
    order_number: string;
    user?: {
        name: string;
        email: string;
    };
    status: string;
    total: string;
    created_at: string;
}

interface UserData {
    id: number;
    name: string;
    email: string;
    created_at: string;
}

interface MonthlySale {
    month: string;
    sales: number;
}

interface Props {
    stats: Stats;
    recent_orders: Order[];
    recent_users: UserData[];
    monthly_sales: MonthlySale[];
}

function SalesChart({ data }: { data: MonthlySale[] }) {
    if (!data || data.length === 0) {
        return (
            <div className="flex h-[240px] items-center justify-center text-neutral-400 font-serif">
                No sales data available.
            </div>
        );
    }

    const maxSales = Math.max(...data.map(d => d.sales), 1000);
    const height = 240;
    const width = 600;
    const paddingLeft = 60;
    const paddingRight = 20;
    const paddingTop = 20;
    const paddingBottom = 40;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    // Generate coordinates
    const points = data.map((d, index) => {
        const x = paddingLeft + (index / (data.length - 1 || 1)) * chartWidth;
        const y = paddingTop + chartHeight - (d.sales / maxSales) * chartHeight;
        return { x, y, label: d.month, value: d.sales };
    });

    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const areaPath = points.length > 0 
        ? `${linePath} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`
        : '';

    return (
        <div className="w-full overflow-hidden">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
                <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ec4899" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#ec4899" stopOpacity="0.0" />
                    </linearGradient>
                </defs>

                {/* Y-axis Grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                    const y = paddingTop + chartHeight * ratio;
                    const val = maxSales * (1 - ratio);
                    return (
                        <g key={i} className="opacity-30 dark:opacity-20">
                            <line
                                x1={paddingLeft}
                                y1={y}
                                x2={width - paddingRight}
                                y2={y}
                                stroke="currentColor"
                                strokeDasharray="3,3"
                                className="text-neutral-300 dark:text-neutral-700"
                            />
                            <text
                                x={paddingLeft - 10}
                                y={y + 4}
                                textAnchor="end"
                                fontSize="9"
                                className="fill-neutral-400 dark:fill-neutral-500 font-mono"
                            >
                                {val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val.toFixed(0)}
                            </text>
                        </g>
                    );
                })}

                {/* Area under the line */}
                {areaPath && (
                    <path d={areaPath} fill="url(#chartGradient)" />
                )}

                {/* Line chart path */}
                {linePath && (
                    <path
                        d={linePath}
                        fill="none"
                        stroke="#ec4899"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                )}

                {/* Data Points */}
                {points.map((p, i) => (
                    <g key={i} className="group/point">
                        <circle
                            cx={p.x}
                            cy={p.y}
                            r="4"
                            className="fill-white stroke-amber-500 dark:stroke-amber-400 stroke-[2.5] hover:r-5 transition-all duration-200 cursor-pointer"
                        />
                        {/* Tooltip on hover */}
                        <g className="opacity-0 group-hover/point:opacity-100 transition-opacity duration-200 pointer-events-none">
                            <rect
                                x={p.x - 55}
                                y={p.y - 32}
                                width="110"
                                height="22"
                                rx="4"
                                className="fill-neutral-900 dark:fill-neutral-800 shadow-md"
                            />
                            <text
                                x={p.x}
                                y={p.y - 18}
                                textAnchor="middle"
                                fontSize="9.5"
                                fontWeight="bold"
                                className="fill-white font-mono"
                            >
                                {p.value.toFixed(2)} MAD
                            </text>
                        </g>
                    </g>
                ))}

                {/* X-axis labels */}
                {points.map((p, i) => (
                    <text
                        key={i}
                        x={p.x}
                        y={paddingTop + chartHeight + 20}
                        textAnchor="middle"
                        fontSize="9.5"
                        className="fill-neutral-400 dark:fill-neutral-500 font-medium font-mono"
                    >
                        {p.label}
                    </text>
                ))}
            </svg>
        </div>
    );
}

export default function Dashboard({ stats, recent_orders, recent_users, monthly_sales }: Props) {
    const breadcrumbs = [{ title: 'Admin', href: '/admin/dashboard' }, { title: 'Dashboard', href: '/admin/dashboard' }];

    const formatCurrency = (value: number | string) => {
        const num = typeof value === 'string' ? parseFloat(value) : value;
        return `${num.toFixed(2)} MAD`;
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
            processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
            shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
            delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
            cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        };
        return (
            <Badge variant="secondary" className={`${styles[status] || ''} capitalize font-medium rounded-full px-2.5 py-0.5 text-xs`}>
                {status}
            </Badge>
        );
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-serif font-bold tracking-tight text-neutral-900 dark:text-neutral-50">Administration Overview</h1>
                    <p className="text-neutral-500 dark:text-neutral-400 mt-1">Manage products, orders, customers and track sales metrics.</p>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                    <Card className="border-amber-500/10 shadow-sm hover:shadow-md transition-all duration-300">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Total Revenue</CardTitle>
                            <Banknote className="h-4 w-4 text-amber-600 dark:text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold font-mono tracking-tight">{formatCurrency(stats.total_sales)}</div>
                            <p className="text-xs text-neutral-400 mt-1">From processed orders</p>
                        </CardContent>
                    </Card>

                    <Card className="border-amber-500/10 shadow-sm hover:shadow-md transition-all duration-300">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Total Orders</CardTitle>
                            <ShoppingCart className="h-4 w-4 text-amber-600 dark:text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold font-mono tracking-tight">{stats.orders_count}</div>
                            <p className="text-xs text-neutral-400 mt-1">Orders placed to date</p>
                        </CardContent>
                    </Card>

                    <Card className="border-amber-500/10 shadow-sm hover:shadow-md transition-all duration-300">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Confirmed Orders</CardTitle>
                            <CheckSquare className="h-4 w-4 text-emerald-600 dark:text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold font-mono tracking-tight">{stats.confirmed_orders_count}</div>
                            <p className="text-xs text-neutral-400 mt-1">Confirmed & processing</p>
                        </CardContent>
                    </Card>

                    <Card className="border-amber-500/10 shadow-sm hover:shadow-md transition-all duration-300">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Products Catalog</CardTitle>
                            <Package className="h-4 w-4 text-amber-600 dark:text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold font-mono tracking-tight">{stats.products_count}</div>
                            <p className="text-xs text-neutral-400 mt-1">Active store products</p>
                        </CardContent>
                    </Card>

                    <Card className="border-amber-500/10 shadow-sm hover:shadow-md transition-all duration-300">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Total Customers</CardTitle>
                            <Users className="h-4 w-4 text-amber-600 dark:text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold font-mono tracking-tight">{stats.users_count}</div>
                            <p className="text-xs text-neutral-400 mt-1">Registered users</p>
                        </CardContent>
                    </Card>

                    <Card className={`border-amber-500/10 shadow-sm hover:shadow-md transition-all duration-300 ${stats.low_stock_count > 0 ? 'bg-red-50/50 dark:bg-red-950/10 border-red-500/20' : ''}`}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Low Stock Warning</CardTitle>
                            <AlertTriangle className={`h-4 w-4 ${stats.low_stock_count > 0 ? 'text-red-500' : 'text-neutral-400'}`} />
                        </CardHeader>
                        <CardContent>
                            <div className={`text-2xl font-bold font-mono tracking-tight ${stats.low_stock_count > 0 ? 'text-red-600 dark:text-red-400' : ''}`}>{stats.low_stock_count}</div>
                            <p className="text-xs text-neutral-400 mt-1">Products with stock &le; 5</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Sales Analytics Chart */}
                <Card className="border-neutral-100 dark:border-neutral-800 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div>
                            <CardTitle className="text-lg font-serif font-bold">Sales Analytics</CardTitle>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Monthly revenue distribution in MAD</p>
                        </div>
                        <Badge variant="outline" className="font-mono text-amber-600 dark:text-amber-500 border-amber-500/20">Live Revenue</Badge>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <SalesChart data={monthly_sales} />
                    </CardContent>
                </Card>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Recent Orders */}
                    <Card className="border-neutral-100 dark:border-neutral-800 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg font-serif font-bold">Recent Orders</CardTitle>
                            <Badge variant="outline" className="font-mono">{recent_orders.length} orders</Badge>
                        </CardHeader>
                        <CardContent className="px-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-neutral-100 dark:border-neutral-800 text-xs font-semibold text-neutral-400 uppercase tracking-wider bg-neutral-50 dark:bg-neutral-900 px-6 py-3">
                                            <th className="px-6 py-3">Order #</th>
                                            <th className="px-6 py-3">Customer</th>
                                            <th className="px-6 py-3">Status</th>
                                            <th className="px-6 py-3 text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                        {recent_orders.length > 0 ? (
                                            recent_orders.map((order) => (
                                                <tr key={order.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/10 text-sm">
                                                    <td className="px-6 py-4 font-mono font-medium text-amber-600 dark:text-amber-500">
                                                        <a href={`/admin/orders/${order.id}`} className="hover:underline">
                                                            {order.order_number}
                                                        </a>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="font-medium text-neutral-800 dark:text-neutral-200">{order.user?.name || 'Guest'}</div>
                                                        <div className="text-xs text-neutral-400 font-mono">{order.user?.email || ''}</div>
                                                    </td>
                                                    <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                                                    <td className="px-6 py-4 text-right font-mono font-semibold text-neutral-800 dark:text-neutral-200">
                                                        {formatCurrency(parseFloat(order.total))}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-8 text-center text-neutral-400">No orders placed yet.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Users */}
                    <Card className="border-neutral-100 dark:border-neutral-800 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg font-serif font-bold">New Registrations</CardTitle>
                            <Badge variant="outline" className="font-mono">New Customers</Badge>
                        </CardHeader>
                        <CardContent className="px-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-neutral-100 dark:border-neutral-800 text-xs font-semibold text-neutral-400 uppercase tracking-wider bg-neutral-50 dark:bg-neutral-900 px-6 py-3">
                                            <th className="px-6 py-3">Customer</th>
                                            <th className="px-6 py-3 font-mono">Email</th>
                                            <th className="px-6 py-3 text-right">Joined</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                        {recent_users.length > 0 ? (
                                            recent_users.map((user) => (
                                                <tr key={user.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/10 text-sm">
                                                    <td className="px-6 py-4 font-medium text-neutral-800 dark:text-neutral-200">
                                                        {user.name}
                                                    </td>
                                                    <td className="px-6 py-4 font-mono text-xs text-neutral-500 dark:text-neutral-400">
                                                        {user.email}
                                                    </td>
                                                    <td className="px-6 py-4 text-right text-xs text-neutral-400 font-mono">
                                                        {new Date(user.created_at).toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={3} className="px-6 py-8 text-center text-neutral-400">No users registered yet.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
