import { Page } from 'react-pdf';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface PdfThumbnailsProps {
    pageCount: number;
    currentPage: number;
    onSelect: (pageNumber: number) => void;
}

const THUMBNAIL_WIDTH = 104;

export default function PdfThumbnails({
    pageCount,
    currentPage,
    onSelect,
}: PdfThumbnailsProps) {
    return (
        <aside
            aria-label="Page thumbnails"
            className="hidden w-40 shrink-0 border-r border-border bg-muted/30 md:block"
        >
            <ScrollArea className="h-full">
                <ul className="flex flex-col gap-2 p-3">
                    {Array.from({ length: pageCount }, (_, index) => {
                        const pageNumber = index + 1;
                        const isCurrent = pageNumber === currentPage;

                        return (
                            <li key={pageNumber}>
                                <button
                                    type="button"
                                    onClick={() => onSelect(pageNumber)}
                                    aria-current={isCurrent ? 'true' : undefined}
                                    aria-label={`Go to page ${pageNumber}`}
                                    className={cn(
                                        'group flex w-full flex-col items-center gap-1 rounded-md p-1.5 transition-colors',
                                        'focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none',
                                        isCurrent
                                            ? 'bg-primary/10 ring-2 ring-primary'
                                            : 'hover:bg-accent',
                                    )}
                                >
                                    <span className="overflow-hidden rounded bg-white shadow-sm">
                                        <Page
                                            pageNumber={pageNumber}
                                            width={THUMBNAIL_WIDTH}
                                            renderAnnotationLayer={false}
                                            renderTextLayer={false}
                                            loading={
                                                <Skeleton
                                                    className="w-full"
                                                    style={{
                                                        width: THUMBNAIL_WIDTH,
                                                        height: THUMBNAIL_WIDTH * 1.4,
                                                    }}
                                                />
                                            }
                                        />
                                    </span>
                                    <span
                                        className={cn(
                                            'text-xs tabular-nums',
                                            isCurrent
                                                ? 'font-semibold text-primary'
                                                : 'text-muted-foreground',
                                        )}
                                    >
                                        {pageNumber}
                                    </span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </ScrollArea>
        </aside>
    );
}
