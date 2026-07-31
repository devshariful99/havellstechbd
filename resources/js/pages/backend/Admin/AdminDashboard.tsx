import { Head, Link } from '@inertiajs/react';
import {
    ArrowUpRight,
    Award,
    Cylinder,
    Image as ImageIcon,
    Mail,
    Menu,
    Settings,
    Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { cn } from '@/lib/utils';

interface DashboardStats {
    heroes: number;
    products: number;
    partners: number;
    approved: number;
    subMenus: number;
    contacts: number;
}

interface RecentContact {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    message: string;
    created_at: string;
}

interface RecentProduct {
    id: number;
    title: string;
    image: string | null;
    created_at: string;
}

interface Props {
    stats: DashboardStats;
    recentContacts: RecentContact[];
    recentProducts: RecentProduct[];
    admin: {
        name: string | null;
        email: string | null;
    };
}

interface StatCard {
    key: keyof DashboardStats;
    label: string;
    description: string;
    href: string;
    icon: LucideIcon;
    accent: string;
}

const STAT_CARDS: StatCard[] = [
    {
        key: 'heroes',
        label: 'Hero slides',
        description: 'Homepage carousel images',
        href: 'admin.hero.index',
        icon: ImageIcon,
        accent: 'bg-rose-500/10 text-rose-700 dark:text-rose-300',
    },
    {
        key: 'products',
        label: 'Products',
        description: 'Catalog items with PDFs',
        href: 'admin.product.index',
        icon: Cylinder,
        accent: 'bg-sky-500/10 text-sky-700 dark:text-sky-300',
    },
    {
        key: 'partners',
        label: 'Brand partners',
        description: 'Partner logos on the home page',
        href: 'admin.our-partner.index',
        icon: Users,
        accent: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    },
    {
        key: 'approved',
        label: 'Certificates',
        description: 'Approvals and standards',
        href: 'admin.approved.index',
        icon: Award,
        accent: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
    },
    {
        key: 'subMenus',
        label: 'Sub menus',
        description: 'Navigation PDF documents',
        href: 'admin.submenu.index',
        icon: Menu,
        accent: 'bg-violet-500/10 text-violet-700 dark:text-violet-300',
    },
    {
        key: 'contacts',
        label: 'Messages',
        description: 'Contact form submissions',
        href: 'admin.dashboard',
        icon: Mail,
        accent: 'bg-slate-500/10 text-slate-700 dark:text-slate-300',
    },
];

const QUICK_ACTIONS = [
    {
        title: 'Add product',
        description: 'Upload a new catalog item',
        href: 'admin.product.create',
    },
    {
        title: 'Add hero slide',
        description: 'Refresh the homepage banner',
        href: 'admin.hero.create',
    },
    {
        title: 'Add partner',
        description: 'Publish a brand logo',
        href: 'admin.our-partner.create',
    },
    {
        title: 'Site settings',
        description: 'Phone, email, and social links',
        href: 'admin.settings.edit',
    },
];

function formatDate(value: string): string {
    return new Date(value).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

function truncate(value: string, length = 90): string {
    if (value.length <= length) {
        return value;
    }

    return `${value.slice(0, length).trimEnd()}…`;
}

export default function AdminDashboard({
    stats,
    recentContacts,
    recentProducts,
    admin,
}: Props) {
    const greeting = (() => {
        const hour = new Date().getHours();

        if (hour < 12) {
            return 'Good morning';
        }

        if (hour < 18) {
            return 'Good afternoon';
        }

        return 'Good evening';
    })();

    const totalContent =
        stats.heroes +
        stats.products +
        stats.partners +
        stats.approved +
        stats.subMenus;

    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />

            <div className="flex flex-col gap-8">
                <section className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-[#170000] via-[#3a0a12] to-[#c3102e] px-6 py-8 text-white shadow-sm sm:px-8">
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -top-16 -right-10 size-56 rounded-full bg-white/10 blur-2xl"
                    />
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -bottom-20 left-10 size-48 rounded-full bg-black/20 blur-2xl"
                    />

                    <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-2xl">
                            <p className="text-sm font-medium tracking-wide text-white/70">
                                {greeting}
                                {admin.name ? `, ${admin.name}` : ''}
                            </p>
                            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                                Admin dashboard
                            </h1>
                            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
                                Manage homepage content, catalogs, certificates,
                                and public contact details from one place.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
                                <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                                    Content items
                                </p>
                                <p className="mt-1 text-2xl font-semibold">
                                    {totalContent}
                                </p>
                            </div>
                            <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
                                <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                                    New messages
                                </p>
                                <p className="mt-1 text-2xl font-semibold">
                                    {stats.contacts}
                                </p>
                            </div>
                            <Button
                                asChild
                                variant="secondary"
                                className="h-auto self-stretch bg-white text-[#170000] hover:bg-white/90"
                            >
                                <Link href={route('admin.settings.edit')}>
                                    <Settings className="size-4" />
                                    Site settings
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>

                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {STAT_CARDS.map((card) => {
                        const Icon = card.icon;

                        return (
                            <Link
                                key={card.key}
                                href={route(card.href)}
                                className="group"
                            >
                                <Card className="h-full transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-[#c3102e]/40 group-hover:shadow-md">
                                    <CardContent className="flex items-start justify-between gap-4 p-5">
                                        <div>
                                            <p className="text-sm text-muted-foreground">
                                                {card.label}
                                            </p>
                                            <p className="mt-2 text-3xl font-semibold tracking-tight">
                                                {stats[card.key]}
                                            </p>
                                            <p className="mt-2 text-xs text-muted-foreground">
                                                {card.description}
                                            </p>
                                        </div>
                                        <div
                                            className={cn(
                                                'rounded-xl p-3',
                                                card.accent,
                                            )}
                                        >
                                            <Icon className="size-5" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })}
                </section>

                <section className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
                    <Card>
                        <CardHeader className="flex flex-row items-start justify-between gap-4">
                            <div>
                                <CardTitle>Recent contact messages</CardTitle>
                                <CardDescription>
                                    Latest submissions from the public contact
                                    form.
                                </CardDescription>
                            </div>
                            <Badge variant="secondary">
                                {stats.contacts} total
                            </Badge>
                        </CardHeader>
                        <CardContent>
                            {recentContacts.length === 0 ? (
                                <div className="rounded-xl border border-dashed px-4 py-10 text-center text-sm text-muted-foreground">
                                    No messages yet. New contact form submissions
                                    will appear here.
                                </div>
                            ) : (
                                <ul className="flex flex-col gap-3">
                                    {recentContacts.map((contact) => (
                                        <li
                                            key={contact.id}
                                            className="rounded-xl border bg-muted/30 px-4 py-3"
                                        >
                                            <div className="flex flex-wrap items-start justify-between gap-2">
                                                <div>
                                                    <p className="font-medium">
                                                        {contact.name}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {contact.email}
                                                        {contact.phone
                                                            ? ` · ${contact.phone}`
                                                            : ''}
                                                    </p>
                                                </div>
                                                <span className="text-xs text-muted-foreground">
                                                    {formatDate(
                                                        contact.created_at,
                                                    )}
                                                </span>
                                            </div>
                                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                                {truncate(contact.message)}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CardContent>
                    </Card>

                    <div className="flex flex-col gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick actions</CardTitle>
                                <CardDescription>
                                    Jump straight into common admin tasks.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-2">
                                {QUICK_ACTIONS.map((action) => (
                                    <Link
                                        key={action.href}
                                        href={route(action.href)}
                                        className="flex items-center justify-between gap-3 rounded-xl border px-4 py-3 transition-colors hover:border-[#c3102e]/40 hover:bg-muted/40"
                                    >
                                        <div>
                                            <p className="font-medium">
                                                {action.title}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {action.description}
                                            </p>
                                        </div>
                                        <ArrowUpRight className="size-4 text-muted-foreground" />
                                    </Link>
                                ))}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-start justify-between gap-4">
                                <div>
                                    <CardTitle>Latest products</CardTitle>
                                    <CardDescription>
                                        Recently added catalog entries.
                                    </CardDescription>
                                </div>
                                <Button asChild variant="outline" size="sm">
                                    <Link href={route('admin.product.index')}>
                                        View all
                                    </Link>
                                </Button>
                            </CardHeader>
                            <CardContent>
                                {recentProducts.length === 0 ? (
                                    <div className="rounded-xl border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
                                        No products yet.
                                    </div>
                                ) : (
                                    <ul className="flex flex-col gap-3">
                                        {recentProducts.map((product) => (
                                            <li key={product.id}>
                                                <Link
                                                    href={route(
                                                        'admin.product.view',
                                                        product.id,
                                                    )}
                                                    className="flex items-center gap-3 rounded-xl border px-3 py-2 transition-colors hover:border-[#c3102e]/40 hover:bg-muted/40"
                                                >
                                                    <div className="size-12 overflow-hidden rounded-lg bg-muted">
                                                        {product.image ? (
                                                            <img
                                                                src={`/storage/${product.image}`}
                                                                alt={
                                                                    product.title
                                                                }
                                                                className="size-full object-cover"
                                                                loading="lazy"
                                                            />
                                                        ) : (
                                                            <div className="flex size-full items-center justify-center text-muted-foreground">
                                                                <Cylinder className="size-4" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate font-medium">
                                                            {product.title}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {formatDate(
                                                                product.created_at,
                                                            )}
                                                        </p>
                                                    </div>
                                                    <ArrowUpRight className="size-4 shrink-0 text-muted-foreground" />
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </section>
            </div>
        </AdminLayout>
    );
}
