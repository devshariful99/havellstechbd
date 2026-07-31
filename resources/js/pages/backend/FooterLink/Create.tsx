import { Head, Link, router, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AdminLayout from '@/layouts/admin-layout';

interface FormData {
    title: string;
    url: string;
    sort_order: string;
    is_active: boolean;
}

interface Props {
    nextSortOrder: number;
}

export default function CreateFooterLink({ nextSortOrder }: Props) {
    const { data, setData, post, processing, errors } = useForm<FormData>({
        title: '',
        url: '',
        sort_order: String(nextSortOrder),
        is_active: true,
    });

    function handleSubmit(event: FormEvent) {
        event.preventDefault();

        post(route('admin.footer-link.store'), {
            onSuccess: () => router.visit(route('admin.footer-link.index')),
        });
    }

    return (
        <AdminLayout>
            <Head title="Add Footer Link" />

            <Card>
                <CardHeader className="flex flex-row items-start justify-between gap-4">
                    <div>
                        <CardTitle className="text-2xl">Add Footer Link</CardTitle>
                        <CardDescription className="mt-1">
                            Links appear in the public Useful Links footer and
                            open in a new browser tab.
                        </CardDescription>
                    </div>
                    <Button asChild variant="outline">
                        <Link href={route('admin.footer-link.index')}>
                            Back to Footer Links
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={handleSubmit}
                        className="flex max-w-2xl flex-col gap-6"
                    >
                        <div className="grid gap-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                value={data.title}
                                onChange={(event) =>
                                    setData('title', event.target.value)
                                }
                                placeholder="e.g. Bangladesh Power Development Board"
                                required
                            />
                            <InputError message={errors.title} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="url">URL</Label>
                            <Input
                                id="url"
                                type="url"
                                value={data.url}
                                onChange={(event) =>
                                    setData('url', event.target.value)
                                }
                                placeholder="https://example.gov.bd"
                                required
                            />
                            <InputError message={errors.url} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="sort_order">Display order</Label>
                            <Input
                                id="sort_order"
                                type="number"
                                min={0}
                                value={data.sort_order}
                                onChange={(event) =>
                                    setData('sort_order', event.target.value)
                                }
                            />
                            <p className="text-xs text-muted-foreground">
                                Lower numbers appear first in the footer.
                            </p>
                            <InputError message={errors.sort_order} />
                        </div>

                        <label className="flex items-center gap-3 text-sm">
                            <input
                                type="checkbox"
                                checked={data.is_active}
                                onChange={(event) =>
                                    setData('is_active', event.target.checked)
                                }
                                className="size-4 rounded border-input"
                            />
                            Show this link on the public website
                        </label>
                        <InputError message={errors.is_active} />

                        <div className="flex items-center justify-end gap-3">
                            <Button asChild type="button" variant="outline">
                                <Link href={route('admin.footer-link.index')}>
                                    Cancel
                                </Link>
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Saving…' : 'Add link'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
