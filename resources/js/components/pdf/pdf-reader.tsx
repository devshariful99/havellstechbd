import { FileWarning, Loader2 } from 'lucide-react';
import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import {
    Document,
    type DocumentProps,
    type TextItem,
    type TextMarkedContent,
} from 'react-pdf';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import { Button } from '@/components/ui/button';
import {
    MIN_ZOOM,
    nextZoom,
    PDF_OPTIONS,
    pdfFileName,
    previousZoom,
    resolvePdfUrl,
} from '@/lib/pdf';
import { cn } from '@/lib/utils';

import PdfPage from './pdf-page';
import PdfThumbnails from './pdf-thumbnails';
import PdfToolbar from './pdf-toolbar';

interface PdfReaderProps {
    /** Stored path (`products/files/x.pdf`) or an absolute URL. */
    file: string;
    title?: string;
    className?: string;
    /** Rendered as a close control in the toolbar when provided. */
    onClose?: () => void;
}

interface PageSize {
    width: number;
    height: number;
}

/** pdf.js document handle, taken from react-pdf rather than importing pdfjs. */
type PdfDocument = Parameters<NonNullable<DocumentProps['onLoadSuccess']>>[0];

function isTextItem(item: TextItem | TextMarkedContent): item is TextItem {
    return 'str' in item;
}

const DEFAULT_PAGE_SIZE: PageSize = { width: 612, height: 792 };
const HORIZONTAL_PADDING = 48;

export default function PdfReader({
    file,
    title,
    className,
    onClose,
}: PdfReaderProps) {
    const fileUrl = useMemo(() => resolvePdfUrl(file), [file]);
    const fileName = useMemo(() => pdfFileName(file), [file]);

    const containerRef = useRef<HTMLDivElement | null>(null);
    // Held in state rather than a ref because child pages need it during render
    // to scope their intersection observers.
    const [scrollElement, setScrollElement] = useState<HTMLDivElement | null>(
        null,
    );
    const pageRefs = useRef(new Map<number, HTMLDivElement>());
    const visibilityRef = useRef(new Map<number, number>());
    const documentRef = useRef<PdfDocument | null>(null);

    const [pageCount, setPageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [baseSize, setBaseSize] = useState<PageSize>(DEFAULT_PAGE_SIZE);
    const [scale, setScale] = useState(1);
    const [isFitWidth, setIsFitWidth] = useState(true);
    const [availableWidth, setAvailableWidth] = useState(0);
    const [rotation, setRotation] = useState(0);
    const [showThumbnails, setShowThumbnails] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [matchCount, setMatchCount] = useState<number | null>(null);
    const [loadError, setLoadError] = useState<string | null>(null);

    const isQuarterTurned = rotation % 180 !== 0;

    const fitScale = useMemo(() => {
        if (availableWidth === 0) {
            return 1;
        }

        const base = isQuarterTurned ? baseSize.height : baseSize.width;

        return Math.max((availableWidth - HORIZONTAL_PADDING) / base, MIN_ZOOM);
    }, [availableWidth, baseSize, isQuarterTurned]);

    const effectiveScale = isFitWidth ? fitScale : scale;

    // Track the width available to a page so "fit width" stays accurate through
    // sidebar toggles, window resizes and entering fullscreen.
    useLayoutEffect(() => {
        if (!scrollElement) {
            return;
        }

        // ResizeObserver reports the current size on `observe`, so there is no
        // need to seed the width separately.
        const observer = new ResizeObserver(([entry]) => {
            setAvailableWidth(entry.contentRect.width);
        });

        observer.observe(scrollElement);

        return () => observer.disconnect();
    }, [scrollElement]);

    // Reset viewer state whenever the source document changes.
    useEffect(() => {
        documentRef.current = null;
        pageRefs.current.clear();
        visibilityRef.current.clear();
        setPageCount(0);
        setCurrentPage(1);
        setBaseSize(DEFAULT_PAGE_SIZE);
        setScale(1);
        setIsFitWidth(true);
        setRotation(0);
        setSearchTerm('');
        setMatchCount(null);
        setLoadError(null);
    }, [fileUrl]);

    useEffect(() => {
        const onFullscreenChange = () => {
            setIsFullscreen(
                document.fullscreenElement === containerRef.current,
            );
        };

        document.addEventListener('fullscreenchange', onFullscreenChange);

        return () =>
            document.removeEventListener('fullscreenchange', onFullscreenChange);
    }, []);

    const registerRef = useCallback(
        (pageNumber: number, element: HTMLDivElement | null) => {
            if (element) {
                pageRefs.current.set(pageNumber, element);
            } else {
                pageRefs.current.delete(pageNumber);
                visibilityRef.current.delete(pageNumber);
            }
        },
        [],
    );

    const handleIntersect = useCallback((pageNumber: number, ratio: number) => {
        visibilityRef.current.set(pageNumber, ratio);

        let best = pageNumber;
        let bestRatio = 0;

        for (const [page, value] of visibilityRef.current) {
            if (value > bestRatio) {
                best = page;
                bestRatio = value;
            }
        }

        if (bestRatio > 0) {
            setCurrentPage(best);
        }
    }, []);

    const goToPage = useCallback(
        (pageNumber: number) => {
            const target = Math.min(Math.max(pageNumber, 1), pageCount || 1);

            setCurrentPage(target);
            pageRefs.current.get(target)?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        },
        [pageCount],
    );

    const zoomIn = useCallback(() => {
        setScale((current) => nextZoom(isFitWidth ? fitScale : current));
        setIsFitWidth(false);
    }, [fitScale, isFitWidth]);

    const zoomOut = useCallback(() => {
        setScale((current) => previousZoom(isFitWidth ? fitScale : current));
        setIsFitWidth(false);
    }, [fitScale, isFitWidth]);

    const toggleFitWidth = useCallback(() => {
        setIsFitWidth((current) => {
            if (current) {
                setScale(1);
            }

            return !current;
        });
    }, []);

    const toggleFullscreen = useCallback(() => {
        if (document.fullscreenElement) {
            void document.exitFullscreen();

            return;
        }

        void containerRef.current?.requestFullscreen();
    }, []);

    const handleLoadSuccess = useCallback(
        async (pdf: PdfDocument) => {
            documentRef.current = pdf;
            setPageCount(pdf.numPages);
            setLoadError(null);

            try {
                const firstPage = await pdf.getPage(1);
                const viewport = firstPage.getViewport({ scale: 1 });

                setBaseSize({
                    width: viewport.width,
                    height: viewport.height,
                });
            } catch {
                setBaseSize(DEFAULT_PAGE_SIZE);
            }
        },
        [],
    );

    // Count matches across the whole document so the toolbar can report them.
    useEffect(() => {
        const pdf = documentRef.current;
        const term = searchTerm.trim().toLowerCase();

        if (!pdf || term === '') {
            return;
        }

        let cancelled = false;

        const timer = window.setTimeout(async () => {
            setMatchCount(null);

            let total = 0;

            for (let page = 1; page <= pdf.numPages; page++) {
                if (cancelled) {
                    return;
                }

                try {
                    const content = await (await pdf.getPage(page)).getTextContent();
                    const text = content.items
                        .map((item) => (isTextItem(item) ? item.str : ''))
                        .join(' ')
                        .toLowerCase();

                    total += text.split(term).length - 1;
                } catch {
                    // A page that fails to parse simply contributes no matches.
                }
            }

            if (!cancelled) {
                setMatchCount(total);
            }
        }, 300);

        return () => {
            cancelled = true;
            window.clearTimeout(timer);
        };
    }, [searchTerm, pageCount]);

    // Keyboard shortcuts, skipped while the user is typing in a field.
    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            const target = event.target as HTMLElement | null;

            if (
                target &&
                (target.tagName === 'INPUT' ||
                    target.tagName === 'TEXTAREA' ||
                    target.isContentEditable)
            ) {
                return;
            }

            if (!containerRef.current?.isConnected) {
                return;
            }

            switch (event.key) {
                case 'ArrowRight':
                case 'PageDown':
                    event.preventDefault();
                    goToPage(currentPage + 1);
                    break;
                case 'ArrowLeft':
                case 'PageUp':
                    event.preventDefault();
                    goToPage(currentPage - 1);
                    break;
                case 'Home':
                    event.preventDefault();
                    goToPage(1);
                    break;
                case 'End':
                    event.preventDefault();
                    goToPage(pageCount);
                    break;
                case '+':
                case '=':
                    event.preventDefault();
                    zoomIn();
                    break;
                case '-':
                    event.preventDefault();
                    zoomOut();
                    break;
                case '0':
                    event.preventDefault();
                    setIsFitWidth(true);
                    break;
                case 'f':
                    if (!event.ctrlKey && !event.metaKey) {
                        event.preventDefault();
                        toggleFullscreen();
                    }
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', onKeyDown);

        return () => window.removeEventListener('keydown', onKeyDown);
    }, [currentPage, pageCount, goToPage, zoomIn, zoomOut, toggleFullscreen]);

    // Pinch to zoom on touch devices.
    useEffect(() => {
        const element = scrollElement;

        if (!element) {
            return;
        }

        let startDistance = 0;
        let startScale = 1;

        const distanceBetween = (touches: TouchList) =>
            Math.hypot(
                touches[0].clientX - touches[1].clientX,
                touches[0].clientY - touches[1].clientY,
            );

        const onTouchStart = (event: TouchEvent) => {
            if (event.touches.length !== 2) {
                return;
            }

            startDistance = distanceBetween(event.touches);
            startScale = isFitWidth ? fitScale : scale;
        };

        const onTouchMove = (event: TouchEvent) => {
            if (event.touches.length !== 2 || startDistance === 0) {
                return;
            }

            event.preventDefault();

            const ratio = distanceBetween(event.touches) / startDistance;

            setIsFitWidth(false);
            setScale(Math.min(Math.max(startScale * ratio, MIN_ZOOM), 4));
        };

        const onTouchEnd = () => {
            startDistance = 0;
        };

        element.addEventListener('touchstart', onTouchStart, { passive: true });
        element.addEventListener('touchmove', onTouchMove, { passive: false });
        element.addEventListener('touchend', onTouchEnd);

        return () => {
            element.removeEventListener('touchstart', onTouchStart);
            element.removeEventListener('touchmove', onTouchMove);
            element.removeEventListener('touchend', onTouchEnd);
        };
    }, [scrollElement, fitScale, isFitWidth, scale]);

    const readingProgress =
        pageCount > 0 ? Math.round((currentPage / pageCount) * 100) : 0;

    const trimmedSearchTerm = searchTerm.trim();

    return (
        <div
            ref={containerRef}
            className={cn(
                'flex flex-col overflow-hidden rounded-lg border border-border bg-background',
                isFullscreen && 'h-screen rounded-none border-0',
                className,
            )}
        >
            <PdfToolbar
                fileName={title ? `${title}.pdf` : fileName}
                fileUrl={fileUrl}
                currentPage={currentPage}
                pageCount={pageCount}
                scale={effectiveScale}
                isFitWidth={isFitWidth}
                isFullscreen={isFullscreen}
                showThumbnails={showThumbnails}
                searchTerm={searchTerm}
                matchCount={trimmedSearchTerm === '' ? null : matchCount}
                onPageChange={goToPage}
                onZoomIn={zoomIn}
                onZoomOut={zoomOut}
                onToggleFitWidth={toggleFitWidth}
                onRotate={() => setRotation((current) => (current + 90) % 360)}
                onToggleThumbnails={() => setShowThumbnails((current) => !current)}
                onToggleFullscreen={toggleFullscreen}
                onSearch={setSearchTerm}
                onClose={onClose}
            />

            <div
                role="progressbar"
                aria-label="Reading progress"
                aria-valuenow={readingProgress}
                aria-valuemin={0}
                aria-valuemax={100}
                className="h-0.5 w-full bg-muted"
            >
                <div
                    className="h-full bg-primary transition-[width] duration-200"
                    style={{ width: `${readingProgress}%` }}
                />
            </div>

            <Document
                key={fileUrl}
                file={fileUrl}
                options={PDF_OPTIONS}
                onLoadSuccess={handleLoadSuccess}
                onLoadError={(error: Error) => setLoadError(error.message)}
                loading={
                    <div className="flex min-h-96 flex-1 flex-col items-center justify-center gap-3 text-muted-foreground">
                        <Loader2 className="size-6 animate-spin" />
                        <p className="text-sm">Loading document…</p>
                    </div>
                }
                error={
                    <div className="flex min-h-96 flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
                        <FileWarning className="size-8 text-destructive" />
                        <div>
                            <p className="font-medium">
                                This PDF could not be displayed
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {loadError ??
                                    'The file may be missing or corrupted.'}
                            </p>
                        </div>
                        <Button asChild variant="outline" size="sm">
                            <a href={fileUrl} download={fileName}>
                                Download instead
                            </a>
                        </Button>
                    </div>
                }
                className="flex min-h-0 flex-1"
            >
                {showThumbnails && pageCount > 0 ? (
                    <PdfThumbnails
                        pageCount={pageCount}
                        currentPage={currentPage}
                        onSelect={goToPage}
                    />
                ) : null}

                <div
                    ref={setScrollElement}
                    className="flex-1 overflow-auto overscroll-contain bg-muted/40 p-6 dark:bg-muted/20"
                >
                    <div className="flex flex-col items-center gap-6">
                        {Array.from({ length: pageCount }, (_, index) => (
                            <PdfPage
                                key={index + 1}
                                pageNumber={index + 1}
                                scale={effectiveScale}
                                rotation={rotation}
                                baseWidth={baseSize.width}
                                baseHeight={baseSize.height}
                                searchTerm={trimmedSearchTerm}
                                isCurrent={currentPage === index + 1}
                                scrollRoot={scrollElement}
                                onIntersect={handleIntersect}
                                registerRef={registerRef}
                            />
                        ))}
                    </div>
                </div>
            </Document>
        </div>
    );
}
