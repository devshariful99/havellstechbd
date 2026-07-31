import { Head, router, Link } from '@inertiajs/react';
import { Pencil, Trash2, Eye } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { useDataTable } from '@/hooks/use-data-table';
import AdminLayout from '@/layouts/admin-layout';
import { PaginationData, ColumnConfig, ActionConfig } from '@/types/data-table.types';

interface SubMenu extends Record<string, unknown> {
  id: number;
  header_id: number;
  name: string;
  file: string;
  created_at: string;
  updated_at: string;
  header?: {
    id: number;
    title: string;
    slug: string;
  };
}

interface Props {
  subMenus: SubMenu[];
  pagination: PaginationData;
  offset: number;
  filters: Record<string, string | number>;
  search: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export default function SubMenuIndex({
  subMenus,
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
    only: ['subMenus', 'pagination', 'offset', 'filters', 'search', 'sortBy', 'sortOrder'],
  });

  const columns: ColumnConfig<SubMenu>[] = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (subMenu) => (
        <div className="font-medium text-gray-900 dark:text-gray-100">
          {subMenu.name}
        </div>
      ),
    },
    {
      key: 'file',
      label: 'File',
      sortable: true,
      render: (subMenu) => (
        <div className="text-gray-600 dark:text-gray-400">
          {subMenu.file ? (
            <a 
              href={`/storage/${subMenu.file}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-2"
              download
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PDF
            </a>
          ) : (
            <span className="text-gray-400">No file</span>
          )}
        </div>
      ),
    },
    {
      key: 'header',
      label: 'Header',
      sortable: true,
      render: (subMenu) => (
        <div className="text-gray-600 dark:text-gray-400">
          {subMenu.header?.title || 'N/A'}
        </div>
      ),
    },
    {
      key: 'created_at',
      label: 'Created Date',
      sortable: true,
      render: (subMenu) => (
        <div className="text-gray-600 dark:text-gray-400">
          {new Date(subMenu.created_at).toLocaleDateString()}
        </div>
      ),
    },
  ];

  const actions: ActionConfig<SubMenu>[] = [
    {
      label: 'View',
      icon: <Eye className="h-4 w-4" />,
      onClick: (subMenu) => {
        router.visit(route('admin.submenu.view', subMenu?.id));
      },
    },
    {
      label: 'Edit',
      icon: <Pencil className="h-4 w-4" />,
      onClick: (subMenu) => {
        router.visit(route('admin.submenu.edit', subMenu?.id));
      },
    },
    {
      label: 'Delete',
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (subMenu) => {
        if (confirm(`Are you sure you want to delete ${subMenu.name}?`)) {
          router.delete(route('admin.submenu.destroy', subMenu.id));
        }
      },
      variant: 'destructive',
    },
  ];

  return (
    <AdminLayout>
      <Head title="SubMenus" />

      <div className="flex justify-end mb-6">
        <Link href={route('admin.submenu.create')}>
          <Button>Create SubMenu</Button>
        </Link>
      </div>

      <div className="mx-auto">
        <DataTable
          data={subMenus}
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
          emptyMessage="No sub menus found"
          searchPlaceholder="Search sub menus by name, file..."
        />


      </div>
    </AdminLayout>
  );
}
