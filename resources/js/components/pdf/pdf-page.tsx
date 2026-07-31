import { useCallback, useEffect, useRef, useState } from 'react';
import { Page } from 'react-pdf';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface PdfPageProps {
    pageNumber: number;
    scale: number;
    rotation: number;
    /** Unrotated, unscaled page size in CSS pixels, used to size placeholders. */
    baseWidth: number;
    baseHeight: number;
    searchTerm: string;
    isCurrent: boolean;
    scrollRoot: HTMLElement | null;
    onIntersect: (pageNumber: number, ratio: number) => void;
    registerRef: (pageNumber: number, element: HTMLDivElement | null) => void;
}

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export default function PdfPage({
    pageNumber,
    scale,
    rotation,
    baseWidth,
    baseHeight,
    searchTerm,
    isCurrent,
    scrollRoot,
    onIntersect,
    registerRef,
}: PdfPageProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [shouldRender, setShouldRender] = useState(pageNumber === 1);

    const isQuarterTurned = rotation % 180 !== 0;
    const placeholderWidth = (isQuarterTurned ? baseHeight : baseWidth) * scale;
    const placeholderHeight = (isQuarterTurned ? baseWidth : baseHeight) * scale;

    useEffect(() => {
        const element = containerRef.current;

        if (!element) {
            return;
        }

        registerRef(pageNumber, element);

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        setShouldRender(true);
                    }

                    onIntersect(pageNumber, entry.intersectionRatio);
                }
            },
            {
                root: scrollRoot,
                // Rasterise a screen ahead of time so scrolling stays smooth.
                rootMargin: '150% 0px',
                threshold: [0, 0.1, 0.5, 0.9],
            },
        );

        observer.observe(element);

        return () => {
            observer.disconnect();
            registerRef(pageNumber, null);
        };
    }, [pageNumber, scrollRoot, onIntersect, registerRef]);

    const customTextRenderer = useCallback(
        ({ str }: { str: string }) => {
            const safe = escapeHtml(str);

            if (!searchTerm) {
                return safe;
            }

            return safe.replace(
                new RegExp(`(${escapeRegExp(escapeHtml(searchTerm))})`, 'gi'),
                '<mark class="pdf-highlight">$1</mark>',
            );
        },
        [searchTerm],
    );

    return (
        <div
            ref={containerRef}
            data-pdf-page={pageNumber}
            className={cn(
                'relative mx-auto bg-white shadow-md ring-1 transition-shadow',
                isCurrent ? 'ring-primary/40' : 'ring-black/10 dark:ring-white/10',
            )}
            style={{ width: placeholderWidth, minHeight: placeholderHeight }}
        >
            {shouldRender ? (
                <Page
                    pageNumber={pageNumber}
                    scale={scale}
                    rotate={rotation}
                    customTextRenderer={customTextRenderer}
                    renderAnnotationLayer
                    renderTextLayer
                    loading={
                        <Skeleton
                            className="h-full w-full"
                            style={{ height: placeholderHeight }}
                        />
                    }
                />
            ) : (
                <Skeleton
                    className="h-full w-full"
                    style={{ height: placeholderHeight }}
                />
            )}

            <span className="pointer-events-none absolute right-2 bottom-2 rounded bg-black/60 px-1.5 py-0.5 text-xs font-medium text-white tabular-nums">
                {pageNumber}
            </span>
        </div>
    );
}
