import { BRAND_LOGO_ALT, BRAND_LOGO_PATH } from '@/lib/brand';
import { cn } from '@/lib/utils';

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
    ...props
}: AppLogoIconProps) {
    return (
        <img
            src={BRAND_LOGO_PATH}
            alt={alt ?? BRAND_LOGO_ALT}
            className={cn('h-auto w-auto object-contain', className)}
            {...props}
        />
    );
}
