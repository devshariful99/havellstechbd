import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, ImageOff, SquarePen } from 'lucide-react';

import { PdfReader } from '@/components/pdf';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import type { Product } from '@/types';

interface Props {
    product: Product;
}

function formatDate(value?: string): string {
    return value ? new Date(value).toLocaleString() : 'N/A';
}

export default function View({ product }: Props) {
    const imageUrl = product.image ? `/storage/${product.image}` : null;

    return (
        <AdminLayout>
            <Head title={`${product.title} · Product`} />

            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-semibold">{product.title}</h1>
                    <p className="text-sm text-muted-foreground">
                        Product #{product.id}
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Button asChild variant="outline" size="lg">
                        <Link href={route('admin.product.index')}>
                            <ArrowLeft />
                            Back to Products
                        </Link>
                    </Button>
                    <Button asChild size="lg">
                        <Link href={route('admin.product.edit', product.id)}>
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
                                    alt={`${product.title} product image`}
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
                                        {product.file ? (
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
                                    <dd>{formatDate(product.created_at)}</dd>
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                    <dt className="text-muted-foreground">
                                        Updated
                                    </dt>
                                    <dd>{formatDate(product.updated_at)}</dd>
                                </div>
                            </dl>
                        </CardContent>
                    </Card>
                </div>

                {product.file ? (
                    <PdfReader
                        file={product.file}
                        title={product.title}
                        className="h-[calc(100vh-14rem)] min-h-[32rem]"
                    />
                ) : (
                    <Card className="flex items-center justify-center">
                        <CardContent className="py-16 text-center text-muted-foreground">
                            <p>No PDF has been attached to this product yet.</p>
                            <Button asChild variant="outline" className="mt-4">
                                <Link href={route('admin.product.edit', product.id)}>
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
