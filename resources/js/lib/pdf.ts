import { pdfjs } from 'react-pdf';

// Recommended Vite worker setup — keeps the worker as a separate hashed asset.
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

/**
 * Shared loader options. `cMapPacked` is required for character maps; wasm and
 * standard fonts are needed for modern pdf.js builds.
 */
export const PDF_OPTIONS = {
    cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
    cMapPacked: true,
    standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
    wasmUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/wasm/`,
} as const;

export const ZOOM_LEVELS = [0.5, 0.67, 0.8, 1, 1.25, 1.5, 2, 3, 4] as const;

export const MIN_ZOOM = ZOOM_LEVELS[0];
export const MAX_ZOOM = ZOOM_LEVELS[ZOOM_LEVELS.length - 1];

/** Step to the next zoom level above the current scale. */
export function nextZoom(scale: number): number {
    return ZOOM_LEVELS.find((level) => level > scale + 0.001) ?? MAX_ZOOM;
}

/** Step to the next zoom level below the current scale. */
export function previousZoom(scale: number): number {
    return (
        [...ZOOM_LEVELS].reverse().find((level) => level < scale - 0.001) ??
        MIN_ZOOM
    );
}

/** Turn a stored path or absolute URL into something the reader can fetch. */
export function resolvePdfUrl(path: string): string {
    if (/^(https?:)?\/\//.test(path) || path.startsWith('blob:')) {
        return path;
    }

    return path.startsWith('/') ? path : `/storage/${path}`;
}

/** Derive a human-friendly file name from a path for downloads and titles. */
export function pdfFileName(path: string, fallback = 'document.pdf'): string {
    const name = path.split(/[\\/]/).pop();

    if (!name) {
        return fallback;
    }

    return name.toLowerCase().endsWith('.pdf') ? name : `${name}.pdf`;
}
