import { Link } from '@inertiajs/react';
import { LayoutGrid, Package, Folder, Award, ShoppingCart, Home, Settings } from 'lucide-react';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';

// Admin main navigation
const adminNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Products',
        href: '/admin/products',
        icon: Package,
    },
    {
        title: 'Categories',
        href: '/admin/categories',
        icon: Folder,
    },
    {
        title: 'Brands',
        href: '/admin/brands',
        icon: Award,
    },
    {
        title: 'Orders',
        href: '/admin/orders',
        icon: ShoppingCart,
    },
    {
        title: 'Store Settings',
        href: '/admin/settings',
        icon: Settings,
    },
];

const secondaryNavItems: NavItem[] = [
    {
        title: 'View Storefront',
        href: '/',
        icon: Home,
    },
];

export function AdminSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/admin/dashboard" prefetch>
                                <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-amber-600 text-white font-serif font-semibold">
                                    L
                                </div>
                                <div className="ml-1 grid flex-1 text-left text-sm">
                                    <span className="mb-0.5 truncate leading-tight font-serif font-bold tracking-wider text-amber-600 dark:text-amber-400">
                                        LUXE ADMIN
                                    </span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={adminNavItems} />
                <div className="mt-auto px-2 py-4">
                    <NavMain items={secondaryNavItems} />
                </div>
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
