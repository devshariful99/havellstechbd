import { Head, Link, useForm } from '@inertiajs/react';
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

export interface SiteSettingsForm {
    site_name: string;
    site_tagline: string;
    primary_phone: string;
    primary_email: string;
    contact_email: string;
    facebook_url: string;
    twitter_url: string;
    linkedin_url: string;
}

interface Props {
    settings: SiteSettingsForm;
}

export default function Edit({ settings }: Props) {
    const { data, setData, put, processing, errors } = useForm<SiteSettingsForm>({
        site_name: settings.site_name ?? '',
        site_tagline: settings.site_tagline ?? '',
        primary_phone: settings.primary_phone ?? '',
        primary_email: settings.primary_email ?? '',
        contact_email: settings.contact_email ?? '',
        facebook_url: settings.facebook_url ?? '',
        twitter_url: settings.twitter_url ?? '',
        linkedin_url: settings.linkedin_url ?? '',
    });

    function handleSubmit(event: FormEvent) {
        event.preventDefault();
        put(route('admin.settings.update'), { preserveScroll: true });
    }

    return (
        <AdminLayout>
            <Head title="Site Settings" />

            <div className="mb-6">
                <h1 className="text-2xl font-semibold tracking-tight">
                    Site Settings
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Update the public site identity, contact details, and social
                    links shown across the website.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>General</CardTitle>
                        <CardDescription>
                            Branding shown in the browser title and public pages.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2 md:col-span-2">
                            <Label htmlFor="site_name">Site name</Label>
                            <Input
                                id="site_name"
                                value={data.site_name}
                                onChange={(event) =>
                                    setData('site_name', event.target.value)
                                }
                                required
                            />
                            <InputError message={errors.site_name} />
                        </div>

                        <div className="grid gap-2 md:col-span-2">
                            <Label htmlFor="site_tagline">Tagline</Label>
                            <Input
                                id="site_tagline"
                                value={data.site_tagline}
                                onChange={(event) =>
                                    setData('site_tagline', event.target.value)
                                }
                                placeholder="Short supporting line for the brand"
                            />
                            <InputError message={errors.site_tagline} />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Contact</CardTitle>
                        <CardDescription>
                            Phone and email used in the top bar, footer, and
                            contact-form notifications.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="primary_phone">Primary phone</Label>
                            <Input
                                id="primary_phone"
                                value={data.primary_phone}
                                onChange={(event) =>
                                    setData('primary_phone', event.target.value)
                                }
                            />
                            <InputError message={errors.primary_phone} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="primary_email">Public email</Label>
                            <Input
                                id="primary_email"
                                type="email"
                                value={data.primary_email}
                                onChange={(event) =>
                                    setData('primary_email', event.target.value)
                                }
                            />
                            <InputError message={errors.primary_email} />
                        </div>

                        <div className="grid gap-2 md:col-span-2">
                            <Label htmlFor="contact_email">
                                Contact form recipient
                            </Label>
                            <Input
                                id="contact_email"
                                type="email"
                                value={data.contact_email}
                                onChange={(event) =>
                                    setData('contact_email', event.target.value)
                                }
                                placeholder="Where contact form messages are sent"
                            />
                            <InputError message={errors.contact_email} />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Social links</CardTitle>
                        <CardDescription>
                            Leave blank to hide a network from the public header.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2 md:col-span-2">
                            <Label htmlFor="facebook_url">Facebook URL</Label>
                            <Input
                                id="facebook_url"
                                type="url"
                                value={data.facebook_url}
                                onChange={(event) =>
                                    setData('facebook_url', event.target.value)
                                }
                                placeholder="https://facebook.com/..."
                            />
                            <InputError message={errors.facebook_url} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="twitter_url">Twitter / X URL</Label>
                            <Input
                                id="twitter_url"
                                type="url"
                                value={data.twitter_url}
                                onChange={(event) =>
                                    setData('twitter_url', event.target.value)
                                }
                                placeholder="https://x.com/..."
                            />
                            <InputError message={errors.twitter_url} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                            <Input
                                id="linkedin_url"
                                type="url"
                                value={data.linkedin_url}
                                onChange={(event) =>
                                    setData('linkedin_url', event.target.value)
                                }
                                placeholder="https://linkedin.com/..."
                            />
                            <InputError message={errors.linkedin_url} />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex items-center justify-end gap-3">
                    <Button asChild type="button" variant="outline">
                        <Link href={route('admin.dashboard')}>Cancel</Link>
                    </Button>
                    <Button type="submit" disabled={processing}>
                        {processing ? 'Saving…' : 'Save settings'}
                    </Button>
                </div>
            </form>
        </AdminLayout>
    );
}
