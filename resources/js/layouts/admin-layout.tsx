import { usePage } from '@inertiajs/react';
import * as React from 'react';

import { AdminHeader } from '@/layouts/partials/admin/header';
import { AdminSidebar } from '@/layouts/partials/admin/sidebar';

import { AdminFooter } from './partials/admin/footer';

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const { url } = usePage();
    
    // Calculate active slug based on current URL
    const getActiveSlug = (url: string): string | null => {
        // Remove any query parameters and hash
        const cleanUrl = url.split('?')[0].split('#')[0];
        
        // Check specific routes first (they have unique segments)
        if (cleanUrl.includes('/dashboard')) return 'dashboard';
        if (cleanUrl.includes('/settings')) return 'settings';
        if (cleanUrl.includes('/footer-links')) return 'footer-link';
        if (cleanUrl.includes('/contact-messages')) return 'contact-message';
        if (cleanUrl.includes('/contact-page')) return 'contact-page';
        if (cleanUrl.includes('/hero')) return 'hero';
        if (cleanUrl.includes('/product')) return 'product';
        if (cleanUrl.includes('/our-partner')) return 'our-partner';
        if (cleanUrl.includes('/approved')) return 'approved';
        
        // SubMenu routes are at /admin root - if it's /admin but not other specific routes
        if (cleanUrl.startsWith('/admin') && 
            !cleanUrl.includes('/dashboard') && 
            !cleanUrl.includes('/settings') &&
            !cleanUrl.includes('/footer-links') &&
            !cleanUrl.includes('/contact-messages') &&
            !cleanUrl.includes('/contact-page') &&
            !cleanUrl.includes('/hero') && 
            !cleanUrl.includes('/product') && 
            !cleanUrl.includes('/our-partner') && 
            !cleanUrl.includes('/approved')) {
            return 'submenu';
        }
        
        return null;
    };

    const activeSlug = getActiveSlug(url);

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-vendor-body-bg">

            <AdminHeader />

            <div className="flex flex-1 overflow-hidden">

                <AdminSidebar isCollapsed={false} activeSlug={activeSlug} />
                <main className="flex-1 overflow-y-auto p-4">
                    {children}
                </main>

            </div>

            <AdminFooter />

        </div>
    );
}
