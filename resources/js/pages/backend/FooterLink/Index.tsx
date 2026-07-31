import { Head, Link, router } from '@inertiajs/react';
import { ExternalLink, Pencil, Trash2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { useDataTable } from '@/hooks/use-data-table';
import AdminLayout from '@/layouts/admin-layout';
import type { FooterLink } from '@/types';
import type {
    ActionConfig,
    ColumnConfig,
    PaginationData,
} from '@/types/data-table.types';

interface Props {
    footerLinks: FooterLink[];
    pagination: PaginationData;
    offset: number;
    filters: Record<string, string | number>;
    search: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
}

export default function FooterLinkIndex({
    footerLinks,
    pagination,
    offset,
    filters,
    search,
    sortBy,
    sortOrder,
}: Props) {
    const {
        isLoading,
        handleSearch,
        handleFilterChange,
        handleSort,
        handlePerPageChange,
        handlePageChange,
    } = useDataTable({
        only: [
            'footerLinks',
            'pagination',
            'offset',
            'filters',
            'search',
            'sortBy',
            'sortOrder',
        ],
    });

    const columns: ColumnConfig<FooterLink>[] = [
        {
            key: 'title',
            label: 'Title',
            sortable: true,
            render: (link) => (
                <div className="font-medium text-foreground">{link.title}</div>
            ),
        },
        {
            key: 'url',
            label: 'URL',
            sortable: true,
            render: (link) => (
                <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex max-w-xs items-center gap-1 truncate text-sm text-[#c3102e] hover:underline"
                    onClick={(event) => event.stopPropagation()}
                >
                    <span className="truncate">{link.url}</span>
                    <ExternalLink className="size-3.5 shrink-0" />
                </a>
            ),
        },
        {
            key: 'sort_order',
            label: 'Order',
            sortable: true,
            render: (link) => (
                <span className="text-muted-foreground">{link.sort_order}</span>
            ),
        },
        {
            key: 'is_active',
            label: 'Status',
            sortable: true,
            render: (link) =>
                link.is_active ? (
                    <Badge variant="secondary">Active</Badge>
                ) : (
                    <Badge variant="outline">Hidden</Badge>
                ),
        },
    ];

    const actions: ActionConfig<FooterLink>[] = [
        {
            label: 'Edit',
            icon: <Pencil className="h-4 w-4" />,
            onClick: (link) => {
                router.visit(route('admin.footer-link.edit', link.id));
            },
        },
        {
            label: 'Delete',
            icon: <Trash2 className="h-4 w-4" />,
            onClick: (link) => {
                if (
                    confirm(
                        `Are you sure you want to delete "${link.title}"?`,
                    )
                ) {
                    router.delete(route('admin.footer-link.destroy', link.id));
                }
            },
            variant: 'destructive',
        },
    ];

    return (
        <AdminLayout>
            <Head title="Footer Links" />

            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-semibold">Footer Links</h1>
                    <p className="text-sm text-muted-foreground">
                        Manage the Useful Links section in the public footer.
                        Each link opens in a new tab.
                    </p>
                </div>
                <Button asChild>
                    <Link href={route('admin.footer-link.create')}>
                        Add Footer Link
                    </Link>
                </Button>
            </div>

            <DataTable
                data={footerLinks}
                columns={columns}
                pagination={pagination}
                offset={offset}
                showNumbering={true}
                actions={actions}
                filters={[
                    {
                        key: 'is_active',
                        label: 'Status',
                        options: [
                            { label: 'Active', value: '1' },
                            { label: 'Hidden', value: '0' },
                        ],
                    },
                ]}
                onSearch={handleSearch}
                onFilterChange={handleFilterChange}
                onSort={handleSort}
                onPerPageChange={handlePerPageChange}
                onPageChange={handlePageChange}
                searchValue={search}
                filterValues={filters}
                sortBy={sortBy}
                sortOrder={sortOrder}
                isLoading={isLoading}
                emptyMessage="No footer links found"
                searchPlaceholder="Search by title or URL..."
            />
        </AdminLayout>
    );
}
