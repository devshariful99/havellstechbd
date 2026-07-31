import { Head } from '@inertiajs/react';
import * as React from 'react';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    description: string;
}

export default function AuthLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="from-cream via-white to-sand relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br px-4">
            <main className="relative w-full max-w-md">
                <Head title={title} />

                <section className="animate-fadeInUp relative">
                    <div className="rounded-3xl border border-slate-200 bg-white/90 text-foreground shadow-(--shadow-card) backdrop-blur-sm">
                        <div className="flex flex-col gap-6 p-6 sm:p-8">
                            <header className="flex flex-col gap-1 text-center">
                                <h1 className="text-2xl font-semibold">
                                    {title}
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    {description}
                                </p>
                            </header>

                            {children}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
