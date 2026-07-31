import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, SquarePen } from 'lucide-react';

import { PdfReader } from '@/components/pdf';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import type { SubMenu } from '@/types';

interface Props {
    subMenu: SubMenu;
}

function formatDate(value?: string): string {
    return value ? new Date(value).toLocaleString() : 'N/A';
}

export default function View({ subMenu }: Props) {
    return (
        <AdminLayout>
            <Head title={`${subMenu.name} · Sub Menu`} />

            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-semibold">{subMenu.name}</h1>
                    <p className="text-sm text-muted-foreground">
                        Sub menu #{subMenu.id}
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Button asChild variant="outline" size="lg">
                        <Link href={route('admin.submenu.index')}>
                            <ArrowLeft />
                            Back to Sub Menus
                        </Link>
                    </Button>
                    <Button asChild size="lg">
                        <Link href={route('admin.submenu.edit', subMenu.id)}>
                            <SquarePen />
                            Edit
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
                <Card className="h-fit">
                    <CardHeader>
                        <CardTitle>Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <dl className="flex flex-col gap-3 text-sm">
                            <div className="flex items-center justify-between gap-4">
                                <dt className="text-muted-foreground">Header</dt>
                                <dd className="font-medium">
                                    {subMenu.header?.title ?? 'N/A'}
                                </dd>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                <dt className="text-muted-foreground">Document</dt>
                                <dd>
                                    {subMenu.file ? (
                                        <Badge variant="secondary">
                                            PDF attached
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline">None</Badge>
                                    )}
                                </dd>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                <dt className="text-muted-foreground">Created</dt>
                                <dd>{formatDate(subMenu.created_at)}</dd>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                <dt className="text-muted-foreground">Updated</dt>
                                <dd>{formatDate(subMenu.updated_at)}</dd>
                            </div>
                        </dl>
                    </CardContent>
                </Card>

                {subMenu.file ? (
                    <PdfReader
                        file={subMenu.file}
                        title={subMenu.name}
                        className="h-[calc(100vh-14rem)] min-h-[32rem]"
                    />
                ) : (
                    <Card className="flex items-center justify-center">
                        <CardContent className="py-16 text-center text-muted-foreground">
                            <p>No PDF has been attached to this sub menu yet.</p>
                            <Button asChild variant="outline" className="mt-4">
                                <Link href={route('admin.submenu.edit', subMenu.id)}>
                                    Upload a PDF
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AdminLayout>
    );
}
