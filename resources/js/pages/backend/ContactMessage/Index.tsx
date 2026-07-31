import { Head, Link, router } from '@inertiajs/react';
import { Eye, MailOpen, Mail, Trash2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/data-table';
import { useDataTable } from '@/hooks/use-data-table';
import AdminLayout from '@/layouts/admin-layout';
import type { ContactMessage } from '@/types';
import type {
    ActionConfig,
    ColumnConfig,
    PaginationData,
} from '@/types/data-table.types';

interface Props {
    messages: ContactMessage[];
    pagination: PaginationData;
    offset: number;
    filters: Record<string, string | number>;
    search: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
}

export default function ContactMessageIndex({
    messages,
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
            'messages',
            'pagination',
            'offset',
            'filters',
            'search',
            'sortBy',
            'sortOrder',
        ],
    });

    const columns: ColumnConfig<ContactMessage>[] = [
        {
            key: 'name',
            label: 'Name',
            sortable: true,
            render: (message) => (
                <div className="font-medium text-foreground">{message.name}</div>
            ),
        },
        {
            key: 'email',
            label: 'Email',
            sortable: true,
            render: (message) => (
                <span className="text-sm text-muted-foreground">
                    {message.email}
                </span>
            ),
        },
        {
            key: 'phone',
            label: 'Phone',
            sortable: true,
            render: (message) => (
                <span className="text-sm text-muted-foreground">
                    {message.phone}
                </span>
            ),
        },
        {
            key: 'message',
            label: 'Message',
            sortable: false,
            render: (message) => (
                <span className="line-clamp-2 max-w-xs text-sm text-muted-foreground">
                    {message.message}
                </span>
            ),
        },
        {
            key: 'read_at',
            label: 'Status',
            sortable: true,
            render: (message) =>
                message.read_at ? (
                    <Badge variant="secondary">Read</Badge>
                ) : (
                    <Badge variant="outline">Unread</Badge>
                ),
        },
        {
            key: 'created_at',
            label: 'Received',
            sortable: true,
            render: (message) => (
                <span className="text-sm text-muted-foreground">
                    {message.created_at
                        ? new Date(message.created_at).toLocaleString()
                        : '—'}
                </span>
            ),
        },
    ];

    const actions: ActionConfig<ContactMessage>[] = [
        {
            label: 'View',
            icon: <Eye className="h-4 w-4" />,
            onClick: (message) => {
                router.visit(route('admin.contact-message.show', message.id));
            },
        },
        {
            label: 'Mark read',
            icon: <MailOpen className="h-4 w-4" />,
            onClick: (message) => {
                router.post(route('admin.contact-message.read', message.id));
            },
            show: (message) => !message.read_at,
        },
        {
            label: 'Mark unread',
            icon: <Mail className="h-4 w-4" />,
            onClick: (message) => {
                router.post(route('admin.contact-message.unread', message.id));
            },
            show: (message) => Boolean(message.read_at),
        },
        {
            label: 'Delete',
            icon: <Trash2 className="h-4 w-4" />,
            onClick: (message) => {
                if (
                    confirm(
                        `Delete the message from "${message.name}"? This cannot be undone.`,
                    )
                ) {
                    router.delete(
                        route('admin.contact-message.destroy', message.id),
                    );
                }
            },
            variant: 'destructive',
        },
    ];

    return (
        <AdminLayout>
            <Head title="Contact Messages" />

            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-semibold">Contact Messages</h1>
                    <p className="text-sm text-muted-foreground">
                        Review and manage messages submitted through the public
                        contact form.
                    </p>
                </div>
                <Link
                    href={route('admin.contact-page.edit')}
                    className="text-sm font-medium text-[#c3102e] hover:underline"
                >
                    Edit contact page
                </Link>
            </div>

            <DataTable
                data={messages}
                columns={columns}
                pagination={pagination}
                offset={offset}
                showNumbering={true}
                actions={actions}
                filters={[
                    {
                        key: 'read_status',
                        label: 'Status',
                        options: [
                            { label: 'Unread', value: 'unread' },
                            { label: 'Read', value: 'read' },
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
                emptyMessage="No contact messages found"
                searchPlaceholder="Search by name, email, phone, or message..."
            />
        </AdminLayout>
    );
}
