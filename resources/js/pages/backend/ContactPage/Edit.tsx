import { Head, Link, useForm } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import React, { type FormEvent } from 'react';

import FileUpload from '@/components/file-upload';
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
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/admin-layout';

interface ContactGroupForm {
    title: string;
    lines: string;
}

interface ContactPageSettingsForm {
    id: number;
    hero_title: string;
    hero_breadcrumb: string;
    hero_image: string | null;
    hero_image_url: string | null;
    hero_image_alt: string;
    map_embed_url: string;
    map_height: number;
    offices: ContactGroupForm[];
    phones: ContactGroupForm[];
    form_name_placeholder: string;
    form_email_placeholder: string;
    form_phone_placeholder: string;
    form_message_placeholder: string;
    form_submit_label: string;
    form_success_message: string;
}

interface FormData {
    hero_title: string;
    hero_breadcrumb: string;
    hero_image: File | null;
    hero_image_alt: string;
    remove_hero_image: string;
    map_embed_url: string;
    map_height: number;
    offices: ContactGroupForm[];
    phones: ContactGroupForm[];
    form_name_placeholder: string;
    form_email_placeholder: string;
    form_phone_placeholder: string;
    form_message_placeholder: string;
    form_submit_label: string;
    form_success_message: string;
}

interface Props {
    settings: ContactPageSettingsForm;
}

function emptyGroup(): ContactGroupForm {
    return { title: '', lines: '' };
}

export default function Edit({ settings }: Props) {
    const { data, setData, post, processing, errors } = useForm<FormData>({
        hero_title: settings.hero_title ?? '',
        hero_breadcrumb: settings.hero_breadcrumb ?? '',
        hero_image: null,
        hero_image_alt: settings.hero_image_alt ?? '',
        remove_hero_image: '',
        map_embed_url: settings.map_embed_url ?? '',
        map_height: settings.map_height ?? 450,
        offices:
            settings.offices.length > 0
                ? settings.offices
                : [emptyGroup()],
        phones:
            settings.phones.length > 0
                ? settings.phones
                : [emptyGroup()],
        form_name_placeholder: settings.form_name_placeholder ?? '',
        form_email_placeholder: settings.form_email_placeholder ?? '',
        form_phone_placeholder: settings.form_phone_placeholder ?? '',
        form_message_placeholder: settings.form_message_placeholder ?? '',
        form_submit_label: settings.form_submit_label ?? '',
        form_success_message: settings.form_success_message ?? '',
    });

    const [existingFiles, setExistingFiles] = React.useState(
        settings.hero_image_url
            ? [
                  {
                      id: settings.id,
                      path: settings.hero_image ?? settings.hero_image_url,
                      url: settings.hero_image_url,
                      mime_type: 'image/jpeg',
                      name: settings.hero_title,
                  },
              ]
            : [],
    );

    const handleRemoveExisting = () => {
        setExistingFiles([]);
        setData('remove_hero_image', '1');
    };

    function updateGroup(
        field: 'offices' | 'phones',
        index: number,
        key: keyof ContactGroupForm,
        value: string,
    ) {
        const next = data[field].map((group, groupIndex) =>
            groupIndex === index ? { ...group, [key]: value } : group,
        );
        setData(field, next);
    }

    function addGroup(field: 'offices' | 'phones') {
        setData(field, [...data[field], emptyGroup()]);
    }

    function removeGroup(field: 'offices' | 'phones', index: number) {
        const next = data[field].filter((_, groupIndex) => groupIndex !== index);
        setData(field, next.length > 0 ? next : [emptyGroup()]);
    }

    function moveGroup(
        field: 'offices' | 'phones',
        index: number,
        direction: -1 | 1,
    ) {
        const target = index + direction;

        if (target < 0 || target >= data[field].length) {
            return;
        }

        const next = [...data[field]];
        const [item] = next.splice(index, 1);
        next.splice(target, 0, item);
        setData(field, next);
    }

    function handleSubmit(event: FormEvent) {
        event.preventDefault();
        post(route('admin.contact-page.update'), {
            forceFormData: true,
            preserveScroll: true,
        });
    }

    return (
        <AdminLayout>
            <Head title="Contact Page" />

            <div className="mb-6">
                <h1 className="text-2xl font-semibold tracking-tight">
                    Contact Page
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Manage the public contact page banner, map, office details,
                    phone groups, and form labels.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Hero banner</CardTitle>
                        <CardDescription>
                            Title, breadcrumb, and banner image shown at the top
                            of the contact page.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="hero_title">Title</Label>
                            <Input
                                id="hero_title"
                                value={data.hero_title}
                                onChange={(event) =>
                                    setData('hero_title', event.target.value)
                                }
                                required
                            />
                            <InputError message={errors.hero_title} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="hero_breadcrumb">
                                Breadcrumb label
                            </Label>
                            <Input
                                id="hero_breadcrumb"
                                value={data.hero_breadcrumb}
                                onChange={(event) =>
                                    setData(
                                        'hero_breadcrumb',
                                        event.target.value,
                                    )
                                }
                                required
                            />
                            <InputError message={errors.hero_breadcrumb} />
                        </div>

                        <div className="grid gap-2 md:col-span-2">
                            <Label htmlFor="hero_image_alt">Image alt text</Label>
                            <Input
                                id="hero_image_alt"
                                value={data.hero_image_alt}
                                onChange={(event) =>
                                    setData(
                                        'hero_image_alt',
                                        event.target.value,
                                    )
                                }
                            />
                            <InputError message={errors.hero_image_alt} />
                        </div>

                        <div className="grid gap-2 md:col-span-2">
                            <Label htmlFor="hero_image">Banner image</Label>
                            <FileUpload
                                value={data.hero_image}
                                existingFiles={existingFiles}
                                onRemoveExisting={handleRemoveExisting}
                                onChange={(file) =>
                                    setData(
                                        'hero_image',
                                        file as File | null,
                                    )
                                }
                                accept="image/*"
                                error={errors.hero_image}
                            />
                            <InputError message={errors.hero_image} />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Map</CardTitle>
                        <CardDescription>
                            Paste a Google Maps embed URL from Share → Embed a
                            map.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2 md:col-span-2">
                            <Label htmlFor="map_embed_url">Embed URL</Label>
                            <Textarea
                                id="map_embed_url"
                                value={data.map_embed_url}
                                onChange={(event) =>
                                    setData(
                                        'map_embed_url',
                                        event.target.value,
                                    )
                                }
                                rows={3}
                                placeholder="https://www.google.com/maps/embed?..."
                            />
                            <InputError message={errors.map_embed_url} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="map_height">Height (px)</Label>
                            <Input
                                id="map_height"
                                type="number"
                                min={200}
                                max={900}
                                value={data.map_height}
                                onChange={(event) =>
                                    setData(
                                        'map_height',
                                        Number(event.target.value) || 450,
                                    )
                                }
                                required
                            />
                            <InputError message={errors.map_height} />
                        </div>
                    </CardContent>
                </Card>

                <ContactGroupsCard
                    title="Office locations"
                    description="Each block appears in the left column of the contact page."
                    field="offices"
                    groups={data.offices}
                    errors={errors}
                    onAdd={() => addGroup('offices')}
                    onRemove={(index) => removeGroup('offices', index)}
                    onMove={(index, direction) =>
                        moveGroup('offices', index, direction)
                    }
                    onChange={(index, key, value) =>
                        updateGroup('offices', index, key, value)
                    }
                />

                <ContactGroupsCard
                    title="Phone groups"
                    description="Each block appears in the middle column of the contact page."
                    field="phones"
                    groups={data.phones}
                    errors={errors}
                    onAdd={() => addGroup('phones')}
                    onRemove={(index) => removeGroup('phones', index)}
                    onMove={(index, direction) =>
                        moveGroup('phones', index, direction)
                    }
                    onChange={(index, key, value) =>
                        updateGroup('phones', index, key, value)
                    }
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Contact form</CardTitle>
                        <CardDescription>
                            Placeholders, button label, and success toast text.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="form_name_placeholder">
                                Name placeholder
                            </Label>
                            <Input
                                id="form_name_placeholder"
                                value={data.form_name_placeholder}
                                onChange={(event) =>
                                    setData(
                                        'form_name_placeholder',
                                        event.target.value,
                                    )
                                }
                                required
                            />
                            <InputError
                                message={errors.form_name_placeholder}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="form_email_placeholder">
                                Email placeholder
                            </Label>
                            <Input
                                id="form_email_placeholder"
                                value={data.form_email_placeholder}
                                onChange={(event) =>
                                    setData(
                                        'form_email_placeholder',
                                        event.target.value,
                                    )
                                }
                                required
                            />
                            <InputError
                                message={errors.form_email_placeholder}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="form_phone_placeholder">
                                Phone placeholder
                            </Label>
                            <Input
                                id="form_phone_placeholder"
                                value={data.form_phone_placeholder}
                                onChange={(event) =>
                                    setData(
                                        'form_phone_placeholder',
                                        event.target.value,
                                    )
                                }
                                required
                            />
                            <InputError
                                message={errors.form_phone_placeholder}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="form_message_placeholder">
                                Message placeholder
                            </Label>
                            <Input
                                id="form_message_placeholder"
                                value={data.form_message_placeholder}
                                onChange={(event) =>
                                    setData(
                                        'form_message_placeholder',
                                        event.target.value,
                                    )
                                }
                                required
                            />
                            <InputError
                                message={errors.form_message_placeholder}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="form_submit_label">
                                Submit button label
                            </Label>
                            <Input
                                id="form_submit_label"
                                value={data.form_submit_label}
                                onChange={(event) =>
                                    setData(
                                        'form_submit_label',
                                        event.target.value,
                                    )
                                }
                                required
                            />
                            <InputError message={errors.form_submit_label} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="form_success_message">
                                Success message
                            </Label>
                            <Input
                                id="form_success_message"
                                value={data.form_success_message}
                                onChange={(event) =>
                                    setData(
                                        'form_success_message',
                                        event.target.value,
                                    )
                                }
                                required
                            />
                            <InputError
                                message={errors.form_success_message}
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex items-center justify-end gap-3">
                    <Button asChild type="button" variant="outline">
                        <Link href={route('admin.dashboard')}>Cancel</Link>
                    </Button>
                    <Button type="submit" disabled={processing}>
                        {processing ? 'Saving…' : 'Save contact page'}
                    </Button>
                </div>
            </form>
        </AdminLayout>
    );
}

interface ContactGroupsCardProps {
    title: string;
    description: string;
    field: 'offices' | 'phones';
    groups: ContactGroupForm[];
    errors: Record<string, string>;
    onAdd: () => void;
    onRemove: (index: number) => void;
    onMove: (index: number, direction: -1 | 1) => void;
    onChange: (
        index: number,
        key: keyof ContactGroupForm,
        value: string,
    ) => void;
}

function ContactGroupsCard({
    title,
    description,
    field,
    groups,
    errors,
    onAdd,
    onRemove,
    onMove,
    onChange,
}: ContactGroupsCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-start justify-between gap-3">
                <div>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={onAdd}>
                    <Plus className="mr-1 size-4" />
                    Add
                </Button>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                {groups.map((group, index) => (
                    <div
                        key={`${field}-${index}`}
                        className="rounded-lg border p-4"
                    >
                        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                            <p className="text-sm font-medium text-muted-foreground">
                                Block {index + 1}
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={index === 0}
                                    onClick={() => onMove(index, -1)}
                                >
                                    Up
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={index === groups.length - 1}
                                    onClick={() => onMove(index, 1)}
                                >
                                    Down
                                </Button>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => onRemove(index)}
                                >
                                    <Trash2 className="size-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor={`${field}-${index}-title`}>
                                    Title
                                </Label>
                                <Input
                                    id={`${field}-${index}-title`}
                                    value={group.title}
                                    onChange={(event) =>
                                        onChange(
                                            index,
                                            'title',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="e.g. Corporate Office"
                                />
                                <InputError
                                    message={
                                        errors[`${field}.${index}.title`]
                                    }
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor={`${field}-${index}-lines`}>
                                    Lines (one per line)
                                </Label>
                                <Textarea
                                    id={`${field}-${index}-lines`}
                                    value={group.lines}
                                    onChange={(event) =>
                                        onChange(
                                            index,
                                            'lines',
                                            event.target.value,
                                        )
                                    }
                                    rows={4}
                                    placeholder={'Line 1\nLine 2'}
                                />
                                <InputError
                                    message={
                                        errors[`${field}.${index}.lines`]
                                    }
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
