import { Head, Link, router } from '@inertiajs/react';
import StorefrontLayout from '@/layouts/storefront-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { ShoppingBag, Star, Package, Filter, X } from 'lucide-react';
import ProductImage from '@/components/product-image';

interface Product {
    id: number;
    name: string;
    sku: string;
    price: string;
    sale_price: string | null;
    image_url: string | null;
    gender: string;
    volume: string | null;
    type: string;
    brand?: {
        name: string;
    };
    category?: {
        name: string;
    };
}

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface Brand {
    id: number;
    name: string;
    slug: string;
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
        category?: string;
        brand?: string;
        type?: string;
        gender?: string;
        price_min?: string;
        price_max?: string;
        sort?: string;
    };
}

export default function Shop({ products, categories, brands, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || 'all');
    const [selectedBrand, setSelectedBrand] = useState(filters.brand || 'all');
    const [selectedType, setSelectedType] = useState(filters.type || 'all');
    const [selectedGender, setSelectedGender] = useState(filters.gender || 'all');
    const [priceMin, setPriceMin] = useState(filters.price_min || '');
    const [priceMax, setPriceMax] = useState(filters.price_max || '');
    const [sort, setSort] = useState(filters.sort || 'newest');
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    const formatCurrency = (value: string | number) => {
        const num = typeof value === 'string' ? parseFloat(value) : value;
        return `${num.toFixed(2)} MAD`;
    };

    const handleApplyFilters = () => {
        router.get('/shop', {
            search: search || undefined,
            category: selectedCategory === 'all' ? undefined : selectedCategory,
            brand: selectedBrand === 'all' ? undefined : selectedBrand,
            type: selectedType === 'all' ? undefined : selectedType,
            gender: selectedGender === 'all' ? undefined : selectedGender,
            price_min: priceMin || undefined,
            price_max: priceMax || undefined,
            sort: sort || undefined,
        }, { preserveState: true });
        setMobileFiltersOpen(false);
    };

    const handleClearFilters = () => {
        setSearch('');
        setSelectedCategory('all');
        setSelectedBrand('all');
        setSelectedType('all');
        setSelectedGender('all');
        setPriceMin('');
        setPriceMax('');
        setSort('newest');
        router.get('/shop');
        setMobileFiltersOpen(false);
    };

    const handleSortChange = (val: string) => {
        setSort(val);
        router.get('/shop', {
            search: search || undefined,
            category: selectedCategory === 'all' ? undefined : selectedCategory,
            brand: selectedBrand === 'all' ? undefined : selectedBrand,
            type: selectedType === 'all' ? undefined : selectedType,
            gender: selectedGender === 'all' ? undefined : selectedGender,
            price_min: priceMin || undefined,
            price_max: priceMax || undefined,
            sort: val,
        }, { preserveState: true });
    };

    const FilterSection = () => (
        <div className="space-y-6 text-sm">
            {/* Search */}
            <div className="space-y-2">
                <h4 className="font-semibold uppercase tracking-wider text-xs text-stone-500 font-mono">Search Keyword</h4>
                <Input
                    placeholder="Search perfumes..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="text-xs"
                />
            </div>

            {/* Department / Category */}
            <div className="space-y-2">
                <h4 className="font-semibold uppercase tracking-wider text-xs text-stone-500 font-mono">Department</h4>
                <div className="space-y-1.5 flex flex-col">
                    <button
                        className={`text-left py-1 hover:text-amber-600 font-medium ${selectedCategory === 'all' ? 'text-amber-700 font-bold' : 'text-neutral-600 dark:text-stone-300'}`}
                        onClick={() => setSelectedCategory('all')}
                    >
                        All Departments
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            className={`text-left py-1 hover:text-amber-600 font-medium ${selectedCategory === cat.slug ? 'text-amber-700 font-bold' : 'text-neutral-600 dark:text-stone-300'}`}
                            onClick={() => setSelectedCategory(cat.slug)}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Brand Houses */}
            <div className="space-y-2">
                <h4 className="font-semibold uppercase tracking-wider text-xs text-stone-500 font-mono">Brand House</h4>
                <div className="space-y-1.5 flex flex-col max-h-48 overflow-y-auto pr-2 scrollbar-thin">
                    <button
                        className={`text-left py-1 hover:text-amber-600 font-medium ${selectedBrand === 'all' ? 'text-amber-700 font-bold' : 'text-neutral-600 dark:text-stone-300'}`}
                        onClick={() => setSelectedBrand('all')}
                    >
                        All Brands
                    </button>
                    {brands.map((b) => (
                        <button
                            key={b.id}
                            className={`text-left py-1 hover:text-amber-600 font-medium ${selectedBrand === b.slug ? 'text-amber-700 font-bold' : 'text-neutral-600 dark:text-stone-300'}`}
                            onClick={() => setSelectedBrand(b.slug)}
                        >
                            {b.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Product Type */}
            <div className="space-y-2">
                <h4 className="font-semibold uppercase tracking-wider text-xs text-stone-500 font-mono">Product Type</h4>
                <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="text-xs h-9">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="perfume">Perfume</SelectItem>
                        <SelectItem value="makeup">Makeup</SelectItem>
                        <SelectItem value="skincare">Skincare</SelectItem>
                        <SelectItem value="jewelry">Jewelry</SelectItem>
                        <SelectItem value="accessory">Accessory</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Gender */}
            <div className="space-y-2">
                <h4 className="font-semibold uppercase tracking-wider text-xs text-stone-500 font-mono">Gender Profile</h4>
                <Select value={selectedGender} onValueChange={setSelectedGender}>
                    <SelectTrigger className="text-xs h-9">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Unisex &amp; All</SelectItem>
                        <SelectItem value="unisex">Unisex</SelectItem>
                        <SelectItem value="men">Men</SelectItem>
                        <SelectItem value="women">Women</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Price Range */}
            <div className="space-y-2">
                <h4 className="font-semibold uppercase tracking-wider text-xs text-stone-500 font-mono">Price ($)</h4>
                <div className="flex gap-2">
                    <Input
                        type="number"
                        placeholder="Min"
                        className="text-xs h-9"
                        value={priceMin}
                        onChange={(e) => setPriceMin(e.target.value)}
                    />
                    <span className="self-center text-neutral-450">-</span>
                    <Input
                        type="number"
                        placeholder="Max"
                        className="text-xs h-9"
                        value={priceMax}
                        onChange={(e) => setPriceMax(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex gap-2 pt-2">
                <Button onClick={handleApplyFilters} className="bg-amber-600 hover:bg-amber-700 text-stone-50 text-xs py-1.5 flex-1">
                    Apply Filters
                </Button>
                <Button variant="outline" onClick={handleClearFilters} className="text-xs py-1.5 flex-1">
                    Clear
                </Button>
            </div>
        </div>
    );

    return (
        <StorefrontLayout>
            <Head title="Shop All Luxury Collection" />

            {/* Banner Overview */}
            <div className="bg-stone-100 dark:bg-neutral-900/30 border-b border-stone-200/50 dark:border-neutral-900 py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-2">
                    <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight">Luxury Boutique</h1>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 font-serif max-w-lg mx-auto">
                        Refining elegance through pure ingredients, heritage craftsmanship, and timeless creations.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex gap-8">
                    {/* Desktop Sidebar Filters */}
                    <aside className="hidden md:block w-64 shrink-0 border-r border-stone-200/50 dark:border-neutral-900 pr-6">
                        <div className="sticky top-28">
                            <FilterSection />
                        </div>
                    </aside>

                    {/* Shop Body */}
                    <div className="flex-1 space-y-6">
                        {/* Upper controls */}
                        <div className="flex items-center justify-between gap-4">
                            <button
                                onClick={() => setMobileFiltersOpen(true)}
                                className="md:hidden flex items-center gap-1.5 px-3 py-1.5 border border-stone-200 rounded-md text-xs font-medium"
                            >
                                <Filter className="h-3.5 w-3.5" /> Filters
                            </button>
                            <span className="text-xs text-neutral-500 font-mono hidden sm:inline">
                                Showing {products.data.length} of {products.total} exquisite products
                            </span>

                            <div className="flex items-center gap-2">
                                <span className="text-xs text-neutral-550 shrink-0 font-serif">Sort By</span>
                                <Select value={sort} onValueChange={handleSortChange}>
                                    <SelectTrigger className="text-xs h-9 w-40">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="newest">New Arrivals</SelectItem>
                                        <SelectItem value="price_low_high">Price: Low to High</SelectItem>
                                        <SelectItem value="price_high_low">Price: High to Low</SelectItem>
                                        <SelectItem value="name_asc">Name: A to Z</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Product Grid */}
                        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                            {products.data.length > 0 ? (
                                products.data.map((product) => (
                                    <Card key={product.id} className="border-stone-200/50 dark:border-neutral-900 bg-white dark:bg-neutral-950 rounded-none overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col h-full group">
                                        <Link href={`/shop/${product.sku}`} className="relative aspect-[4/5] bg-stone-100 dark:bg-neutral-900 overflow-hidden block">
                                            <ProductImage
                                                src={product.image_url}
                                                alt={product.name}
                                                brandName={product.brand?.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <span className="absolute top-3 left-3 bg-stone-900/70 backdrop-blur-xs text-white text-[9px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-none font-medium">
                                                {product.gender}
                                            </span>
                                            {product.sale_price && (
                                                <span className="absolute top-3 right-3 bg-amber-700 text-stone-100 text-[9px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-none font-bold">
                                                    Sale
                                                </span>
                                            )}
                                        </Link>
                                        <CardContent className="p-5 flex-grow flex flex-col justify-between space-y-4">
                                            <div className="space-y-1">
                                                <span className="text-[10px] tracking-widest font-mono text-neutral-450 uppercase block">
                                                    {product.brand?.name}
                                                </span>
                                                <Link href={`/shop/${product.sku}`}>
                                                    <h3 className="font-serif font-bold text-sm tracking-wide text-neutral-800 dark:text-stone-200 truncate hover:text-amber-700 dark:hover:text-amber-500 transition-colors">
                                                        {product.name}
                                                    </h3>
                                                </Link>
                                                <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-serif">
                                                    <span>{product.volume}</span>
                                                    {product.volume && product.category?.name && <span>&bull;</span>}
                                                    <span>{product.category?.name}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-neutral-900">
                                                <div className="font-mono text-sm">
                                                    {product.sale_price ? (
                                                        <div className="flex items-baseline gap-1.5">
                                                            <span className="font-semibold text-amber-700 dark:text-amber-500">{formatCurrency(product.sale_price)}</span>
                                                            <span className="text-xs text-neutral-400 line-through">{formatCurrency(product.price)}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="font-semibold text-amber-700 dark:text-amber-500">{formatCurrency(product.price)}</span>
                                                    )}
                                                </div>
                                                <Button variant="ghost" size="sm" asChild className="text-xs font-serif text-amber-700 hover:text-amber-800 dark:text-amber-500 hover:bg-stone-50 dark:hover:bg-neutral-900 px-2 py-1 h-auto rounded-none border-b border-transparent hover:border-amber-600">
                                                    <Link href={`/shop/${product.sku}`}>View Details</Link>
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <div className="col-span-full py-16 text-center text-neutral-400 space-y-2 border border-dashed border-stone-200 rounded-lg">
                                    <Package className="h-10 w-10 mx-auto text-stone-300" />
                                    <p className="font-serif">No products found matching the criteria.</p>
                                    <button onClick={handleClearFilters} className="text-amber-600 text-xs underline font-serif font-bold">Clear Filters</button>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {products.last_page > 1 && (
                            <div className="flex items-center justify-between border-t border-stone-200/50 dark:border-neutral-900 pt-6">
                                <span className="text-xs text-neutral-400 font-mono">Page {products.current_page} of {products.last_page}</span>
                                <div className="flex items-center gap-1">
                                    {products.links.map((link, idx) => (
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
                </div>
            </div>

            {/* Mobile Filters Drawer Overlay */}
            {mobileFiltersOpen && (
                <div className="fixed inset-0 z-50 flex md:hidden bg-stone-900/50 backdrop-blur-xs">
                    <div className="relative w-80 max-w-full bg-stone-50 dark:bg-neutral-950 p-6 flex flex-col overflow-y-auto h-full shadow-2xl ml-auto">
                        <div className="flex justify-between items-center pb-4 border-b border-stone-200 dark:border-neutral-900">
                            <h3 className="font-serif font-bold text-lg">Filters</h3>
                            <button onClick={() => setMobileFiltersOpen(false)}>
                                <X className="h-5 w-5 text-neutral-500" />
                            </button>
                        </div>
                        <div className="py-6 flex-grow">
                            <FilterSection />
                        </div>
                    </div>
                </div>
            )}
        </StorefrontLayout>
    );
}
