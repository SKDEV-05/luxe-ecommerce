import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit2, Trash2, Package, Search, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Product {
    id: number;
    name: string;
    sku: string;
    price: string;
    sale_price: string | null;
    stock_quantity: number;
    image_url: string | null;
    is_featured: boolean;
    is_active: boolean;
    type: string;
    brand?: { name: string };
    category?: { name: string };
}

interface Category {
    id: number;
    name: string;
}

interface Brand {
    id: number;
    name: string;
}

interface PaginatedProducts {
    data: Product[];
    links: any[];
    current_page: number;
    last_page: number;
    total: number;
}

interface Props {
    products: PaginatedProducts;
    categories: Category[];
    brands: Brand[];
    filters: {
        search?: string;
        category_id?: string;
        brand_id?: string;
    };
}

export default function Index({ products, categories, brands, filters }: Props) {
    const breadcrumbs = [
        { title: 'Admin', href: '/admin/dashboard' },
        { title: 'Products', href: '/admin/products' },
    ];

    const [search, setSearch] = useState(filters.search || '');
    const [categoryId, setCategoryId] = useState(filters.category_id || 'all');
    const [brandId, setBrandId] = useState(filters.brand_id || 'all');

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/products', {
            search: search || undefined,
            category_id: categoryId === 'all' ? undefined : categoryId,
            brand_id: brandId === 'all' ? undefined : brandId,
        }, { preserveState: true });
    };

    const handleReset = () => {
        setSearch('');
        setCategoryId('all');
        setBrandId('all');
        router.get('/admin/products');
    };

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Are you sure you want to delete the product "${name}"?`)) {
            router.delete(`/admin/products/${id}`, {
                onSuccess: () => {
                    toast.success('Product deleted successfully');
                },
                onError: () => {
                    toast.error('Failed to delete product');
                }
            });
        }
    };

    const formatCurrency = (value: string | number) => {
        const num = typeof value === 'string' ? parseFloat(value) : value;
        return `${num.toFixed(2)} MAD`;
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Products - Admin" />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-serif font-bold tracking-tight text-neutral-900 dark:text-neutral-50 font-serif">Products</h1>
                        <p className="text-neutral-550 dark:text-neutral-450 mt-1">Manage luxury perfumes, cosmetics, jewelry, and accessories.</p>
                    </div>
                    <Button asChild className="bg-amber-600 hover:bg-amber-700 text-white font-medium transition-all duration-300">
                        <Link href="/admin/products/create" className="flex items-center gap-2">
                            <Plus className="h-4 w-4" /> Add Product
                        </Link>
                    </Button>
                </div>

                {/* Filters */}
                <Card className="border-neutral-100 dark:border-neutral-800 shadow-sm">
                    <CardContent className="p-4">
                        <form onSubmit={handleFilter} className="flex flex-col md:flex-row gap-4 items-end">
                            <div className="flex-1 space-y-1">
                                <span className="text-xs font-semibold text-neutral-400 uppercase">Search Catalog</span>
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-400" />
                                    <Input
                                        placeholder="Search by product name, SKU or brand..."
                                        className="pl-9"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="w-full md:w-48 space-y-1">
                                <span className="text-xs font-semibold text-neutral-400 uppercase">Category</span>
                                <Select value={categoryId} onValueChange={setCategoryId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Categories</SelectItem>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="w-full md:w-48 space-y-1">
                                <span className="text-xs font-semibold text-neutral-400 uppercase">Brand</span>
                                <Select value={brandId} onValueChange={setBrandId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Brand" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Brands</SelectItem>
                                        {brands.map((b) => (
                                            <SelectItem key={b.id} value={b.id.toString()}>{b.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex w-full md:w-auto gap-2">
                                <Button type="submit" className="bg-neutral-800 hover:bg-neutral-900 text-white dark:bg-neutral-200 dark:text-neutral-900 dark:hover:bg-neutral-100 flex-1 md:flex-none">
                                    Apply
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
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg font-serif">Product Catalog ({products.total})</CardTitle>
                    </CardHeader>
                    <CardContent className="px-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-neutral-100 dark:border-neutral-800 text-xs font-semibold text-neutral-400 uppercase tracking-wider bg-neutral-50 dark:bg-neutral-900 px-6 py-3">
                                        <th className="px-6 py-3">Product details</th>
                                        <th className="px-6 py-3">SKU</th>
                                        <th className="px-6 py-3">Type / category</th>
                                        <th className="px-6 py-3">Price</th>
                                        <th className="px-6 py-3 text-center">Stock</th>
                                        <th className="px-6 py-3 text-center">Status</th>
                                        <th className="px-6 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                    {products.data.length > 0 ? (
                                        products.data.map((product) => (
                                            <tr key={product.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/10 text-sm">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        {product.image_url ? (
                                                            <img
                                                                src={product.image_url}
                                                                alt={product.name}
                                                                className="h-12 w-12 object-cover rounded-md border border-neutral-100 dark:border-neutral-800"
                                                            />
                                                        ) : (
                                                            <div className="h-12 w-12 bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center rounded-md border border-neutral-200 dark:border-neutral-700">
                                                                <Package className="h-6 w-6 text-neutral-400" />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <div className="font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                                                                {product.name}
                                                                {product.is_featured && (
                                                                    <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950/20 dark:text-amber-400 text-[10px] scale-90 px-1 py-0 font-serif">Featured</Badge>
                                                                )}
                                                            </div>
                                                            <div className="text-xs text-neutral-450">{product.brand?.name || 'No brand'}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-mono text-xs text-neutral-500 dark:text-neutral-400">{product.sku}</td>
                                                <td className="px-6 py-4">
                                                    <div className="text-neutral-700 dark:text-neutral-300 font-medium capitalize">{product.type}</div>
                                                    <div className="text-xs text-neutral-400">{product.category?.name || 'N/A'}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {product.sale_price ? (
                                                        <div className="flex flex-col">
                                                            <span className="font-semibold text-green-600 dark:text-green-400 font-mono">{formatCurrency(product.sale_price)}</span>
                                                            <span className="text-xs text-neutral-400 line-through font-mono">{formatCurrency(product.price)}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="font-semibold text-neutral-800 dark:text-neutral-200 font-mono">{formatCurrency(product.price)}</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    {product.stock_quantity <= 0 ? (
                                                        <Badge variant="outline" className="border-red-500/30 text-red-500 bg-red-500/5 font-mono">Out of stock</Badge>
                                                    ) : product.stock_quantity <= 5 ? (
                                                        <Badge variant="outline" className="border-yellow-500/30 text-yellow-500 bg-yellow-500/5 font-mono">Low ({product.stock_quantity})</Badge>
                                                    ) : (
                                                        <span className="font-mono text-neutral-700 dark:text-neutral-350">{product.stock_quantity}</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <Badge className={product.is_active ? 'bg-green-100 text-green-800 dark:bg-green-950/20 dark:text-green-400' : 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-400'}>
                                                        {product.is_active ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button variant="ghost" size="icon" asChild title="View on Storefront">
                                                            <Link href={`/shop/${product.sku}`}>
                                                                <ExternalLink className="h-4 w-4 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200" />
                                                            </Link>
                                                        </Button>
                                                        <Button variant="ghost" size="icon" asChild title="Edit">
                                                            <Link href={`/admin/products/${product.id}/edit`}>
                                                                <Edit2 className="h-4 w-4 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300" />
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            title="Delete"
                                                            onClick={() => handleDelete(product.id, product.name)}
                                                        >
                                                            <Trash2 className="h-4 w-4 text-red-650 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-8 text-center text-neutral-400">No products found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Links */}
                        {products.last_page > 1 && (
                            <div className="flex items-center justify-between border-t border-neutral-100 dark:border-neutral-800 px-6 py-4">
                                <span className="text-xs text-neutral-400">Page {products.current_page} of {products.last_page}</span>
                                <div className="flex items-center gap-1">
                                    {products.links.map((link, idx) => (
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
