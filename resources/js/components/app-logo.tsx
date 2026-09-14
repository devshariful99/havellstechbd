import { BRAND_LOGO_ALT, BRAND_LOGO_PATH } from '@/lib/brand';
import { cn } from '@/lib/utils';

interface AppLogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    className?: string;
}

export default function AppLogo({ className, alt, ...props }: AppLogoProps) {
    return (
        <img
            src={BRAND_LOGO_PATH}
            alt={alt ?? BRAND_LOGO_ALT}
            className={cn('h-auto w-auto max-w-[280px] object-contain', className)}
            {...props}
        />
    );
}
