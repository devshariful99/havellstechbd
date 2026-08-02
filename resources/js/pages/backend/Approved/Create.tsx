import { Head, Link, useForm } from '@inertiajs/react';

import FileUpload from '@/components/file-upload';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AdminLayout from '@/layouts/admin-layout';

export default function ApprovedCreate() {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        link: '',
        file: null as File | null,
        image: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.approved.store'), {
            forceFormData: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <AdminLayout>
            <Head title="Create Approved" />

            <Card>
                <CardHeader className="flex flex-row justify-between">
                    <CardTitle className="text-2xl">Create New Approved</CardTitle>
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

                            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="image">Image</Label>
                                    <FileUpload
                                        value={data.image}
                                        onChange={(file) =>
                                            setData(
                                                'image',
                                                file as File | null,
                                            )
                                        }
                                        accept="image/*"
                                        error={errors.image}
                                    />
                                    <InputError message={errors.image} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="file">
                                        File (PDF, optional)
                                    </Label>
                                    <FileUpload
                                        value={data.file}
                                        onChange={(file) =>
                                            setData(
                                                'file',
                                                file as File | null,
                                            )
                                        }
                                        accept="application/pdf,.pdf"
                                        error={errors.file}
                                    />
                                    <InputError message={errors.file} />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-4">
                            <Button type="submit" disabled={processing}>
                                {processing
                                    ? 'Creating...'
                                    : 'Create Approved'}
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
