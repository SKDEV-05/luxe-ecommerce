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

interface Product {
    id: number;
    name: string;
    sku: string;
    price: string;
    sale_price: string | null;
    stock_quantity: number;
    brand_id: number;
    category_id: number;
    type: string;
    gender: string;
    volume: string | null;
    image_url: string | null;
    short_description: string | null;
    description: string | null;
    is_featured: boolean;
    is_active: boolean;
}

interface Category {
    id: number;
    name: string;
}

interface Brand {
    id: number;
    name: string;
}

interface Props {
    product: Product;
    categories: Category[];
    brands: Brand[];
}

export default function Edit({ product, categories, brands }: Props) {
    const breadcrumbs = [
        { title: 'Admin', href: '/admin/dashboard' },
        { title: 'Products', href: '/admin/products' },
        { title: `Edit ${product.name}`, href: `/admin/products/${product.id}/edit` },
    ];

    const { data, setData, put, processing, errors } = useForm({
        name: product.name,
        sku: product.sku,
        price: product.price,
        sale_price: product.sale_price || '',
        stock_quantity: product.stock_quantity,
        brand_id: product.brand_id.toString(),
        category_id: product.category_id.toString(),
        type: product.type,
        gender: product.gender,
        volume: product.volume || '',
        image_url: product.image_url || '',
        short_description: product.short_description || '',
        description: product.description || '',
        is_featured: product.is_featured,
        is_active: product.is_active,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/products/${product.id}`);
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${product.name} - Admin`} />

            <div className="space-y-6 max-w-4xl mx-auto">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/products">
                            <ChevronLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-serif font-bold tracking-tight text-neutral-900 dark:text-neutral-50 font-serif">Edit Product</h1>
                        <p className="text-neutral-550 text-sm">Update parameters, inventory details, pricing or metadata for this product.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-3">
                    {/* Main Details */}
                    <div className="md:col-span-2 space-y-6">
                        <Card className="border-neutral-100 dark:border-neutral-800 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg font-serif">Product Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Product Name</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="short_description">Short Summary</Label>
                                    <Input
                                        id="short_description"
                                        value={data.short_description}
                                        onChange={(e) => setData('short_description', e.target.value)}
                                    />
                                    <InputError message={errors.short_description} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Full Description</Label>
                                    <textarea
                                        id="description"
                                        rows={8}
                                        className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                    />
                                    <InputError message={errors.description} />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-neutral-100 dark:border-neutral-800 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg font-serif">Pricing & Inventory</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Regular Price (MAD)</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        value={data.price}
                                        onChange={(e) => setData('price', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.price} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="sale_price">Sale Price (MAD) (Optional)</Label>
                                    <Input
                                        id="sale_price"
                                        type="number"
                                        step="0.01"
                                        value={data.sale_price}
                                        onChange={(e) => setData('sale_price', e.target.value)}
                                    />
                                    <InputError message={errors.sale_price} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="sku">SKU Code</Label>
                                    <Input
                                        id="sku"
                                        value={data.sku}
                                        onChange={(e) => setData('sku', e.target.value.toUpperCase())}
                                        required
                                    />
                                    <InputError message={errors.sku} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="stock_quantity">Stock Quantity</Label>
                                    <Input
                                        id="stock_quantity"
                                        type="number"
                                        min={0}
                                        value={data.stock_quantity}
                                        onChange={(e) => setData('stock_quantity', parseInt(e.target.value) || 0)}
                                        required
                                    />
                                    <InputError message={errors.stock_quantity} />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Taxonomy & Settings */}
                    <div className="space-y-6">
                        <Card className="border-neutral-100 dark:border-neutral-800 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg font-serif">Attributes & Categories</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="brand_id">Luxury Brand House</Label>
                                    <Select
                                        value={data.brand_id}
                                        onValueChange={(val) => setData('brand_id', val)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Brand" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {brands.map((b) => (
                                                <SelectItem key={b.id} value={b.id.toString()}>{b.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.brand_id} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="category_id">Category</Label>
                                    <Select
                                        value={data.category_id}
                                        onValueChange={(val) => setData('category_id', val)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((cat) => (
                                                <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.category_id} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="type">Product Type</Label>
                                    <Select
                                        value={data.type}
                                        onValueChange={(val: any) => setData('type', val)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="perfume">Perfume</SelectItem>
                                            <SelectItem value="makeup">Makeup</SelectItem>
                                            <SelectItem value="skincare">Skincare</SelectItem>
                                            <SelectItem value="jewelry">Jewelry</SelectItem>
                                            <SelectItem value="accessory">Accessory</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.type} />
                                </div>

                                <div className="grid gap-4 grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="gender">Gender Profile</Label>
                                        <Select
                                            value={data.gender}
                                            onValueChange={(val: any) => setData('gender', val)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Gender" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="unisex">Unisex</SelectItem>
                                                <SelectItem value="men">Men</SelectItem>
                                                <SelectItem value="women">Women</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.gender} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="volume">Volume / Size</Label>
                                        <Input
                                            id="volume"
                                            value={data.volume}
                                            onChange={(e) => setData('volume', e.target.value)}
                                        />
                                        <InputError message={errors.volume} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-neutral-100 dark:border-neutral-800 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg font-serif">Visuals & Status</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="image_url">Main Image URL</Label>
                                    <Input
                                        id="image_url"
                                        value={data.image_url}
                                        onChange={(e) => setData('image_url', e.target.value)}
                                    />
                                    <span className="text-xs text-neutral-400">Provide an Unsplash luxury photography URL.</span>
                                    <InputError message={errors.image_url} />
                                </div>

                                <div className="flex items-center space-x-2 pt-2">
                                    <Checkbox
                                        id="is_featured"
                                        checked={data.is_featured}
                                        onCheckedChange={(checked) => setData('is_featured', !!checked)}
                                    />
                                    <Label htmlFor="is_featured" className="cursor-pointer">Featured Product</Label>
                                </div>

                                <div className="flex items-center space-x-2 pt-1">
                                    <Checkbox
                                        id="is_active"
                                        checked={data.is_active}
                                        onCheckedChange={(checked) => setData('is_active', !!checked)}
                                    />
                                    <Label htmlFor="is_active" className="cursor-pointer">Active / Visible in Shop</Label>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex flex-col gap-2 pt-2">
                            <Button type="submit" disabled={processing} className="w-full bg-amber-600 hover:bg-amber-700 text-white font-serif font-bold tracking-wide">
                                Save Changes
                            </Button>
                            <Button type="button" variant="outline" asChild className="w-full">
                                <Link href="/admin/products">Cancel</Link>
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
