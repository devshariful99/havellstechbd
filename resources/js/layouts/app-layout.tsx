import { type ReactNode } from 'react';

import { Toaster } from '@/components/ui/sonner';
import { type BreadcrumbItem } from '@/types';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default function AppLayout({ children }: AppLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
                {children}
            </main>
            <Toaster position="top-right" richColors />
        </div>
    );
}
