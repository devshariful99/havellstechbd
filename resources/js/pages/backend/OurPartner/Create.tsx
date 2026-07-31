import { Head, Link, router, useForm } from '@inertiajs/react';
import React from 'react';

import FileUpload from '@/components/file-upload';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AdminLayout from '@/layouts/admin-layout';

interface FormData {
    title: string;
    image: File | null;
}

export default function CreateOurPartner() {
    const { data, setData, post, processing, errors } = useForm<FormData>({
        title: '',
        image: null,
    });

    function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        post(route('admin.our-partner.store'), {
            onSuccess: () => router.visit(route('admin.our-partner.index')),
        });
    }

    return (
        <AdminLayout>
            <Head title="Create Our Partner" />

            <Card>
                <CardHeader className="flex flex-row justify-between">
                    <CardTitle className="text-2xl">
                        Create New Our Partner
                    </CardTitle>
                    <Button asChild className="ml-auto">
                        <Link href={route('admin.our-partner.index')}>
                            Back to Our Partners
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-6"
                    >
                        <div className="flex flex-col gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    type="text"
                                    value={data.title}
                                    onChange={(event) =>
                                        setData('title', event.target.value)
                                    }
                                    placeholder="Partner name, used as the logo alt text"
                                />
                                <InputError message={errors.title} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="image">Image</Label>
                                <FileUpload
                                    value={data.image}
                                    onChange={(file) =>
                                        setData('image', file as File | null)
                                    }
                                    accept="image/*"
                                    error={errors.image}
                                />
                                <InputError message={errors.image} />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-4">
                            <Button asChild type="button" variant="outline">
                                <Link href={route('admin.our-partner.index')}>
                                    Cancel
                                </Link>
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing
                                    ? 'Creating...'
                                    : 'Create Our Partner'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
