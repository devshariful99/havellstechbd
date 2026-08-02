import { usePage } from '@inertiajs/react';
import {
    Award,
    BarChart3,
    Cylinder,
    Image as ImageIcon,
    LayoutGrid,
    Link2,
    Mail,
    MapPin,
    Menu,
    Settings,
    Users,
} from 'lucide-react';
import * as React from 'react';

import { NavItem as NavItemComponent } from '@/components/ui/nav-item';
import { cn } from '@/lib/utils';
import { type NavItem, type SharedData } from '@/types';

const adminNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: route('admin.dashboard'),
        icon: LayoutGrid,
        slug: 'dashboard',
    },
    {
        title: 'Hero Management',
        href: route('admin.hero.index'),
        icon: ImageIcon,
        slug: 'hero',
    },
    {
        title: 'SubMenus',
        href: route('admin.submenu.index'),
        icon: Menu,
        slug: 'submenu',
    },
    {
        title: 'Product Management',
        href: route('admin.product.index'),
        icon: Cylinder,
        slug: 'product',
    },
    {
        title: 'Achievements',
        href: route('admin.achievement.index'),
        icon: BarChart3,
        slug: 'achievement',
    },
    {
        title: 'Our Partner Management',
        href: route('admin.our-partner.index'),
        icon: Users,
        slug: 'our-partner',
    },
    {
        title: 'Approved Management',
        href: route('admin.approved.index'),
        icon: Award,
        slug: 'approved',
    },
    {
        title: 'Contact Page',
        href: route('admin.contact-page.edit'),
        icon: MapPin,
        slug: 'contact-page',
    },
    {
        title: 'Contact Messages',
        href: route('admin.contact-message.index'),
        icon: Mail,
        slug: 'contact-message',
    },
    {
        title: 'Footer Links',
        href: route('admin.footer-link.index'),
        icon: Link2,
        slug: 'footer-link',
    },
    {
        title: 'Site Settings',
        href: route('admin.settings.edit'),
        icon: Settings,
        slug: 'settings',
    },
];

interface AdminSidebarProps {
    isCollapsed: boolean;
    activeSlug?: string | null;
}

export const AdminSidebar = React.memo<AdminSidebarProps>(
    ({ isCollapsed, activeSlug }) => {
        const { url, props } = usePage();
        const currentRoute = url;

        const userPermissions = React.useMemo(() => {
            const auth = props.auth as SharedData['auth'];

            return (
                auth?.user?.permissions ||
                auth?.user?.all_permissions ||
                auth?.permissions ||
                []
            );
        }, [props.auth]);

        return (
            <aside
                className={cn(
                    'relative hidden h-full border-r bg-background',
                    'transition-all duration-300 ease-in-out',
                    'md:flex flex-col',
                    isCollapsed ? 'w-16' : 'w-64',
                )}
            >
                <div className="custom-scrollbar flex-1 overflow-y-auto px-3 py-4">
                    <nav className="flex flex-col gap-1">
                        {adminNavItems.map((item, index) => (
                            <NavItemComponent
                                key={`${item.title}-${index}`}
                                item={item}
                                isCollapsed={isCollapsed}
                                currentRoute={currentRoute}
                                isActive={activeSlug === item.slug}
                                permissions={userPermissions}
                            />
                        ))}
                    </nav>
                </div>

                {!isCollapsed && (
                    <div className="border-t p-4">
                        <div className="text-center text-xs text-muted-foreground">
                            Admin Panel
                        </div>
                    </div>
                )}
            </aside>
        );
    },
);

AdminSidebar.displayName = 'AdminSidebar';
