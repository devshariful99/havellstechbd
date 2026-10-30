import { usePage } from '@inertiajs/react';

import { BRAND_LOGO_ALT, BRAND_LOGO_PATH } from '@/lib/brand';
import { cn } from '@/lib/utils';
import type { SharedData } from '@/types';

interface AppLogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    className?: string;
}

export default function AppLogo({ className, alt, src, ...props }: AppLogoProps) {
    const { contactDetails, name } = usePage<SharedData>().props;
    const logoSrc = src ?? contactDetails?.logo_url ?? BRAND_LOGO_PATH;
    const logoAlt = alt ?? contactDetails?.site_name ?? name ?? BRAND_LOGO_ALT;

    return (
        <img
            src={logoSrc}
            alt={logoAlt}
            className={cn(
                'h-auto w-auto max-w-[280px] object-contain',
                className,
            )}
            {...props}
        />
    );
}
