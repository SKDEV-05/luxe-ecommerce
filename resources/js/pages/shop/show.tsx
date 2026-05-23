import { Head, Link, router } from '@inertiajs/react';
import StorefrontLayout from '@/layouts/storefront-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingBag, ArrowLeft, ShieldCheck, Sparkles, Gift } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface ProductImage {
    id: number;
    image_url: string;
}

interface Product {
    id: number;
    name: string;
    sku: string;
    description: string | null;
    short_description: string | null;
    price: string;
    sale_price: string | null;
    stock_quantity: number;
    image_url: string | null;
    gender: string;
    volume: string | null;
    type: string;
    brand?: {
        name: string;
        slug: string;
    };
    category?: {
        name: string;
        slug: string;
    };
    images: ProductImage[];
}

interface Props {
    product: Product;
    relatedProducts: Product[];
}

export default function Show({ product, relatedProducts }: Props) {
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(product.image_url);

    const formatCurrency = (value: string | number) => {
        const num = typeof value === 'string' ? parseFloat(value) : value;
        return `${num.toFixed(2)} MAD`;
    };

    const handleAddToCart = () => {
        if (product.stock_quantity <= 0) {
            toast.error('This item is currently out of stock');
            return;
        }

        router.post('/cart', {
            product_id: product.id,
            quantity: quantity,
        }, {
            onSuccess: () => {
                toast.success(`Successfully added ${quantity}x ${product.name} to your cart!`);
            },
            onError: () => {
                toast.error('Could not add item to cart. Please try again.');
            }
        });
    };

    const handleAddToWishlist = () => {
        router.post('/wishlist', {
            product_id: product.id,
        }, {
            onSuccess: () => {
                toast.success(`${product.name} updated in your wishlist!`);
            },
            onError: () => {
                toast.error('Could not update wishlist. Please sign in first.');
            }
        });
    };

    return (
        <StorefrontLayout>
            <Head title={`${product.name} - ${product.brand?.name || 'Luxe Parfum'}`} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
                {/* Back button */}
                <Link href="/shop" className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-neutral-500 hover:text-amber-600 font-serif">
                    <ArrowLeft className="h-3.5 w-3.5" /> Back to Boutique
                </Link>

                {/* Product Detail Grid */}
                <div className="grid gap-12 md:grid-cols-2">
                    {/* Left: Product Images */}
                    <div className="space-y-4">
                        <div className="aspect-[4/5] bg-stone-100 dark:bg-neutral-900 border border-stone-200/50 dark:border-neutral-900 overflow-hidden">
                            {activeImage ? (
                                <img
                                    src={activeImage}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-neutral-455">
                                    No Image Available
                                </div>
                            )}
                        </div>

                        {/* Image Gallery Thumbnails */}
                        {product.images.length > 0 && (
                            <div className="flex gap-2 overflow-x-auto">
                                <button
                                    onClick={() => setActiveImage(product.image_url)}
                                    className={`h-20 w-20 border shrink-0 overflow-hidden ${activeImage === product.image_url ? 'border-amber-600' : 'border-stone-200'}`}
                                >
                                    <img src={product.image_url || ''} alt={product.name} className="h-full w-full object-cover" />
                                </button>
                                {product.images.map((img) => (
                                    <button
                                        key={img.id}
                                        onClick={() => setActiveImage(img.image_url)}
                                        className={`h-20 w-20 border shrink-0 overflow-hidden ${activeImage === img.image_url ? 'border-amber-600' : 'border-stone-200'}`}
                                    >
                                        <img src={img.image_url} alt={product.name} className="h-full w-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Product Purchase Details */}
                    <div className="space-y-6">
                        <div className="space-y-2 border-b border-stone-200/50 dark:border-neutral-900 pb-6">
                            <span className="text-xs tracking-[0.25em] font-mono text-amber-700 dark:text-amber-500 uppercase block">
                                {product.brand?.name}
                            </span>
                            <h1 className="text-3xl md:text-4xl font-serif font-light tracking-wide">{product.name}</h1>
                            <div className="flex items-center gap-3 mt-2 flex-wrap">
                                <Badge className="bg-stone-900 text-stone-100 dark:bg-neutral-800 dark:text-stone-300 rounded-none capitalize font-serif">{product.type}</Badge>
                                <Badge variant="outline" className="rounded-none capitalize font-mono text-[10px] tracking-wider">{product.gender}</Badge>
                                {product.volume && (
                                    <span className="text-xs text-neutral-400 font-mono">{product.volume}</span>
                                )}
                            </div>
                        </div>

                        {/* Price & SKU */}
                        <div className="flex justify-between items-baseline gap-4">
                            <div className="font-mono text-2xl">
                                {product.sale_price ? (
                                    <div className="flex items-baseline gap-2">
                                        <span className="font-bold text-amber-700 dark:text-amber-500">{formatCurrency(product.sale_price)}</span>
                                        <span className="text-sm text-neutral-400 line-through">{formatCurrency(product.price)}</span>
                                    </div>
                                ) : (
                                    <span className="font-bold text-neutral-800 dark:text-stone-200">{formatCurrency(product.price)}</span>
                                )}
                            </div>
                            <span className="text-xs text-neutral-400 font-mono">SKU: {product.sku}</span>
                        </div>

                        {/* Short Description */}
                        {product.short_description && (
                            <p className="text-sm font-serif italic text-neutral-600 dark:text-stone-300">
                                {product.short_description}
                            </p>
                        )}

                        {/* Purchase Options */}
                        <div className="space-y-4 pt-4 border-t border-stone-200/50 dark:border-neutral-900">
                            {product.stock_quantity > 0 ? (
                                <div className="space-y-4">
                                    {/* Quantity Selector */}
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-serif uppercase tracking-wider font-semibold">Quantity:</span>
                                        <div className="flex items-center border border-stone-300 dark:border-neutral-800 rounded-md">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="px-3 py-1 text-sm font-mono hover:bg-stone-100 dark:hover:bg-neutral-900 border-r border-stone-300 dark:border-neutral-800"
                                            >
                                                -
                                            </button>
                                            <span className="px-4 py-1 text-sm font-mono font-semibold">{quantity}</span>
                                            <button
                                                onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                                                className="px-3 py-1 text-sm font-mono hover:bg-stone-100 dark:hover:bg-neutral-900 border-l border-stone-300 dark:border-neutral-800"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <span className="text-xs text-neutral-400 font-mono">({product.stock_quantity} available)</span>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-4">
                                        <Button
                                            onClick={handleAddToCart}
                                            className="flex-1 bg-amber-600 hover:bg-amber-700 text-stone-50 py-6 rounded-none tracking-widest uppercase text-xs font-bold font-serif flex items-center justify-center gap-2"
                                        >
                                            <ShoppingBag className="h-4 w-4" /> Add to Cart
                                        </Button>
                                        <Button
                                            onClick={handleAddToWishlist}
                                            variant="outline"
                                            className="py-6 px-6 rounded-none hover:bg-stone-100 dark:hover:bg-neutral-900 flex items-center justify-center border-stone-300"
                                        >
                                            <Heart className="h-4 w-4 text-red-500 fill-current" />
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="p-4 bg-red-50/50 dark:bg-red-950/10 border border-red-500/20 text-red-650 dark:text-red-400 text-sm font-serif italic text-center">
                                        This piece is currently sold out. Contact customer support to be notified of restocks.
                                    </div>
                                    <Button
                                        onClick={handleAddToWishlist}
                                        variant="outline"
                                        className="w-full py-6 rounded-none tracking-widest uppercase text-xs font-bold font-serif flex items-center justify-center gap-2 border-stone-300"
                                    >
                                        <Heart className="h-4 w-4" /> Add to Wishlist
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Value Propositions */}
                        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-stone-200/50 dark:border-neutral-900 text-center text-[10px] text-neutral-450">
                            <div className="flex flex-col items-center gap-1">
                                <ShieldCheck className="h-4 w-4 text-amber-700 dark:text-amber-500" />
                                <span className="font-serif font-bold">100% Authentic</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <Sparkles className="h-4 w-4 text-amber-700 dark:text-amber-500" />
                                <span className="font-serif font-bold">Signature Samples</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <Gift className="h-4 w-4 text-amber-700 dark:text-amber-500" />
                                <span className="font-serif font-bold">Luxury Wrapping</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description Tabs / Details */}
                <div className="border-t border-stone-200/50 dark:border-neutral-900 pt-12 space-y-4">
                    <h3 className="text-xl font-serif font-bold tracking-wide">Heritage &amp; Description</h3>
                    <div className="text-sm text-neutral-600 dark:text-stone-300 leading-relaxed font-serif space-y-4 whitespace-pre-line">
                        {product.description || 'No description available.'}
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="space-y-8 border-t border-stone-200/50 dark:border-neutral-900 pt-16">
                        <div className="text-center space-y-2">
                            <span className="text-xs tracking-[0.2em] text-amber-700 dark:text-amber-500 uppercase font-mono block">Complete Your Ritual</span>
                            <h2 className="text-2xl font-serif font-bold tracking-tight">You May Also Exquisite</h2>
                            <div className="h-px w-20 bg-amber-600/30 mx-auto mt-3"></div>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {relatedProducts.map((relProduct) => (
                                <Card key={relProduct.id} className="border-stone-200/50 dark:border-neutral-900 bg-white dark:bg-neutral-950 rounded-none overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col h-full group">
                                    <Link href={`/shop/${relProduct.sku}`} className="relative aspect-[4/5] bg-stone-100 dark:bg-neutral-900 overflow-hidden block">
                                        {relProduct.image_url ? (
                                            <img
                                                src={relProduct.image_url}
                                                alt={relProduct.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-neutral-400">No Image</div>
                                        )}
                                        <span className="absolute top-3 left-3 bg-stone-900/70 backdrop-blur-xs text-white text-[9px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-none font-medium">
                                            {relProduct.gender}
                                        </span>
                                    </Link>
                                    <CardContent className="p-4 flex-grow flex flex-col justify-between space-y-3">
                                        <div className="space-y-0.5">
                                            <span className="text-[9px] tracking-widest font-mono text-neutral-450 uppercase block">
                                                {relProduct.brand?.name}
                                            </span>
                                            <Link href={`/shop/${relProduct.sku}`}>
                                                <h4 className="font-serif font-bold text-xs tracking-wide text-neutral-800 dark:text-stone-200 truncate group-hover:text-amber-700 dark:group-hover:text-amber-500 transition-colors">
                                                    {relProduct.name}
                                                </h4>
                                            </Link>
                                            <div className="text-[10px] text-neutral-400 font-serif">
                                                {relProduct.volume}
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-neutral-900 font-mono text-xs">
                                            {relProduct.sale_price ? (
                                                <div className="flex items-baseline gap-1">
                                                    <span className="font-semibold text-amber-700 dark:text-amber-500">{formatCurrency(relProduct.sale_price)}</span>
                                                    <span className="text-[10px] text-neutral-400 line-through">{formatCurrency(relProduct.price)}</span>
                                                </div>
                                            ) : (
                                                <span className="font-semibold text-neutral-800 dark:text-stone-250">{formatCurrency(relProduct.price)}</span>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </StorefrontLayout>
    );
}
