import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { useDataTable } from '@/hooks/use-data-table';
import AdminLayout from '@/layouts/admin-layout';
import { AchievementIcon } from '@/lib/achievement-icons';
import type { Achievement } from '@/types';
import type {
    ActionConfig,
    ColumnConfig,
    PaginationData,
} from '@/types/data-table.types';

interface Props {
    achievements: Achievement[];
    pagination: PaginationData;
    offset: number;
    filters: Record<string, string | number>;
    search: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
}

export default function AchievementIndex({
    achievements,
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
            'achievements',
            'pagination',
            'offset',
            'filters',
            'search',
            'sortBy',
            'sortOrder',
        ],
    });

    const columns: ColumnConfig<Achievement>[] = [
        {
            key: 'icon',
            label: 'Icon',
            render: (achievement) => (
                <div className="flex justify-center">
                    <AchievementIcon
                        name={achievement.icon}
                        className="h-8 w-8"
                    />
                </div>
            ),
        },
        {
            key: 'value',
            label: 'Number',
            sortable: true,
            render: (achievement) => (
                <span className="font-semibold">
                    {achievement.value}
                    {achievement.suffix ?? ''}
                </span>
            ),
        },
        {
            key: 'title',
            label: 'Title',
            sortable: true,
        },
        {
            key: 'sort_order',
            label: 'Order',
            sortable: true,
        },
    ];

    const actions: ActionConfig<Achievement>[] = [
        {
            label: 'Edit',
            icon: <Pencil className="h-4 w-4" />,
            onClick: (achievement) => {
                router.visit(route('admin.achievement.edit', achievement.id));
            },
        },
        {
            label: 'Delete',
            icon: <Trash2 className="h-4 w-4" />,
            onClick: (achievement) => {
                if (
                    confirm(
                        `Are you sure you want to delete ${achievement.title}?`,
                    )
                ) {
                    router.delete(
                        route('admin.achievement.destroy', achievement.id),
                    );
                }
            },
            variant: 'destructive',
        },
    ];

    return (
        <AdminLayout>
            <Head title="Achievements" />

            <div className="mb-6 flex justify-end">
                <Button asChild>
                    <Link href={route('admin.achievement.create')}>
                        Create Achievement
                    </Link>
                </Button>
            </div>

            <div className="mx-auto">
                <DataTable
                    data={achievements}
                    columns={columns}
                    pagination={pagination}
                    offset={offset}
                    showNumbering={true}
                    actions={actions}
                    filters={[]}
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
                    emptyMessage="No achievements found"
                    searchPlaceholder="Search achievements..."
                />
            </div>
        </AdminLayout>
    );
}
