import { Head, Link } from '@inertiajs/react';
import StorefrontLayout from '@/layouts/storefront-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Sparkles, ShieldCheck, Gift, Truck } from 'lucide-react';
import { useState, useEffect } from 'react';
import luxeLogo from '@/assets/luxe_logo.png';
import ProductImage from '@/components/product-image';

interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    image_url: string | null;
}

interface Brand {
    id: number;
    name: string;
    slug: string;
    logo_url: string | null;
}

interface Product {
    id: number;
    name: string;
    sku: string;
    price: string;
    sale_price: string | null;
    image_url: string | null;
    gender: string;
    volume: string | null;
    brand?: {
        name: string;
    };
    category?: {
        name: string;
    };
}

interface Props {
    featuredProducts: Product[];
    newArrivals: Product[];
    categories: Category[];
    featuredBrands: Brand[];
}

const renderBrandLogo = (slug: string) => {
    switch (slug) {
        case 'dior':
            return (
                <span className="text-2xl md:text-3xl font-serif font-black tracking-[0.15em] text-neutral-850 dark:text-stone-250">
                    DIOR
                </span>
            );
        case 'chanel':
            return (
                <div className="flex flex-col items-center gap-1.5">
                    <svg className="w-14 h-14 md:w-16 md:h-16 fill-none stroke-neutral-850 dark:stroke-stone-250" viewBox="0 0 40 30" xmlns="http://www.w3.org/2000/svg">
                        <path d="M 16 15 A 8 8 0 1 1 16 7 M 16 15 A 8 8 0 1 0 16 23" strokeWidth="2.5" strokeLinecap="round" />
                        <path d="M 24 15 A 8 8 0 1 0 24 7 M 24 15 A 8 8 0 1 1 24 23" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                    <span className="text-[8px] md:text-[9px] font-bold tracking-[0.2em] font-sans text-neutral-850 dark:text-stone-250 uppercase">CHANEL</span>
                </div>
            );
        case 'yves-saint-laurent':
            return (
                <div className="flex flex-col items-center">
                    <span className="text-2xl md:text-3xl font-serif font-black tracking-[-0.05em] text-neutral-850 dark:text-stone-250 leading-none">YSL</span>
                    <span className="text-[7px] font-bold tracking-[0.2em] text-neutral-500 uppercase mt-1">SAINT LAURENT</span>
                </div>
            );
        case 'tom-ford':
            return (
                <div className="border-[1.5px] border-neutral-850 dark:border-stone-300 px-3 py-1">
                    <span className="text-[13px] md:text-[15px] font-black tracking-[0.15em] text-neutral-850 dark:text-stone-250 uppercase">TOM FORD</span>
                </div>
            );
        case 'guerlain':
            return (
                <span className="text-xl md:text-2xl font-serif font-bold italic tracking-wide text-neutral-850 dark:text-stone-250">
                    Guerlain
                </span>
            );
        case 'la-mer':
            return (
                <div className="flex flex-col items-center">
                    <span className="text-[15px] md:text-[17px] font-serif font-extrabold tracking-[0.15em] text-neutral-850 dark:text-stone-250 leading-none">LA MER</span>
                    <span className="text-[6px] tracking-widest text-neutral-400 uppercase font-mono mt-0.5">DE L'OCEAN</span>
                </div>
            );
        case 'hermes':
            return (
                <div className="flex flex-col items-center">
                    <span className="text-[14px] md:text-[16px] font-serif font-extrabold tracking-[0.2em] text-neutral-850 dark:text-stone-250 leading-none">HERMÈS</span>
                    <span className="text-[7px] tracking-widest text-neutral-400 uppercase font-mono mt-0.5">PARIS</span>
                </div>
            );
        case 'cartier':
            return (
                <span className="text-2xl md:text-3xl font-serif font-light italic tracking-wider text-neutral-850 dark:text-stone-250">
                    Cartier
                </span>
            );
        case 'creed':
            return (
                <div className="flex flex-col items-center">
                    <span className="text-[15px] md:text-[17px] font-serif font-bold tracking-[0.15em] text-neutral-850 dark:text-stone-250 leading-none">CREED</span>
                    <span className="text-[7px] tracking-widest text-neutral-400 uppercase font-mono mt-0.5">1760</span>
                </div>
            );
        case 'louis-vuitton':
            return (
                <div className="flex flex-col items-center">
                    <span className="text-[14px] md:text-[16px] font-serif font-extrabold tracking-[0.15em] text-neutral-850 dark:text-stone-250 leading-none">LOUIS VUITTON</span>
                    <span className="text-[7px] tracking-[0.2em] text-neutral-400 uppercase font-mono mt-0.5">PARIS</span>
                </div>
            );
        case 'charlotte-tilbury':
            return (
                <div className="flex flex-col items-center text-center">
                    <span className="text-[11px] md:text-[13px] font-extrabold tracking-[0.1em] text-neutral-850 dark:text-stone-250 leading-none">CHARLOTTE</span>
                    <span className="text-[9px] md:text-[11px] font-bold tracking-[0.1em] text-neutral-850 dark:text-stone-250 leading-none mt-0.5">TILBURY</span>
                </div>
            );
        default:
            return (
                <span className="font-serif font-bold text-sm tracking-widest text-neutral-850 dark:text-stone-350 uppercase">
                    {slug.replace('-', ' ')}
                </span>
            );
    }
};

function BrandSlider({ brands }: { brands: Brand[] }) {
    if (brands.length === 0) return null;

    // Build array that holds enough duplicates to fill screen
    const [items, setItems] = useState(() => {
        let list = [...brands];
        while (list.length < 18) {
            list = [...list, ...brands];
        }
        return list;
    });

    const [isTransitioning, setIsTransitioning] = useState(true);
    const [visibleItems, setVisibleItems] = useState(6);
    
    // Initial translateX set to offset by exactly 1 item width
    const [translateX, setTranslateX] = useState(-100 / items.length);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setVisibleItems(2);
            } else if (window.innerWidth < 1024) {
                setVisibleItems(4);
            } else {
                setVisibleItems(6);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            // Slide left-to-right by moving translateX to 0
            setIsTransitioning(true);
            setTranslateX(0);

            // Once the transition finishes, pop the last element to the front and reset the translation
            setTimeout(() => {
                setIsTransitioning(false);
                setItems((prev) => {
                    const next = [...prev];
                    const last = next.pop();
                    if (last) {
                        next.unshift(last);
                    }
                    return next;
                });
                // Reset translateX back to one item width offset
                setTranslateX(-100 / items.length);
            }, 800);
        }, 2000);

        return () => clearInterval(interval);
    }, [brands, items.length]);

    return (
        <div className="w-full overflow-hidden py-6 relative">
            {/* Elegant side-fade overlays to blend circular logos into background */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-stone-50 to-transparent dark:from-neutral-950 z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-stone-50 to-transparent dark:from-neutral-950 z-10 pointer-events-none" />

            <div 
                className="flex gap-4 items-center"
                style={{
                    transform: `translateX(${translateX}%)`,
                    transition: isTransitioning ? 'transform 800ms cubic-bezier(0.25, 1, 0.5, 1)' : 'none',
                    width: `${(items.length / visibleItems) * 100}%`,
                }}
            >
                {items.map((brand, idx) => (
                    <div 
                        key={`${brand.id}-${idx}`}
                        className="flex-shrink-0 flex justify-center"
                        style={{ width: `${100 / items.length}%` }}
                    >
                        <Link
                            href={`/brands/${brand.slug}`}
                            className="h-24 flex items-center justify-center transition-all duration-300 hover:scale-110 opacity-70 hover:opacity-100 group"
                        >
                            {renderBrandLogo(brand.slug)}
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function Welcome({ featuredProducts, newArrivals, categories, featuredBrands }: Props) {
    const [showSplash, setShowSplash] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);
    const [zoomLogo, setZoomLogo] = useState(false);

    useEffect(() => {
        const hasSeenSplash = sessionStorage.getItem('luxe_splash_seen');
        if (!hasSeenSplash) {
            setShowSplash(true);
            
            // Step 1: Wait for logo to fade in, then start zoom
            const zoomTimeout = setTimeout(() => {
                setZoomLogo(true);
            }, 1500);

            // Step 2: Start fade out of the screen
            const fadeTimeout = setTimeout(() => {
                setFadeOut(true);
            }, 1800);

            // Step 3: Complete splash screen and hide it
            const endTimeout = setTimeout(() => {
                setShowSplash(false);
                sessionStorage.setItem('luxe_splash_seen', 'true');
            }, 2600);

            return () => {
                clearTimeout(zoomTimeout);
                clearTimeout(fadeTimeout);
                clearTimeout(endTimeout);
            };
        }
    }, []);

    const formatCurrency = (value: string | number) => {
        const num = typeof value === 'string' ? parseFloat(value) : value;
        return `${num.toFixed(2)} MAD`;
    };

    return (
        <>
            {showSplash && (
                <div 
                    className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-stone-950 text-white transition-opacity duration-700 ease-in-out ${
                        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
                    }`}
                >
                    <div className="relative flex flex-col items-center justify-center max-w-xs px-6">
                        {/* Logo with fade-in and explosive zoom-in transition */}
                        <img 
                            src={luxeLogo} 
                            alt="Luxe Logo" 
                            className={`w-48 h-auto object-contain transition-transform duration-1000 ease-in-out ${
                                zoomLogo ? 'scale-[6] opacity-0 blur-xs' : 'scale-100 opacity-100'
                            }`} 
                        />
                        
                        {/* Subtext that fades away before zoom */}
                        <div 
                            className={`text-center mt-6 transition-all duration-550 ease-out ${
                                zoomLogo ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
                            }`}
                        >
                            <span className="text-[10px] tracking-[0.3em] text-amber-500 uppercase font-mono block">
                                HAUTE PARFUMERIE &amp; BEAUTÉ
                            </span>
                            <div className="h-0.5 w-12 bg-amber-500/30 mx-auto mt-4 animate-pulse"></div>
                        </div>
                    </div>
                </div>
            )}

            <StorefrontLayout>
            <Head title="Haute Parfumerie & Luxury Cosmetics" />

            {/* Hero Section */}
            <div className="relative bg-stone-900 h-[650px] flex items-center justify-center overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1541643600914-78b084683601?w=1600"
                        alt="Luxury Fragrances Hero"
                        className="w-full h-full object-cover opacity-35 filter brightness-90 saturate-50"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/50 to-transparent"></div>
                </div>

                {/* Hero Content */}
                <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white space-y-6">
                    <span className="text-xs tracking-[0.3em] text-amber-500 uppercase font-mono block">
                        Luxe Collection 2026
                    </span>
                    <h1 className="text-4xl md:text-6xl font-serif font-light tracking-wide leading-tight">
                        The Art of <span className="font-serif italic font-normal text-amber-100">Exquisite</span> Fragrances
                    </h1>
                    <p className="text-sm md:text-base text-stone-300 max-w-2xl mx-auto font-serif leading-relaxed tracking-wide">
                        Indulge in olfactory masterpieces, haute couture cosmetics, and fine jewelry curated from the world's most prestigious maisons.
                    </p>
                    <div className="pt-4 flex justify-center gap-4">
                        <Button asChild className="bg-amber-600 hover:bg-amber-700 text-stone-50 font-serif font-medium tracking-wider px-8 py-6 text-sm rounded-none border border-amber-600 hover:border-amber-700 transition-all duration-300">
                            <Link href="/shop">Explore Shop</Link>
                        </Button>
                        <Button variant="outline" asChild className="border-stone-300 text-white bg-transparent hover:bg-white/10 font-serif tracking-wider px-8 py-6 text-sm rounded-none transition-all duration-300">
                            <Link href="/shop?type=perfume">Fragrance Collection</Link>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Brand Houses Carousel Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-8">
                <div className="space-y-2">
                    <span className="text-xs tracking-[0.2em] text-amber-700 dark:text-amber-500 uppercase font-mono block">Curated Houses</span>
                    <h2 className="text-2xl md:text-3xl font-serif font-bold tracking-tight">The Prestigious Maisons</h2>
                    <div className="h-px w-20 bg-amber-600/30 mx-auto mt-3"></div>
                </div>
                
                <BrandSlider brands={featuredBrands} />
            </div>

            {/* Featured Products Grid */}
            <div className="bg-stone-100/50 dark:bg-neutral-900/10 py-20 border-t border-b border-stone-200/40 dark:border-neutral-900/40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                        <div className="space-y-2">
                            <span className="text-xs tracking-[0.2em] text-amber-700 dark:text-amber-500 uppercase font-mono block">Signature Pieces</span>
                            <h2 className="text-3xl font-serif font-bold tracking-tight">Featured Masterpieces</h2>
                        </div>
                        <Link href="/shop" className="group text-sm font-serif font-semibold text-amber-700 dark:text-amber-500 flex items-center gap-1 hover:underline">
                            View All Catalog <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {featuredProducts.map((product) => (
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
                                        <h3 className="font-serif font-bold text-sm tracking-wide text-neutral-800 dark:text-stone-200 truncate group-hover:text-amber-700 dark:group-hover:text-amber-500 transition-colors">
                                            {product.name}
                                        </h3>
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
                                            <Link href={`/shop/${product.sku}`}>View details</Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            {/* Category Cards Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-12">
                <div className="text-center space-y-2">
                    <span className="text-xs tracking-[0.2em] text-amber-700 dark:text-amber-500 uppercase font-mono block">Discover Collections</span>
                    <h2 className="text-3xl font-serif font-bold tracking-tight">Shop by Department</h2>
                    <div className="h-px w-20 bg-amber-600/30 mx-auto mt-3"></div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {categories.slice(0, 3).map((category) => (
                        <div key={category.id} className="relative group overflow-hidden bg-stone-900 aspect-[4/3] flex items-center justify-center text-center">
                            {category.image_url ? (
                                <img
                                    src={category.image_url}
                                    alt={category.name}
                                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
                                />
                            ) : (
                                <div className="absolute inset-0 bg-stone-850 opacity-60"></div>
                            )}
                            <div className="absolute inset-0 bg-stone-950/20 group-hover:bg-stone-950/45 transition-colors duration-300"></div>

                            <div className="relative z-10 p-6 text-white space-y-2">
                                <h3 className="font-serif text-2xl tracking-wide uppercase">{category.name}</h3>
                                <p className="text-xs text-stone-200 max-w-xs mx-auto line-clamp-2 tracking-wide font-light leading-relaxed">
                                    {category.description}
                                </p>
                                <Button asChild variant="link" className="text-white hover:text-amber-400 font-serif text-xs font-semibold uppercase tracking-wider gap-1.5 p-0">
                                    <Link href={`/categories/${category.slug}`}>
                                        Shop Category <ArrowRight className="h-3 w-3" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Value Pitch Banner */}
            <div className="border-t border-stone-200/50 dark:border-neutral-900 bg-stone-150/40 dark:bg-neutral-950/40 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-8 md:grid-cols-4 text-center">
                    <div className="flex flex-col items-center space-y-3">
                        <div className="h-12 w-12 bg-amber-600/10 rounded-full flex items-center justify-center text-amber-700 dark:text-amber-500">
                            <Truck className="h-6 w-6" />
                        </div>
                        <h4 className="font-serif font-bold text-sm tracking-wide">Complimentary Shipping</h4>
                        <p className="text-xs text-neutral-450 leading-relaxed font-serif max-w-xs">
                            Standard shipping is complimentary on orders of $150 or more.
                        </p>
                    </div>

                    <div className="flex flex-col items-center space-y-3">
                        <div className="h-12 w-12 bg-amber-600/10 rounded-full flex items-center justify-center text-amber-700 dark:text-amber-500">
                            <Sparkles className="h-6 w-6" />
                        </div>
                        <h4 className="font-serif font-bold text-sm tracking-wide">Signature Samples</h4>
                        <p className="text-xs text-neutral-450 leading-relaxed font-serif max-w-xs">
                            Select 3 samples of your choice with every order to discover new favorites.
                        </p>
                    </div>

                    <div className="flex flex-col items-center space-y-3">
                        <div className="h-12 w-12 bg-amber-600/10 rounded-full flex items-center justify-center text-amber-700 dark:text-amber-500">
                            <Gift className="h-6 w-6" />
                        </div>
                        <h4 className="font-serif font-bold text-sm tracking-wide">Art of Gifting</h4>
                        <p className="text-xs text-neutral-450 leading-relaxed font-serif max-w-xs">
                            Receive your items beautifully packed in our signature eco-luxe keepsake box.
                        </p>
                    </div>

                    <div className="flex flex-col items-center space-y-3">
                        <div className="h-12 w-12 bg-amber-600/10 rounded-full flex items-center justify-center text-amber-700 dark:text-amber-500">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        <h4 className="font-serif font-bold text-sm tracking-wide">Guaranteed Authenticity</h4>
                        <p className="text-xs text-neutral-450 leading-relaxed font-serif max-w-xs">
                            All products are authenticated and sourced directly from official houses.
                        </p>
                    </div>
                </div>
            </div>
        </StorefrontLayout>
        </>
    );
}
