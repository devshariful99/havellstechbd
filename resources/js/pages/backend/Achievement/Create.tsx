import { Head, Link, useForm } from '@inertiajs/react';

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
import { AchievementIcon } from '@/lib/achievement-icons';

interface Props {
    icons: string[];
}

export default function AchievementCreate({ icons }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        icon: icons[0] ?? 'database',
        value: '800',
        suffix: '+',
        title: '',
        sort_order: '0',
    });

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        post(route('admin.achievement.store'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <AdminLayout>
            <Head title="Create Achievement" />

            <Card>
                <CardHeader className="flex flex-row justify-between">
                    <CardTitle className="text-2xl">
                        Create Achievement
                    </CardTitle>
                    <Button asChild className="ml-auto">
                        <Link href={route('admin.achievement.index')}>
                            Back to Achievements
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="icon">Icon</Label>
                                <Select
                                    value={data.icon}
                                    onValueChange={(value) =>
                                        setData('icon', value)
                                    }
                                >
                                    <SelectTrigger id="icon">
                                        <SelectValue placeholder="Select icon" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {icons.map((icon) => (
                                            <SelectItem key={icon} value={icon}>
                                                <span className="flex items-center gap-2">
                                                    <AchievementIcon
                                                        name={icon}
                                                        className="h-4 w-4"
                                                    />
                                                    {icon}
                                                </span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                                    Preview:{' '}
                                    <AchievementIcon
                                        name={data.icon}
                                        className="h-5 w-5"
                                    />
                                </div>
                                <InputError message={errors.icon} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(event) =>
                                        setData('title', event.target.value)
                                    }
                                    placeholder="Projects"
                                    required
                                />
                                <InputError message={errors.title} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="value">Number</Label>
                                <Input
                                    id="value"
                                    type="number"
                                    min={0}
                                    value={data.value}
                                    onChange={(event) =>
                                        setData('value', event.target.value)
                                    }
                                    required
                                />
                                <InputError message={errors.value} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="suffix">Suffix (optional)</Label>
                                <Input
                                    id="suffix"
                                    value={data.suffix}
                                    onChange={(event) =>
                                        setData('suffix', event.target.value)
                                    }
                                    placeholder="+ or %"
                                />
                                <InputError message={errors.suffix} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="sort_order">Sort order</Label>
                                <Input
                                    id="sort_order"
                                    type="number"
                                    min={0}
                                    value={data.sort_order}
                                    onChange={(event) =>
                                        setData(
                                            'sort_order',
                                            event.target.value,
                                        )
                                    }
                                />
                                <InputError message={errors.sort_order} />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-4">
                            <Button asChild type="button" variant="outline">
                                <Link href={route('admin.achievement.index')}>
                                    Cancel
                                </Link>
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing
                                    ? 'Creating...'
                                    : 'Create Achievement'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
