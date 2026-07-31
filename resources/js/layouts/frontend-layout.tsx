import { usePage } from '@inertiajs/react';
import * as React from 'react';

import { FrontendFooter } from '@/layouts/partials/frontend/footer';
import { FrontendHeader } from '@/layouts/partials/frontend/header';
import { SharedData } from '@/types';

import { cn } from '../lib/utils';

import HeaderTop from './partials/frontend/header-top';

interface FrontendLayoutProps {
    children: React.ReactNode;
}

export default function FrontendLayout({ children }: FrontendLayoutProps) {
    const { headerData } = usePage<SharedData>().props;

    return (
        <div className={cn('flex', 'min-h-screen', 'flex-col')}>
            <HeaderTop />
            <FrontendHeader headers={headerData?.headers || []} />
            <main className={cn('flex-1', 'flex', 'flex-col')}>{children}</main>
            <FrontendFooter />
        </div>
    );
}
