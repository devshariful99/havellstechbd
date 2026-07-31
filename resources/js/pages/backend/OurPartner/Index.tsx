import { Head, router, Link } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { useDataTable } from '@/hooks/use-data-table';
import AdminLayout from '@/layouts/admin-layout';
import { OurPartner } from '@/types';
import { PaginationData, ColumnConfig, ActionConfig } from '@/types/data-table.types';


interface Props {
  ourPartners: OurPartner[];
  pagination: PaginationData;
  offset: number;
  filters: Record<string, string | number>;
  search: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export default function OurPartnerIndex({
  ourPartners,
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
    only: ['ourPartners', 'pagination', 'offset', 'filters', 'search', 'sortBy', 'sortOrder'],
  });
  const columns: ColumnConfig<OurPartner>[] = [
    {
      key: 'image',
      label: 'Image',
      render: (ourPartner) => (
        <div className="flex justify-center">
          <img
            src={ourPartner.image ? `/${ourPartner.image}` : '/no-our-partner-image-icon.png'}
            alt={ourPartner.title ? `${ourPartner.title} logo` : 'Partner logo'}
            loading="lazy"
            className="h-[200px] w-auto object-cover"
          />
        </div>
      ),
    },
  ];

  const actions: ActionConfig<OurPartner>[] = [
    {
      label: 'Edit',
      icon: <Pencil className="h-4 w-4" />,
      onClick: (ourPartner) => {
        router.visit(route('admin.our-partner.edit', ourPartner?.id));
      },
    },
    {
      label: 'Delete',
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (ourPartner) => {
        if (confirm(`Are you sure you want to delete ${ourPartner.title}?`)) {
          router.delete(route('admin.our-partner.delete', ourPartner?.id));
        }
      },
      variant: 'destructive',
    },
  ];

  return (
    <AdminLayout>
      <Head title="Our Partners" />

      <div className="flex justify-end mb-6">
        <Link href={route('admin.our-partner.create')}>
          <Button>Create Our Partner</Button>
        </Link>
      </div>

      <div className="mx-auto">
        <DataTable
          data={ourPartners}
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
          emptyMessage="No our partners found"
          searchPlaceholder="Search our partners by title..."
        />


      </div>
    </AdminLayout>
  );
}
