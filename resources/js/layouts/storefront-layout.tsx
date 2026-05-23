import { Link, usePage } from '@inertiajs/react';
import { ShoppingBag, Heart, User as UserIcon, LogOut, LayoutGrid, Search, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';

interface User {
    id: number;
    name: string;
    email: string;
    is_admin: boolean;
}

interface SharedProps {
    auth: {
        user: User | null;
    };
    cart_count: number;
    wishlist_count: number;
    flash: {
        success: string | null;
        error: string | null;
    };
}

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
    const { auth, cart_count, wishlist_count, flash } = usePage<any>().props as SharedProps;
    const [searchQuery, setSearchQuery] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/shop', { search: searchQuery });
    };

    return (
        <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 font-sans transition-colors duration-300">
            {/* Announcement Bar */}
            <div className="bg-amber-705 text-stone-100 text-center py-2 text-xs font-serif tracking-widest uppercase">
                Complimentary shipping on orders over 150 MAD &bull; 3 Complimentary Samples With Every Order
            </div>

            {/* Header */}
            <header className="sticky top-0 z-40 w-full border-b border-stone-200/50 dark:border-neutral-900 bg-stone-50/80 dark:bg-neutral-950/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
                    {/* Hamburger Button for mobile */}
                    <button
                        className="md:hidden p-2 text-neutral-600 dark:text-neutral-300 hover:text-amber-600"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>

                    {/* Logo */}
                    <div className="flex-1 md:flex-none flex justify-center md:justify-start">
                        <Link href="/" className="flex flex-col items-center">
                            <span className="font-serif text-2xl font-bold tracking-widest text-amber-700 dark:text-amber-500 uppercase">
                                LUXE PARFUM
                            </span>
                            <span className="text-[9px] tracking-[0.25em] text-neutral-450 uppercase font-mono -mt-1">
                                Haute Parfumerie &amp; Beauté
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden md:flex items-center space-x-8 text-sm font-medium tracking-wide uppercase">
                        <Link href="/shop" className="hover:text-amber-600 transition-colors duration-205">Shop All</Link>
                        <Link href="/shop?type=perfume" className="hover:text-amber-600 transition-colors duration-205">Fragrances</Link>
                        <Link href="/shop?type=makeup" className="hover:text-amber-600 transition-colors duration-205">Makeup</Link>
                        <Link href="/shop?type=skincare" className="hover:text-amber-600 transition-colors duration-205">Skincare</Link>
                        <Link href="/shop?type=jewelry" className="hover:text-amber-600 transition-colors duration-205">Jewelry</Link>
                    </nav>

                    {/* Search, Wishlist, Cart & Account Operations */}
                    <div className="flex items-center space-x-3 sm:space-x-4">
                        {/* Search Bar */}
                        <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center relative">
                            <input
                                type="text"
                                placeholder="Search dior, chanel, fragrances..."
                                className="w-56 border border-stone-250 dark:border-neutral-800 rounded-full px-4 py-1.5 pl-10 text-xs bg-stone-100/50 dark:bg-neutral-900/50 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Search className="h-3.5 w-3.5 text-neutral-400 absolute left-3.5 top-2.5" />
                        </form>

                        <button className="lg:hidden p-2 text-neutral-600 dark:text-neutral-300 hover:text-amber-600" onClick={() => router.get('/shop')}>
                            <Search className="h-5 w-5" />
                        </button>

                        {/* Wishlist Link */}
                        <Link href="/wishlist" className="p-2 text-neutral-600 dark:text-neutral-300 hover:text-amber-600 relative" title="Wishlist">
                            <Heart className="h-5 w-5" />
                            {wishlist_count > 0 && (
                                <span className="absolute top-0 right-0 h-4 w-4 bg-amber-600 text-stone-100 rounded-full text-[9px] font-bold flex items-center justify-center scale-90">
                                    {wishlist_count}
                                </span>
                            )}
                        </Link>

                        {/* Cart Link */}
                        <Link href="/cart" className="p-2 text-neutral-600 dark:text-neutral-300 hover:text-amber-600 relative" title="Cart">
                            <ShoppingBag className="h-5 w-5" />
                            {cart_count > 0 && (
                                <span className="absolute top-0 right-0 h-4 w-4 bg-amber-600 text-stone-100 rounded-full text-[9px] font-bold flex items-center justify-center scale-90">
                                    {cart_count}
                                </span>
                            )}
                        </Link>

                        {/* User Account Dropdown */}
                        {auth.user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="p-2 text-neutral-600 dark:text-neutral-300 hover:text-amber-600 focus:outline-none" title="Account">
                                        <UserIcon className="h-5 w-5" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 mt-2 border-stone-200 dark:border-neutral-800">
                                    <DropdownMenuLabel className="font-serif">My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <div className="px-2 py-1.5 text-xs text-neutral-500">
                                        Signed in as <span className="font-semibold text-neutral-800 dark:text-neutral-200">{auth.user.name}</span>
                                    </div>
                                    <DropdownMenuSeparator />
                                    {auth.user.is_admin ? (
                                        <DropdownMenuItem asChild className="text-amber-600 dark:text-amber-400 font-semibold focus:text-amber-700">
                                            <Link href="/admin/dashboard" className="cursor-pointer flex items-center gap-1.5">
                                                <LayoutGrid className="h-4 w-4" /> Admin Dashboard
                                            </Link>
                                        </DropdownMenuItem>
                                    ) : (
                                        <>
                                            <DropdownMenuItem asChild>
                                                <Link href="/account/orders" className="cursor-pointer">My Orders</Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href="/wishlist" className="cursor-pointer">My Wishlist</Link>
                                            </DropdownMenuItem>
                                        </>
                                    )}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild className="text-red-600 dark:text-red-400 focus:text-red-700">
                                        <Link href="/logout" method="post" as="button" className="w-full text-left cursor-pointer flex items-center gap-1.5">
                                            <LogOut className="h-4 w-4" /> Sign Out
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Link href="/login" className="text-xs uppercase tracking-wider font-semibold border-b border-neutral-900 dark:border-stone-100 hover:text-amber-600 hover:border-amber-600 transition-colors pb-0.5">
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>

                {/* Mobile Navigation Drawer */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-stone-200/50 dark:border-neutral-900 bg-stone-50 dark:bg-neutral-950 px-4 py-4 space-y-3 font-medium uppercase text-sm tracking-wide shadow-inner">
                        <Link href="/shop" className="block py-2 hover:text-amber-600" onClick={() => setMobileMenuOpen(false)}>Shop All</Link>
                        <Link href="/shop?type=perfume" className="block py-2 hover:text-amber-600" onClick={() => setMobileMenuOpen(false)}>Fragrances</Link>
                        <Link href="/shop?type=makeup" className="block py-2 hover:text-amber-600" onClick={() => setMobileMenuOpen(false)}>Makeup</Link>
                        <Link href="/shop?type=skincare" className="block py-2 hover:text-amber-600" onClick={() => setMobileMenuOpen(false)}>Skincare</Link>
                        <Link href="/shop?type=jewelry" className="block py-2 hover:text-amber-600" onClick={() => setMobileMenuOpen(false)}>Jewelry</Link>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-grow">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-stone-900 dark:bg-black text-stone-300 py-16 border-t border-stone-800/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand Info */}
                    <div className="space-y-4">
                        <span className="font-serif text-xl font-bold tracking-widest text-stone-100 uppercase">LUXE PARFUM</span>
                        <p className="text-xs text-stone-400 font-serif leading-relaxed">
                            Discover the epitome of elegance. Direct access to luxury fragrances, makeup products, skincare serums, and fine jewelry from the world's most prestigious maisons.
                        </p>
                        <p className="text-[10px] text-stone-500 font-mono">
                            &copy; {new Date().getFullYear()} Luxe Parfum. All rights reserved.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-stone-100">Shop Catalog</h4>
                        <ul className="space-y-2 text-xs text-stone-400">
                            <li><Link href="/shop?type=perfume" className="hover:text-stone-100">Fragrance Collection</Link></li>
                            <li><Link href="/shop?type=makeup" className="hover:text-stone-100">Lipsticks & Cosmetics</Link></li>
                            <li><Link href="/shop?type=skincare" className="hover:text-stone-100">Serums & Skincare</Link></li>
                            <li><Link href="/shop?type=jewelry" className="hover:text-stone-100">Fine Jewelry</Link></li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-stone-100">Customer Support</h4>
                        <ul className="space-y-2 text-xs text-stone-400">
                            <li><Link href="/support" className="hover:text-stone-100">Contact Us</Link></li>
                            <li><Link href="/support/shipping" className="hover:text-stone-100">Shipping & Returns</Link></li>
                            <li><Link href="/support/faq" className="hover:text-stone-100">Frequently Asked Questions</Link></li>
                            <li><Link href="/support/privacy" className="hover:text-stone-100">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter Subscription */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-stone-100">Join the Club</h4>
                        <p className="text-xs text-stone-400 leading-relaxed font-serif">
                            Subscribe to receive notifications about private collection launches, exclusive events, and luxury promotions.
                        </p>
                        <form onSubmit={(e) => { e.preventDefault(); toast.success('Thank you for subscribing!'); }} className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Enter email address"
                                className="bg-stone-800 border border-stone-700 text-stone-100 text-xs px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500 w-full"
                                required
                            />
                            <Button type="submit" className="bg-amber-600 hover:bg-amber-700 text-stone-100 text-xs py-2 px-4 rounded-md">
                                Join
                            </Button>
                        </form>
                    </div>
                </div>
            </footer>
        </div>
    );
}
