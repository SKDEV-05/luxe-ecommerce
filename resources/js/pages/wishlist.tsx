import { Head, Link, router } from '@inertiajs/react';
import StorefrontLayout from '@/layouts/storefront-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingBag, Eye, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
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
    brand: {
        name: string;
    } | null;
}

interface Props {
    products: Product[];
}

export default function WishlistPage({ products }: Props) {
    const formatCurrency = (value: string | number) => {
        const num = typeof value === 'string' ? parseFloat(value) : value;
        return `${num.toFixed(2)} MAD`;
    };

    const handleRemoveFromWishlist = (productId: number) => {
        router.post('/wishlist', { product_id: productId }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Removed from wishlist');
            }
        });
    };

    const handleAddToCart = (productId: number, productName: string) => {
        router.post('/cart', { product_id: productId, quantity: 1 }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(`${productName} added to cart!`);
            }
        });
    };

    return (
        <StorefrontLayout>
            <Head title="My Wishlist - Luxe Parfum" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="border-b border-stone-200 dark:border-neutral-900 pb-4 mb-10">
                    <h1 className="text-3xl font-serif font-bold tracking-tight uppercase text-neutral-900 dark:text-stone-100">
                        My Wishlist
                    </h1>
                    <p className="text-xs text-neutral-500 font-mono mt-1">Keep track of the luxury items you desire.</p>
                </div>

                {products.length > 0 ? (
                    <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {products.map((product) => {
                            const price = product.sale_price ? parseFloat(product.sale_price) : parseFloat(product.price);
                            return (
                                <Card key={product.id} className="border-stone-200/50 dark:border-neutral-900 bg-white dark:bg-neutral-950 rounded-none overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full group relative">
                                    {/* Remove Button (Heart Icon overlay) */}
                                    <button 
                                        onClick={() => handleRemoveFromWishlist(product.id)}
                                        className="absolute top-3 right-3 z-30 p-2 bg-white/80 dark:bg-black/80 backdrop-blur-xs text-red-650 hover:text-red-700 transition-colors rounded-full"
                                        title="Remove from wishlist"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>

                                    {/* Product Image Link */}
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
                                            <div className="text-xs text-neutral-400 font-serif">
                                                {product.volume}
                                            </div>
                                        </div>

                                        <div className="space-y-3 pt-3 border-t border-stone-105 dark:border-neutral-900">
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

                                            <div className="flex gap-2">
                                                <Button 
                                                    onClick={() => handleAddToCart(product.id, product.name)}
                                                    className="flex-1 bg-amber-600 hover:bg-amber-700 text-stone-100 text-xs py-2 px-3 rounded-none font-serif flex items-center justify-center gap-1"
                                                >
                                                    <ShoppingBag className="h-3.5 w-3.5" /> Add to Cart
                                                </Button>
                                                <Button 
                                                    variant="outline" 
                                                    asChild 
                                                    className="rounded-none px-3"
                                                >
                                                    <Link href={`/shop/${product.sku}`} title="View Details">
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                ) : (
                    <div className="py-24 text-center border border-dashed border-stone-200 dark:border-neutral-900 rounded-none bg-white dark:bg-neutral-950/20 max-w-2xl mx-auto space-y-6">
                        <Heart className="h-16 w-16 mx-auto text-stone-300 dark:text-neutral-800" />
                        <div className="space-y-2">
                            <h3 className="font-serif text-xl font-bold">Your Wishlist is Empty</h3>
                            <p className="text-sm text-neutral-500 max-w-sm mx-auto">
                                Save items you like here to purchase them later or monitor their stock.
                            </p>
                        </div>
                        <Button asChild className="bg-amber-600 hover:bg-amber-750 text-stone-100 rounded-none font-serif tracking-wider uppercase">
                            <Link href="/shop">Explore Boutique</Link>
                        </Button>
                    </div>
                )}
            </div>
        </StorefrontLayout>
    );
}
