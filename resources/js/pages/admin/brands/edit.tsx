import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronLeft } from 'lucide-react';
import InputError from '@/components/input-error';

interface Brand {
    id: number;
    name: string;
    description: string | null;
    logo_url: string | null;
    country: string | null;
    is_featured: boolean;
}

interface Props {
    brand: Brand;
}

export default function Edit({ brand }: Props) {
    const breadcrumbs = [
        { title: 'Admin', href: '/admin/dashboard' },
        { title: 'Brands', href: '/admin/brands' },
        { title: `Edit ${brand.name}`, href: `/admin/brands/${brand.id}/edit` },
    ];

    const { data, setData, put, processing, errors } = useForm({
        name: brand.name,
        description: brand.description || '',
        logo_url: brand.logo_url || '',
        country: brand.country || '',
        is_featured: brand.is_featured,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/brands/${brand.id}`);
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${brand.name} - Admin`} />

            <div className="space-y-6 max-w-2xl mx-auto">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/brands">
                            <ChevronLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-serif font-bold tracking-tight text-neutral-900 dark:text-neutral-50 font-serif">Edit Brand House: {brand.name}</h1>
                        <p className="text-neutral-550 text-sm">Update the origin, descriptions, logo, or features of this luxury house.</p>
                    </div>
                </div>

                <Card className="border-neutral-100 dark:border-neutral-800 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-serif">Brand Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Brand Name</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Heritage & Description</Label>
                                <textarea
                                    id="description"
                                    rows={4}
                                    className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                />
                                <InputError message={errors.description} />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="country">Country of Origin</Label>
                                    <Input
                                        id="country"
                                        value={data.country}
                                        onChange={(e) => setData('country', e.target.value)}
                                    />
                                    <InputError message={errors.country} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="logo_url">Logo Image URL</Label>
                                    <Input
                                        id="logo_url"
                                        value={data.logo_url}
                                        onChange={(e) => setData('logo_url', e.target.value)}
                                    />
                                    <InputError message={errors.logo_url} />
                                </div>
                            </div>

                            <div className="flex items-center space-x-2 pt-2">
                                <Checkbox
                                    id="is_featured"
                                    checked={data.is_featured}
                                    onCheckedChange={(checked) => setData('is_featured', !!checked)}
                                />
                                <Label htmlFor="is_featured" className="cursor-pointer font-medium text-neutral-700 dark:text-neutral-300">
                                    Feature this Brand on Storefront Homepage
                                </Label>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                                <Button variant="outline" asChild>
                                    <Link href="/admin/brands">Cancel</Link>
                                </Button>
                                <Button type="submit" disabled={processing} className="bg-amber-600 hover:bg-amber-700 text-white">
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
