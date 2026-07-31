import {
    ChevronLeft,
    ChevronRight,
    Download,
    ExternalLink,
    Maximize2,
    Minimize2,
    PanelLeft,
    Printer,
    RotateCw,
    Search,
    X,
    ZoomIn,
    ZoomOut,
} from 'lucide-react';
import { type ChangeEvent, type FormEvent, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface PdfToolbarProps {
    fileName: string;
    fileUrl: string;
    currentPage: number;
    pageCount: number;
    scale: number;
    isFitWidth: boolean;
    isFullscreen: boolean;
    showThumbnails: boolean;
    searchTerm: string;
    matchCount: number | null;
    onPageChange: (pageNumber: number) => void;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onToggleFitWidth: () => void;
    onRotate: () => void;
    onToggleThumbnails: () => void;
    onToggleFullscreen: () => void;
    onSearch: (term: string) => void;
    onClose?: () => void;
}

function ToolbarButton({
    label,
    onClick,
    disabled,
    pressed,
    children,
}: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
    pressed?: boolean;
    children: React.ReactNode;
}) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={onClick}
                    disabled={disabled}
                    aria-label={label}
                    aria-pressed={pressed}
                    className={cn(
                        'size-9 text-foreground/80 hover:text-foreground',
                        pressed && 'bg-accent text-accent-foreground',
                    )}
                >
                    {children}
                </Button>
            </TooltipTrigger>
            <TooltipContent>{label}</TooltipContent>
        </Tooltip>
    );
}

export default function PdfToolbar({
    fileName,
    fileUrl,
    currentPage,
    pageCount,
    scale,
    isFitWidth,
    isFullscreen,
    showThumbnails,
    searchTerm,
    matchCount,
    onPageChange,
    onZoomIn,
    onZoomOut,
    onToggleFitWidth,
    onRotate,
    onToggleThumbnails,
    onToggleFullscreen,
    onSearch,
    onClose,
}: PdfToolbarProps) {
    const [pageInput, setPageInput] = useState(String(currentPage));
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    useEffect(() => {
        setPageInput(String(currentPage));
    }, [currentPage]);

    const commitPage = (event: FormEvent) => {
        event.preventDefault();

        const requested = Number.parseInt(pageInput, 10);

        if (Number.isNaN(requested)) {
            setPageInput(String(currentPage));

            return;
        }

        onPageChange(Math.min(Math.max(requested, 1), pageCount));
    };

    const closeSearch = () => {
        setIsSearchOpen(false);
        onSearch('');
    };

    return (
        <div className="flex flex-col gap-2 border-b border-border bg-background/95 px-3 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/80">
            <div className="flex flex-wrap items-center gap-1">
                <ToolbarButton
                    label={showThumbnails ? 'Hide thumbnails' : 'Show thumbnails'}
                    onClick={onToggleThumbnails}
                    pressed={showThumbnails}
                >
                    <PanelLeft />
                </ToolbarButton>

                <Separator orientation="vertical" className="mx-1 h-6" />

                <ToolbarButton
                    label="Previous page"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                >
                    <ChevronLeft />
                </ToolbarButton>

                <form onSubmit={commitPage} className="flex items-center gap-1.5">
                    <label htmlFor="pdf-page-input" className="sr-only">
                        Page number
                    </label>
                    <Input
                        id="pdf-page-input"
                        value={pageInput}
                        onChange={(event: ChangeEvent<HTMLInputElement>) =>
                            setPageInput(event.target.value)
                        }
                        onBlur={commitPage}
                        inputMode="numeric"
                        className="h-9 w-14 px-2 text-center tabular-nums"
                    />
                    <span className="text-sm whitespace-nowrap text-muted-foreground tabular-nums">
                        / {pageCount || '–'}
                    </span>
                </form>

                <ToolbarButton
                    label="Next page"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= pageCount}
                >
                    <ChevronRight />
                </ToolbarButton>

                <Separator orientation="vertical" className="mx-1 h-6" />

                <ToolbarButton label="Zoom out" onClick={onZoomOut}>
                    <ZoomOut />
                </ToolbarButton>

                <button
                    type="button"
                    onClick={onToggleFitWidth}
                    aria-label={isFitWidth ? 'Use actual size' : 'Fit to width'}
                    className="min-w-14 rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground tabular-nums transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                    {isFitWidth ? 'Fit' : `${Math.round(scale * 100)}%`}
                </button>

                <ToolbarButton label="Zoom in" onClick={onZoomIn}>
                    <ZoomIn />
                </ToolbarButton>

                <ToolbarButton label="Rotate clockwise" onClick={onRotate}>
                    <RotateCw />
                </ToolbarButton>

                <Separator orientation="vertical" className="mx-1 h-6" />

                <ToolbarButton
                    label="Search in document"
                    onClick={() =>
                        isSearchOpen ? closeSearch() : setIsSearchOpen(true)
                    }
                    pressed={isSearchOpen}
                >
                    <Search />
                </ToolbarButton>

                <div className="ml-auto flex items-center gap-1">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                asChild
                                variant="ghost"
                                size="icon"
                                className="size-9 text-foreground/80"
                            >
                                <a
                                    href={fileUrl}
                                    download={fileName}
                                    aria-label="Download PDF"
                                >
                                    <Download />
                                </a>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Download</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                asChild
                                variant="ghost"
                                size="icon"
                                className="size-9 text-foreground/80"
                            >
                                <a
                                    href={fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Open PDF in a new tab"
                                >
                                    <ExternalLink />
                                </a>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Open in new tab</TooltipContent>
                    </Tooltip>

                    <ToolbarButton
                        label="Print"
                        onClick={() => window.open(fileUrl, '_blank')?.print()}
                    >
                        <Printer />
                    </ToolbarButton>

                    <ToolbarButton
                        label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                        onClick={onToggleFullscreen}
                        pressed={isFullscreen}
                    >
                        {isFullscreen ? <Minimize2 /> : <Maximize2 />}
                    </ToolbarButton>

                    {onClose ? (
                        <ToolbarButton label="Close reader" onClick={onClose}>
                            <X />
                        </ToolbarButton>
                    ) : null}
                </div>
            </div>

            {isSearchOpen ? (
                <div className="flex items-center gap-2 pb-1">
                    <label htmlFor="pdf-search-input" className="sr-only">
                        Search in document
                    </label>
                    <Input
                        id="pdf-search-input"
                        autoFocus
                        value={searchTerm}
                        onChange={(event: ChangeEvent<HTMLInputElement>) =>
                            onSearch(event.target.value)
                        }
                        onKeyDown={(event) => {
                            if (event.key === 'Escape') {
                                closeSearch();
                            }
                        }}
                        placeholder="Search in document…"
                        className="h-9 max-w-xs"
                    />
                    <span
                        aria-live="polite"
                        className="text-sm text-muted-foreground tabular-nums"
                    >
                        {searchTerm === ''
                            ? 'Type to highlight matches'
                            : matchCount === null
                              ? 'Searching…'
                              : `${matchCount} ${matchCount === 1 ? 'match' : 'matches'}`}
                    </span>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={closeSearch}
                        className="ml-auto"
                    >
                        Clear
                    </Button>
                </div>
            ) : null}
        </div>
    );
}
