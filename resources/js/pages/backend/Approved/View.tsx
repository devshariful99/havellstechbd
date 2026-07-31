import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, ImageOff, SquarePen } from 'lucide-react';

import { PdfReader } from '@/components/pdf';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import type { Approved } from '@/types';

interface Props {
    approved: Approved;
}

function formatDate(value?: string): string {
    return value ? new Date(value).toLocaleString() : 'N/A';
}

export default function View({ approved }: Props) {
    const imageUrl = approved.image ? `/storage/${approved.image}` : null;
    const heading = approved.title ?? `Certificate #${approved.id}`;

    return (
        <AdminLayout>
            <Head title={`${heading} · Approved`} />

            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-semibold">{heading}</h1>
                    <p className="text-sm text-muted-foreground">
                        Certificate #{approved.id}
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Button asChild variant="outline" size="lg">
                        <Link href={route('admin.approved.index')}>
                            <ArrowLeft />
                            Back to Approved
                        </Link>
                    </Button>
                    <Button asChild size="lg">
                        <Link href={route('admin.approved.edit', approved.id)}>
                            <SquarePen />
                            Edit
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
                <div className="flex flex-col gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Image</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {imageUrl ? (
                                <img
                                    src={imageUrl}
                                    alt={`${heading} certificate image`}
                                    loading="lazy"
                                    className="w-full rounded-md object-cover"
                                />
                            ) : (
                                <div className="flex flex-col items-center gap-2 rounded-md border border-dashed border-border py-10 text-muted-foreground">
                                    <ImageOff className="size-6" />
                                    <p className="text-sm">No image uploaded</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <dl className="flex flex-col gap-3 text-sm">
                                <div className="flex items-center justify-between gap-4">
                                    <dt className="text-muted-foreground">
                                        Document
                                    </dt>
                                    <dd>
                                        {approved.file ? (
                                            <Badge variant="secondary">
                                                PDF attached
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline">None</Badge>
                                        )}
                                    </dd>
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                    <dt className="text-muted-foreground">
                                        Created
                                    </dt>
                                    <dd>{formatDate(approved.created_at)}</dd>
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                    <dt className="text-muted-foreground">
                                        Updated
                                    </dt>
                                    <dd>{formatDate(approved.updated_at)}</dd>
                                </div>
                            </dl>
                        </CardContent>
                    </Card>
                </div>

                {approved.file ? (
                    <PdfReader
                        file={approved.file}
                        title={heading}
                        className="h-[calc(100vh-14rem)] min-h-[32rem]"
                    />
                ) : (
                    <Card className="flex items-center justify-center">
                        <CardContent className="py-16 text-center text-muted-foreground">
                            <p>No PDF has been attached to this certificate yet.</p>
                            <Button asChild variant="outline" className="mt-4">
                                <Link
                                    href={route('admin.approved.edit', approved.id)}
                                >
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
