import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { useDataTable } from '@/hooks/use-data-table';
import AdminLayout from '@/layouts/admin-layout';
import { Hero } from '@/types';
import { PaginationData, ColumnConfig, ActionConfig } from '@/types/data-table.types';


interface Props {
  heroes: Hero[];
  pagination: PaginationData;
  offset: number;
  filters: Record<string, string | number>;
  search: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export default function HeroIndex({
  heroes,
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
    only: ['heroes', 'pagination', 'offset', 'filters', 'search', 'sortBy', 'sortOrder'],
  });
  const columns: ColumnConfig<Hero>[] = [
    {
      key: 'image',
      label: 'Image',
      render: (hero) => (
        <div className="flex justify-center">
          <img
            src={hero.image ? `/${hero.image}` : '/logo.png'}
            alt={hero.title || 'Hero slide'}
            loading="lazy"
            className="h-[200px] w-auto object-cover"
          />
        </div>
      ),
    },
  ];

  const actions: ActionConfig<Hero>[] = [
    {
      label: 'Edit',
      icon: <Pencil className="h-4 w-4" />,
      onClick: (hero) => {
        router.visit(route('admin.hero.edit', hero?.id));
      },
    },
    {
      label: 'Delete',
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (hero) => {
        if (confirm(`Are you sure you want to delete ${hero.title}?`)) {
          router.delete(route('admin.hero.delete', hero?.id));
        }
      },
      variant: 'destructive',
    },
  ];

  return (
    <AdminLayout>
      <Head title="Heroes" />

      <div className="flex justify-end mb-6">
        <Link href={route('admin.hero.create')}>
          <Button>Create Hero</Button>
        </Link>
      </div>

      <div className="mx-auto">
        <DataTable
          data={heroes}
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
          emptyMessage="No heroes found"
          searchPlaceholder="Search heroes by title..."
        />


      </div>
    </AdminLayout>
  );
}
