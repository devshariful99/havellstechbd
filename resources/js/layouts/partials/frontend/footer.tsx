import { usePage } from '@inertiajs/react';
import { Mail, Phone } from 'lucide-react';

import type { FooterLinkPublic, SharedData } from '@/types';

/**
 * Split a flat ordered list into N columns for the footer grid, filling
 * top-to-bottom within each column so the visual order matches sort_order.
 *
 * @template T
 */
function chunkIntoColumns<T>(items: T[], columnCount: number): T[][] {
    if (items.length === 0) {
        return [];
    }

    const columns: T[][] = Array.from({ length: columnCount }, () => []);
    const perColumn = Math.ceil(items.length / columnCount);

    items.forEach((item, index) => {
        columns[Math.min(Math.floor(index / perColumn), columnCount - 1)].push(
            item,
        );
    });

    return columns.filter((column) => column.length > 0);
}

export function FrontendFooter() {
    const { name, contactDetails, footerLinks = [] } =
        usePage<SharedData>().props;

    const phone = contactDetails?.phone;
    const email = contactDetails?.email;
    const columns = chunkIntoColumns(footerLinks as FooterLinkPublic[], 3);

    return (
        <footer className="bg-[#c3102e] text-white">
            {columns.length > 0 && (
                <div className="container mx-auto px-6 py-10">
                    <h2 className="mb-4 text-lg font-bold">Useful Links</h2>

                    <div className="grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
                        {columns.map((column, columnIndex) => (
                            <ul
                                key={columnIndex}
                                className="flex flex-col gap-2"
                                aria-label={
                                    columnIndex === 0
                                        ? 'Useful links'
                                        : undefined
                                }
                            >
                                {column.map((link) => (
                                    <li
                                        key={link.id}
                                        className="flex items-start gap-2"
                                    >
                                        <span
                                            aria-hidden="true"
                                            className="text-base font-medium select-none"
                                        >
                                            »
                                        </span>
                                        <a
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-base leading-snug font-medium underline-offset-4 transition-colors hover:underline focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                                        >
                                            {link.title}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        ))}
                    </div>
                </div>
            )}

            <div className="border-t border-white/25">
                <div className="container mx-auto flex flex-col items-center justify-between gap-3 px-6 py-5 text-sm md:flex-row">
                    <p>
                        © {new Date().getFullYear()} {name}. All rights
                        reserved.
                    </p>

                    <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-6">
                        {phone && (
                            <a
                                href={`tel:${phone.replace(/[^\d+]/g, '')}`}
                                className="flex items-center gap-2 underline-offset-4 hover:underline"
                            >
                                <Phone aria-hidden="true" className="size-4" />
                                {phone}
                            </a>
                        )}
                        {email && (
                            <a
                                href={`mailto:${email}`}
                                className="flex items-center gap-2 underline-offset-4 hover:underline"
                            >
                                <Mail aria-hidden="true" className="size-4" />
                                {email}
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </footer>
    );
}
