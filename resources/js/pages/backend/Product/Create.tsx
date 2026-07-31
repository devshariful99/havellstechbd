import { Head, Link, useForm } from '@inertiajs/react';

import FileUpload from '@/components/file-upload';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AdminLayout from '@/layouts/admin-layout';

export default function ProductCreate() {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        file: null as File | null,
        image: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.product.store'), {
            forceFormData: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <AdminLayout>
            <Head title="Create Product" />

            <Card>
                <CardHeader className="flex flex-row justify-between">
                    <CardTitle className="text-2xl">Create New Product</CardTitle>
                    <Link href={route('admin.product.index')} className="ml-auto">
                        <Button>Back to Products</Button>
                    </Link>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    type="text"
                                    value={data.title}
                                    onChange={(e) =>
                                        setData('title', e.target.value)
                                    }
                                    required
                                />
                                <InputError message={errors.title} />
                            </div>

                            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="file">File (PDF)</Label>
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
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-4">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Creating...' : 'Create Product'}
                            </Button>
                            <Link href={route('admin.product.index')}>
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
