import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';

import FileUpload from '@/components/file-upload';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AdminLayout from '@/layouts/admin-layout';

interface Header {
    id: number;
    title: string;
    slug: string;
}

interface SubMenu {
    id: number;
    header_id: number;
    name: string;
    file: string | null;
    created_at: string;
    updated_at: string;
    header?: Header;
}

interface SubMenuEditProps {
    subMenu: SubMenu;
    headers: Header[];
}

export default function SubMenuEdit({ subMenu, headers }: SubMenuEditProps) {
    const { data, setData, post, processing, errors } = useForm({
        header_id: subMenu.header_id.toString(),
        name: subMenu.name,
        file: null as File | null,
        remove_file: '',
    });

    const [existingFiles, setExistingFiles] = React.useState(
        subMenu.file
            ? [
                  {
                      id: `file-${subMenu.id}`,
                      path: subMenu.file,
                      url: `/storage/${subMenu.file}`,
                      mime_type: 'application/pdf',
                      name: 'Current PDF File',
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
        post(route('admin.submenu.update', subMenu.id), {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout>
            <Head title="Edit SubMenu" />

            <Card>
                <CardHeader className="flex flex-row justify-between">
                    <CardTitle className="text-2xl">Edit SubMenu</CardTitle>
                    <Link
                        href={route('admin.submenu.index')}
                        className="ml-auto"
                    >
                        <Button>Back to SubMenus</Button>
                    </Link>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="header_id">Header</Label>
                                <Select
                                    value={data.header_id}
                                    onValueChange={(value) =>
                                        setData('header_id', value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select header" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {headers.map((header) => (
                                            <SelectItem
                                                key={header.id}
                                                value={header.id.toString()}
                                            >
                                                {header.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.header_id} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    required
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="file">File (PDF)</Label>
                                <FileUpload
                                    value={data.file}
                                    existingFiles={existingFiles}
                                    onRemoveExisting={handleRemoveFile}
                                    onChange={(file) => {
                                        if (file) {
                                            setExistingFiles([]);
                                            setData('remove_file', '');
                                        }

                                        setData('file', file as File | null);
                                    }}
                                    accept="application/pdf,.pdf"
                                    error={errors.file}
                                />
                                <InputError message={errors.file} />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-4">
                            <Button type="submit" disabled={processing}>
                                {processing
                                    ? 'Updating...'
                                    : 'Update SubMenu'}
                            </Button>
                            <Link href={route('admin.submenu.index')}>
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
