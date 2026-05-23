import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronLeft } from 'lucide-react';
import InputError from '@/components/input-error';

interface ParentCategory {
    id: number;
    name: string;
}

interface Props {
    parentCategories: ParentCategory[];
}

export default function Create({ parentCategories }: Props) {
    const breadcrumbs = [
        { title: 'Admin', href: '/admin/dashboard' },
        { title: 'Categories', href: '/admin/categories' },
        { title: 'Create', href: '/admin/categories/create' },
    ];

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        image_url: '',
        parent_id: '',
        sort_order: 0,
        is_active: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/categories');
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Category - Admin" />

            <div className="space-y-6 max-w-2xl mx-auto">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/categories">
                            <ChevronLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-serif font-bold tracking-tight text-neutral-900 dark:text-neutral-50 font-serif">Create Category</h1>
                        <p className="text-neutral-550 text-sm">Add a new category or subcategory to your store catalog.</p>
                    </div>
                </div>

                <Card className="border-neutral-100 dark:border-neutral-800 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-serif">Category Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Category Name</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g., Eau de Parfum, Lipstick, Skincare Serums"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <textarea
                                    id="description"
                                    rows={4}
                                    placeholder="Write a brief luxury description for the category storefront page..."
                                    className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                />
                                <InputError message={errors.description} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="image_url">Image URL</Label>
                                <Input
                                    id="image_url"
                                    placeholder="e.g., https://images.unsplash.com/... (luxury visual)"
                                    value={data.image_url}
                                    onChange={(e) => setData('image_url', e.target.value)}
                                />
                                <span className="text-xs text-neutral-400">Use high-quality Unsplash image URLs for luxury visuals.</span>
                                <InputError message={errors.image_url} />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="parent_id">Parent Category (Optional)</Label>
                                    <Select
                                        value={data.parent_id || 'none'}
                                        onValueChange={(val) => setData('parent_id', val === 'none' ? '' : val)}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Parent Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">None (Root Category)</SelectItem>
                                            {parentCategories.map((cat) => (
                                                <SelectItem key={cat.id} value={cat.id.toString()}>
                                                    {cat.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.parent_id} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="sort_order">Sort Order</Label>
                                    <Input
                                        id="sort_order"
                                        type="number"
                                        min={0}
                                        value={data.sort_order}
                                        onChange={(e) => setData('sort_order', parseInt(e.target.value) || 0)}
                                    />
                                    <InputError message={errors.sort_order} />
                                </div>
                            </div>

                            <div className="flex items-center space-x-2 pt-2">
                                <Checkbox
                                    id="is_active"
                                    checked={data.is_active}
                                    onCheckedChange={(checked) => setData('is_active', !!checked)}
                                />
                                <Label htmlFor="is_active" className="cursor-pointer font-medium text-neutral-700 dark:text-neutral-300">
                                    Display Category on Storefront
                                </Label>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                                <Button variant="outline" asChild>
                                    <Link href="/admin/categories">Cancel</Link>
                                </Button>
                                <Button type="submit" disabled={processing} className="bg-amber-600 hover:bg-amber-700 text-white">
                                    Create Category
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
