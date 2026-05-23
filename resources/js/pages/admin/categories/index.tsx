import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Trash2, Folder, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    image_url: string | null;
    parent_id: number | null;
    parent?: {
        name: string;
    };
    products_count?: number;
    is_active: boolean;
    sort_order: number;
}

interface Props {
    categories: Category[];
}

export default function Index({ categories }: Props) {
    const breadcrumbs = [
        { title: 'Admin', href: '/admin/dashboard' },
        { title: 'Categories', href: '/admin/categories' },
    ];

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Are you sure you want to delete the category "${name}"? Any subcategories will have their parent link updated.`)) {
            router.delete(`/admin/categories/${id}`, {
                onSuccess: () => {
                    toast.success('Category deleted successfully');
                },
                onError: () => {
                    toast.error('Failed to delete category');
                }
            });
        }
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Categories - Admin" />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-serif font-bold tracking-tight text-neutral-900 dark:text-neutral-50 font-serif">Categories</h1>
                        <p className="text-neutral-500 dark:text-neutral-400 mt-1">Manage categories and hierarchy to organize products.</p>
                    </div>
                    <Button asChild className="bg-amber-600 hover:bg-amber-700 text-white font-medium transition-all duration-300">
                        <Link href="/admin/categories/create" className="flex items-center gap-2">
                            <Plus className="h-4 w-4" /> Add Category
                        </Link>
                    </Button>
                </div>

                <Card className="border-neutral-100 dark:border-neutral-800 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-serif">All Categories</CardTitle>
                    </CardHeader>
                    <CardContent className="px-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-neutral-100 dark:border-neutral-800 text-xs font-semibold text-neutral-400 uppercase tracking-wider bg-neutral-50 dark:bg-neutral-900 px-6 py-3">
                                        <th className="px-6 py-3">Image & Name</th>
                                        <th className="px-6 py-3">Slug</th>
                                        <th className="px-6 py-3">Parent</th>
                                        <th className="px-6 py-3 text-center">Sort Order</th>
                                        <th className="px-6 py-3 text-center">Status</th>
                                        <th className="px-6 py-3 text-center">Products</th>
                                        <th className="px-6 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                    {categories.length > 0 ? (
                                        categories.map((category) => (
                                            <tr key={category.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/10 text-sm">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        {category.image_url ? (
                                                            <img
                                                                src={category.image_url}
                                                                alt={category.name}
                                                                className="h-10 w-10 object-cover rounded-md border border-neutral-100 dark:border-neutral-850"
                                                            />
                                                        ) : (
                                                            <div className="h-10 w-10 bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center rounded-md border border-neutral-200 dark:border-neutral-700">
                                                                <Folder className="h-5 w-5 text-neutral-400" />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <div className="font-semibold text-neutral-800 dark:text-neutral-200">{category.name}</div>
                                                            <div className="text-xs text-neutral-450 truncate max-w-[200px]">{category.description || 'No description'}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-mono text-xs text-neutral-500 dark:text-neutral-400">{category.slug}</td>
                                                <td className="px-6 py-4">
                                                    {category.parent ? (
                                                        <Badge variant="secondary" className="bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 font-normal">
                                                            {category.parent.name}
                                                        </Badge>
                                                    ) : (
                                                        <span className="text-xs text-neutral-400 italic">None (Root)</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-center font-mono">{category.sort_order}</td>
                                                <td className="px-6 py-4 text-center">
                                                    <Badge className={category.is_active ? 'bg-green-100 text-green-800 dark:bg-green-950/20 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-950/20 dark:text-red-400'}>
                                                        {category.is_active ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 text-center font-mono font-medium">{category.products_count ?? 0}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button variant="ghost" size="icon" asChild title="View on Storefront">
                                                            <Link href={`/categories/${category.slug}`}>
                                                                <ExternalLink className="h-4 w-4 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200" />
                                                            </Link>
                                                        </Button>
                                                        <Button variant="ghost" size="icon" asChild title="Edit">
                                                            <Link href={`/admin/categories/${category.id}/edit`}>
                                                                <Edit2 className="h-4 w-4 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300" />
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            title="Delete"
                                                            onClick={() => handleDelete(category.id, category.name)}
                                                        >
                                                            <Trash2 className="h-4 w-4 text-red-650 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-8 text-center text-neutral-400">No categories found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
