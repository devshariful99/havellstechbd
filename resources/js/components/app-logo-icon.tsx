import { usePage } from '@inertiajs/react';

import { BRAND_LOGO_ALT, BRAND_LOGO_PATH } from '@/lib/brand';
import { cn } from '@/lib/utils';
import type { SharedData } from '@/types';

interface AppLogoIconProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    className?: string;
}

/**
 * Compact brand mark used in auth shells and tight header slots.
 * Same asset as AppLogo so branding stays consistent site-wide.
 */
export default function AppLogoIcon({
    className,
    alt,
    src,
    ...props
}: AppLogoIconProps) {
    const { contactDetails, name } = usePage<SharedData>().props;
    const logoSrc = src ?? contactDetails?.logo_url ?? BRAND_LOGO_PATH;
    const logoAlt = alt ?? contactDetails?.site_name ?? name ?? BRAND_LOGO_ALT;

    return (
        <img
            src={logoSrc}
            alt={logoAlt}
            className={cn('h-auto w-auto object-contain', className)}
            {...props}
        />
    );
}
