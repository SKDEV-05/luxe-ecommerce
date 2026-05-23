import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Trash2, Award, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface Brand {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    logo_url: string | null;
    country: string | null;
    is_featured: boolean;
    products_count?: number;
}

interface Props {
    brands: Brand[];
}

export default function Index({ brands }: Props) {
    const breadcrumbs = [
        { title: 'Admin', href: '/admin/dashboard' },
        { title: 'Brands', href: '/admin/brands' },
    ];

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Are you sure you want to delete the brand "${name}"? All associated products will also be deleted!`)) {
            router.delete(`/admin/brands/${id}`, {
                onSuccess: () => {
                    toast.success('Brand deleted successfully');
                },
                onError: () => {
                    toast.error('Failed to delete brand');
                }
            });
        }
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Brands - Admin" />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-serif font-bold tracking-tight text-neutral-900 dark:text-neutral-50 font-serif">Brands</h1>
                        <p className="text-neutral-550 dark:text-neutral-450 mt-1">Manage brand houses and origins to organize products.</p>
                    </div>
                    <Button asChild className="bg-amber-600 hover:bg-amber-700 text-white font-medium transition-all duration-300">
                        <Link href="/admin/brands/create" className="flex items-center gap-2">
                            <Plus className="h-4 w-4" /> Add Brand
                        </Link>
                    </Button>
                </div>

                <Card className="border-neutral-100 dark:border-neutral-800 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-serif">Luxury Houses</CardTitle>
                    </CardHeader>
                    <CardContent className="px-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-neutral-100 dark:border-neutral-800 text-xs font-semibold text-neutral-400 uppercase tracking-wider bg-neutral-50 dark:bg-neutral-900 px-6 py-3">
                                        <th className="px-6 py-3">Brand House</th>
                                        <th className="px-6 py-3">Origin Country</th>
                                        <th className="px-6 py-3">Featured status</th>
                                        <th className="px-6 py-3 text-center">Products Count</th>
                                        <th className="px-6 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                    {brands.length > 0 ? (
                                        brands.map((brand) => (
                                            <tr key={brand.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/10 text-sm">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        {brand.logo_url ? (
                                                            <img
                                                                src={brand.logo_url}
                                                                alt={brand.name}
                                                                className="h-10 w-10 object-contain bg-white dark:bg-neutral-800 p-1 rounded-md border border-neutral-105 dark:border-neutral-800"
                                                            />
                                                        ) : (
                                                            <div className="h-10 w-10 bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center rounded-md border border-neutral-200 dark:border-neutral-700">
                                                                <Award className="h-5 w-5 text-neutral-400" />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <div className="font-semibold text-neutral-800 dark:text-neutral-200">{brand.name}</div>
                                                            <div className="text-xs text-neutral-450 truncate max-w-[300px]">{brand.description || 'No description'}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-neutral-700 dark:text-neutral-300 font-medium">{brand.country || 'N/A'}</td>
                                                <td className="px-6 py-4">
                                                    <Badge className={brand.is_featured ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/20 dark:text-amber-400' : 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-400'}>
                                                        {brand.is_featured ? 'Featured' : 'Standard'}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 text-center font-mono font-medium">{brand.products_count ?? 0}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button variant="ghost" size="icon" asChild title="View Brand Shop">
                                                            <Link href={`/brands/${brand.slug}`}>
                                                                <ExternalLink className="h-4 w-4 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200" />
                                                            </Link>
                                                        </Button>
                                                        <Button variant="ghost" size="icon" asChild title="Edit">
                                                            <Link href={`/admin/brands/${brand.id}/edit`}>
                                                                <Edit2 className="h-4 w-4 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300" />
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            title="Delete"
                                                            onClick={() => handleDelete(brand.id, brand.name)}
                                                        >
                                                            <Trash2 className="h-4 w-4 text-red-650 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-neutral-400">No brands found.</td>
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
