import { Link, usePage } from '@inertiajs/react';

import type { SharedData } from '@/types';

export function UserFooter() {
    const { name } = usePage<SharedData>().props;

    return (
        <footer className="mt-auto border-t border-border/40 bg-muted/70 py-6">
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
                    <div className="text-center text-sm text-muted-foreground md:text-left">
                        © {new Date().getFullYear()} {name}. All rights
                        reserved.
                    </div>

                    <Link
                        href={route('contact')}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                        Contact
                    </Link>
                </div>
            </div>
        </footer>
    );
}
