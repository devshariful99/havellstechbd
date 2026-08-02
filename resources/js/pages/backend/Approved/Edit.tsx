import { Head, Link, router, useForm } from '@inertiajs/react';
import React from 'react';

import FileUpload from '@/components/file-upload';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AdminLayout from '@/layouts/admin-layout';

interface Approved {
    id: number;
    title: string | null;
    image: string | null;
    file: string | null;
    link: string | null;
    created_at: string;
}

interface ApprovedEditProps {
    approved: Approved;
}

interface FormData {
    title: string;
    link: string;
    file: File | null;
    image: File | null;
    remove_file: string;
    remove_image: string;
}

export default function Edit({ approved }: ApprovedEditProps) {
    const { data, setData, post, processing, errors } = useForm<FormData>({
        title: approved.title || '',
        link: approved.link || '',
        file: null,
        image: null,
        remove_file: '',
        remove_image: '',
    });

    const [existingFiles, setExistingFiles] = React.useState(
        approved.file
            ? [
                  {
                      id: 'file-' + approved.id,
                      path: approved.file,
                      url: `/storage/${approved.file}`,
                      mime_type: 'application/pdf',
                      name: 'Current PDF File',
                  },
              ]
            : [],
    );

    const [existingImages, setExistingImages] = React.useState(
        approved.image
            ? [
                  {
                      id: 'image-' + approved.id,
                      path: approved.image,
                      url: `/storage/${approved.image}`,
                      mime_type: 'image/jpeg',
                      name: 'Current Image',
                  },
              ]
            : [],
    );

    const handleRemoveFile = () => {
        setExistingFiles([]);
        setData('remove_file', '1');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.approved.update', approved.id), {
            forceFormData: true,
            onSuccess: () => router.visit(route('admin.approved.index')),
        });
    };

    return (
        <AdminLayout>
            <Head title="Edit Approved" />

            <Card>
                <CardHeader className="flex flex-row justify-between">
                    <CardTitle className="text-2xl">Edit Approved</CardTitle>
                    <Link
                        href={route('admin.approved.index')}
                        className="ml-auto"
                    >
                        <Button>Back to Approved</Button>
                    </Link>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Title (optional)</Label>
                                <Input
                                    id="title"
                                    type="text"
                                    value={data.title}
                                    onChange={(e) =>
                                        setData('title', e.target.value)
                                    }
                                />
                                <InputError message={errors.title} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="link">
                                    External link (optional)
                                </Label>
                                <Input
                                    id="link"
                                    type="url"
                                    value={data.link}
                                    onChange={(e) =>
                                        setData('link', e.target.value)
                                    }
                                    placeholder="https://example.com"
                                />
                                <p className="text-muted-foreground text-sm">
                                    If set, clicking the image opens this URL in
                                    a new tab. Otherwise a PDF opens the preview
                                    page when attached.
                                </p>
                                <InputError message={errors.link} />
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="image">Image</Label>
                                    <FileUpload
                                        value={data.image}
                                        existingFiles={existingImages}
                                        onChange={(file) => {
                                            if (file) {
                                                setExistingImages([]);
                                                setData('remove_image', '');
                                            }
                                            setData(
                                                'image',
                                                file as File | null,
                                            );
                                        }}
                                        accept="image/*"
                                    />
                                    <InputError message={errors.image} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="file">
                                        PDF File (optional)
                                    </Label>
                                    <FileUpload
                                        value={data.file}
                                        existingFiles={existingFiles}
                                        onRemoveExisting={handleRemoveFile}
                                        onChange={(file) => {
                                            if (file) {
                                                setExistingFiles([]);
                                                setData('remove_file', '');
                                            }
                                            setData(
                                                'file',
                                                file as File | null,
                                            );
                                        }}
                                        accept="application/pdf,.pdf"
                                    />
                                    <InputError message={errors.file} />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-4">
                            <Button type="submit" disabled={processing}>
                                {processing
                                    ? 'Updating...'
                                    : 'Update Approved'}
                            </Button>
                            <Link href={route('admin.approved.index')}>
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
