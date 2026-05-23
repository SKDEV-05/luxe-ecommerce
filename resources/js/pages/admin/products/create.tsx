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

interface Category {
    id: number;
    name: string;
}

interface Brand {
    id: number;
    name: string;
}

interface Props {
    categories: Category[];
    brands: Brand[];
}

export default function Create({ categories, brands }: Props) {
    const breadcrumbs = [
        { title: 'Admin', href: '/admin/dashboard' },
        { title: 'Products', href: '/admin/products' },
        { title: 'Create', href: '/admin/products/create' },
    ];

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        sku: '',
        price: '',
        sale_price: '',
        stock_quantity: 10,
        brand_id: '',
        category_id: '',
        type: 'perfume',
        gender: 'unisex',
        volume: '',
        image_url: '',
        short_description: '',
        description: '',
        is_featured: false,
        is_active: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/products');
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Product - Admin" />

            <div className="space-y-6 max-w-4xl mx-auto">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/products">
                            <ChevronLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-serif font-bold tracking-tight text-neutral-900 dark:text-neutral-50 font-serif">Create Product</h1>
                        <p className="text-neutral-550 text-sm">Add a new luxury product item to the store catalog.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-3">
                    {/* Left & Middle Column: Main Details */}
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
                                        placeholder="e.g., Sauvage Eau de Parfum, Rouge Dior - 999 Velvet"
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
                                        placeholder="A brief, glamorous summary showing in product cards..."
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
                                        placeholder="Detailed descriptions about notes, formulas, ingredients, heritage..."
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
                                        placeholder="120.00"
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
                                        placeholder="95.00"
                                        value={data.sale_price}
                                        onChange={(e) => setData('sale_price', e.target.value)}
                                    />
                                    <InputError message={errors.sale_price} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="sku">SKU Code</Label>
                                    <Input
                                        id="sku"
                                        placeholder="LP-DIOR-SAU-EDP"
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

                    {/* Right Column: Taxonomy, Visuals & Settings */}
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
                                            placeholder="e.g. 100ml, 50ml, 3.5g"
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
                                        placeholder="e.g., https://images.unsplash.com/..."
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
                                Create Product
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
