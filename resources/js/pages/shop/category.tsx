import { Head, Link } from '@inertiajs/react';
import StorefrontLayout from '@/layouts/storefront-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, ArrowLeft } from 'lucide-react';
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
    description: string | null;
    image_url: string | null;
}

interface PaginatedProducts {
    data: Product[];
    links: any[];
    current_page: number;
    last_page: number;
    total: number;
}

interface Props {
    category: Category;
    products: PaginatedProducts;
}

export default function CategoryPage({ category, products }: Props) {
    const formatCurrency = (value: string | number) => {
        const num = typeof value === 'string' ? parseFloat(value) : value;
        return `${num.toFixed(2)} MAD`;
    };

    return (
        <StorefrontLayout>
            <Head title={`${category.name} - Luxury Collection`} />

            {/* Category Banner */}
            <div className="relative bg-stone-900 text-stone-100 py-24 px-4 overflow-hidden border-b border-stone-850">
                {category.image_url && (
                    <div className="absolute inset-0 z-0 opacity-40">
                        <img 
                            src={category.image_url} 
                            alt={category.name} 
                            className="w-full h-full object-cover filter grayscale sepia brightness-50"
                        />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent z-10" />
                
                <div className="relative z-20 max-w-5xl mx-auto text-center space-y-4">
                    <Link href="/shop" className="inline-flex items-center gap-1.5 text-xs tracking-widest uppercase text-amber-500 hover:text-amber-400 transition-colors font-mono">
                        <ArrowLeft className="h-3 w-3" /> Back to Boutique
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight uppercase text-amber-500 dark:text-amber-500">
                        {category.name}
                    </h1>
                    {category.description && (
                        <p className="text-sm md:text-base text-stone-300 font-serif max-w-xl mx-auto leading-relaxed">
                            {category.description}
                        </p>
                    )}
                </div>
            </div>

            {/* Product Listing */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex items-center justify-between border-b border-stone-200 dark:border-neutral-900 pb-4 mb-8">
                    <span className="text-xs text-neutral-500 font-mono">
                        Showing {products.data.length} of {products.total} exquisite items
                    </span>
                </div>

                {products.data.length > 0 ? (
                    <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {products.data.map((product) => (
                            <Card key={product.id} className="border-stone-200/50 dark:border-neutral-900 bg-white dark:bg-neutral-950 rounded-none overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full group">
                                <Link href={`/shop/${product.sku}`} className="relative aspect-[4/5] bg-stone-100 dark:bg-neutral-905 overflow-hidden block">
                                    <ProductImage
                                        src={product.image_url}
                                        alt={product.name}
                                        brandName={product.brand?.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <span className="absolute top-3 left-3 bg-stone-905/80 backdrop-blur-xs text-stone-100 text-[9px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-none font-medium">
                                        {product.gender}
                                    </span>
                                    {product.sale_price && (
                                        <span className="absolute top-3 right-3 bg-amber-705 text-stone-100 text-[9px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-none font-bold">
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
                                        <div className="flex items-center gap-1.5 text-xs text-neutral-450 font-serif">
                                            <span>{product.volume}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between pt-3 border-t border-stone-100 dark:border-neutral-900">
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
                                            <Link href={`/shop/${product.sku}`}>View</Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="py-24 text-center text-neutral-400 space-y-4 border border-dashed border-stone-200 rounded-lg">
                        <Package className="h-12 w-12 mx-auto text-stone-300" />
                        <h3 className="font-serif text-lg">No Products Available</h3>
                        <p className="text-sm max-w-xs mx-auto">There are currently no products under the {category.name} category.</p>
                        <Button asChild className="bg-amber-600 hover:bg-amber-750 text-stone-100 font-serif">
                            <Link href="/shop">Continue Shopping</Link>
                        </Button>
                    </div>
                )}

                {/* Pagination */}
                {products.last_page > 1 && (
                    <div className="flex items-center justify-between border-t border-stone-200/50 dark:border-neutral-900 pt-6 mt-12">
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
        </StorefrontLayout>
    );
}
