import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Mail, MailOpen, Trash2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import type { ContactMessage } from '@/types';

interface Props {
    message: ContactMessage;
}

export default function ContactMessageShow({ message }: Props) {
    return (
        <AdminLayout>
            <Head title={`Message from ${message.name}`} />

            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <Button asChild variant="ghost" size="sm" className="mb-2 px-0">
                        <Link href={route('admin.contact-message.index')}>
                            <ArrowLeft className="mr-1 size-4" />
                            Back to messages
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Message from {message.name}
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Received{' '}
                        {message.created_at
                            ? new Date(message.created_at).toLocaleString()
                            : '—'}
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    {message.read_at ? (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                                router.post(
                                    route(
                                        'admin.contact-message.unread',
                                        message.id,
                                    ),
                                )
                            }
                        >
                            <Mail className="mr-1 size-4" />
                            Mark unread
                        </Button>
                    ) : (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                                router.post(
                                    route(
                                        'admin.contact-message.read',
                                        message.id,
                                    ),
                                )
                            }
                        >
                            <MailOpen className="mr-1 size-4" />
                            Mark read
                        </Button>
                    )}
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={() => {
                            if (
                                confirm(
                                    `Delete the message from "${message.name}"? This cannot be undone.`,
                                )
                            ) {
                                router.delete(
                                    route(
                                        'admin.contact-message.destroy',
                                        message.id,
                                    ),
                                );
                            }
                        }}
                    >
                        <Trash2 className="mr-1 size-4" />
                        Delete
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-start justify-between gap-3">
                    <div>
                        <CardTitle>{message.name}</CardTitle>
                        <CardDescription>
                            <a
                                href={`mailto:${message.email}`}
                                className="text-[#c3102e] hover:underline"
                            >
                                {message.email}
                            </a>
                            {' · '}
                            <a
                                href={`tel:${message.phone}`}
                                className="hover:underline"
                            >
                                {message.phone}
                            </a>
                        </CardDescription>
                    </div>
                    {message.read_at ? (
                        <Badge variant="secondary">Read</Badge>
                    ) : (
                        <Badge variant="outline">Unread</Badge>
                    )}
                </CardHeader>
                <CardContent>
                    <p className="whitespace-pre-wrap text-sm leading-7 text-foreground">
                        {message.message}
                    </p>
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
