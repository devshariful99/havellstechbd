import { Loader2 } from 'lucide-react';
import { type ComponentProps, lazy, Suspense } from 'react';

import { cn } from '@/lib/utils';

// pdf.js is a large dependency, so it is only fetched once a reader is actually
// mounted rather than on every page load.
const PdfReader = lazy(() => import('./pdf-reader'));

type PdfReaderLazyProps = ComponentProps<typeof PdfReader>;

export default function PdfReaderLazy({
    className,
    ...props
}: PdfReaderLazyProps) {
    return (
        <Suspense
            fallback={
                <div
                    className={cn(
                        'flex min-h-96 w-full flex-col items-center justify-center gap-3 rounded-lg border border-border bg-muted/40 text-muted-foreground',
                        className,
                    )}
                >
                    <Loader2 className="size-6 animate-spin" />
                    <p className="text-sm">Preparing viewer…</p>
                </div>
            }
        >
            <PdfReader className={className} {...props} />
        </Suspense>
    );
}
