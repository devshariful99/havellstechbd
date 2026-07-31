import { Link } from '@inertiajs/react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import AppLogo from '@/components/app-logo';

interface SubMenuItem {
    id: number;
    name: string;
    file: string | null;
}

interface HeaderItem {
    id: number;
    title: string;
    slug: string;
    sub_menus: SubMenuItem[];
}

interface DropdownMenuProps {
    label: string;
    items: SubMenuItem[];
}

function DropdownMenu({ label, items }: DropdownMenuProps) {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(
        () => () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        },
        [],
    );

    const handleMouseEnter = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        setOpen(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => setOpen(false), 150);
    };

    const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
        if (!containerRef.current?.contains(event.relatedTarget as Node | null)) {
            setOpen(false);
        }
    };

    return (
        <div
            ref={containerRef}
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onBlur={handleBlur}
            onKeyDown={(event) => {
                if (event.key === 'Escape') {
                    setOpen(false);
                }
            }}
        >
            <button
                type="button"
                aria-expanded={open}
                aria-haspopup="true"
                onClick={() => setOpen((current) => !current)}
                className="flex items-center gap-1 rounded text-sm font-bold text-[#101828] transition-colors hover:text-gray-900 focus-visible:ring-2 focus-visible:ring-[#c3102e] focus-visible:ring-offset-2 focus-visible:outline-none"
            >
                {label}
                <ChevronDown
                    aria-hidden="true"
                    className={`h-3 w-3 transition-transform duration-200 ${
                        open ? 'rotate-180' : ''
                    }`}
                />
            </button>

            <div
                aria-hidden={!open}
                className={`absolute top-full left-0 z-50 mt-2 w-52 rounded-md border border-gray-200 bg-white shadow-lg transition-all duration-200 ${
                    open
                        ? 'pointer-events-auto translate-y-0 opacity-100'
                        : 'pointer-events-none -translate-y-1 opacity-0'
                }`}
            >
                <div className="absolute -top-1.5 left-4 h-3 w-3 rotate-45 border-t border-l border-gray-200 bg-white" />

                <ul className="py-1">
                    {items.map((item) => (
                        <li key={item.id}>
                            {item.file ? (
                                <Link
                                    href={route('documents.submenu', item.id)}
                                    tabIndex={open ? 0 : -1}
                                    onClick={() => setOpen(false)}
                                    className="block w-full px-4 py-2.5 text-left text-sm text-[#101828] transition-colors hover:bg-gray-50 hover:text-gray-900 focus-visible:bg-gray-50 focus-visible:outline-none"
                                >
                                    {item.name}
                                </Link>
                            ) : (
                                <span className="block px-4 py-2.5 text-sm text-gray-400">
                                    {item.name}
                                </span>
                            )}
                        </li>
                    ))}

                    {items.length === 0 && (
                        <li className="px-4 py-2.5 text-sm text-gray-400">
                            No items yet
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
}

interface FrontendHeaderProps {
    headers?: HeaderItem[];
}

export function FrontendHeader({ headers = [] }: FrontendHeaderProps) {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (!mobileMenuOpen) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setMobileMenuOpen(false);
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [mobileMenuOpen]);

    const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);

    return (
        <>
            <header
                className={`border-b border-gray-200 transition-all duration-300 ${
                    scrolled ? 'sticky top-0 z-50 bg-white md:bg-white/90' : 'bg-white'
                }`}
            >
                <nav className="container mx-auto flex items-center justify-between px-4 py-3">
                    <Link href="/" className="flex items-center gap-2">
                        <AppLogo className="h-16 w-auto" />
                    </Link>

                    <div className="hidden items-center gap-6 md:flex">
                        <Link
                            href="/"
                            className="text-sm font-bold text-[#170000] transition-colors duration-200 hover:text-gray-900"
                        >
                            HOME
                        </Link>

                        {headers.map((header) => (
                            <DropdownMenu
                                key={header.id}
                                label={header.title.toUpperCase()}
                                items={header.sub_menus}
                            />
                        ))}

                        <Link
                            href={route('contact')}
                            className="text-sm font-bold text-[#101828] transition-colors duration-200 hover:text-gray-900"
                        >
                            CONTACT US
                        </Link>
                    </div>

                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen((current) => !current)}
                        className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#c3102e] text-white transition-colors duration-200 hover:bg-[#a00d26] md:hidden"
                        aria-expanded={mobileMenuOpen}
                        aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                    >
                        {mobileMenuOpen ? (
                            <X className="h-5 w-5" />
                        ) : (
                            <Menu className="h-5 w-5" />
                        )}
                    </button>
                </nav>
            </header>

            <div
                aria-hidden="true"
                className={`fixed inset-0 z-40 transition-all duration-300 md:hidden ${
                    mobileMenuOpen
                        ? 'pointer-events-auto bg-black/50 opacity-100'
                        : 'pointer-events-none opacity-0'
                }`}
                onClick={closeMobileMenu}
            />

            <div
                role="dialog"
                aria-modal="true"
                aria-label="Site menu"
                aria-hidden={!mobileMenuOpen}
                className={`fixed top-0 right-0 z-50 h-full w-80 max-w-[85vw] bg-white shadow-xl transition-all duration-300 md:hidden ${
                    mobileMenuOpen
                        ? 'translate-x-0 opacity-100'
                        : 'pointer-events-none translate-x-full opacity-0'
                }`}
            >
                <div className="flex h-full flex-col">
                    <div className="flex items-center justify-between border-b border-gray-200 p-4">
                        <span className="text-lg font-bold text-[#170000]">
                            Menu
                        </span>
                        <button
                            type="button"
                            onClick={closeMobileMenu}
                            tabIndex={mobileMenuOpen ? 0 : -1}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-colors duration-200 hover:bg-gray-200"
                            aria-label="Close menu"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4">
                        <div className="flex flex-col gap-4">
                            <Link
                                href="/"
                                tabIndex={mobileMenuOpen ? 0 : -1}
                                className="block rounded-lg px-4 py-3 text-base font-medium text-[#170000] transition-colors duration-200 hover:bg-[#c3102e]/10 hover:text-[#c3102e]"
                                onClick={closeMobileMenu}
                            >
                                HOME
                            </Link>

                            <div className="flex flex-col gap-2">
                                {headers.map((header) => (
                                    <div key={header.id} className="px-4 py-2">
                                        <h3 className="mb-2 text-sm font-bold text-[#c3102e]">
                                            {header.title.toUpperCase()}
                                        </h3>
                                        <div className="flex flex-col gap-1">
                                            {header.sub_menus.map((subMenu) =>
                                                subMenu.file ? (
                                                    <Link
                                                        key={subMenu.id}
                                                        href={route(
                                                            'documents.submenu',
                                                            subMenu.id,
                                                        )}
                                                        tabIndex={
                                                            mobileMenuOpen
                                                                ? 0
                                                                : -1
                                                        }
                                                        onClick={closeMobileMenu}
                                                        className="block w-full rounded-md px-3 py-2 text-left text-sm text-[#170000] transition-colors duration-200 hover:bg-[#c3102e]/10 hover:text-[#c3102e]"
                                                    >
                                                        {subMenu.name}
                                                    </Link>
                                                ) : (
                                                    <span
                                                        key={subMenu.id}
                                                        className="block px-3 py-2 text-sm text-gray-400"
                                                    >
                                                        {subMenu.name}
                                                    </span>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Link
                                href={route('contact')}
                                tabIndex={mobileMenuOpen ? 0 : -1}
                                className="block rounded-lg bg-[#c3102e] px-4 py-3 text-center text-base font-medium text-white transition-colors duration-200 hover:bg-[#a00d26]"
                                onClick={closeMobileMenu}
                            >
                                CONTACT US
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
