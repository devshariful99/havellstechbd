import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Download } from 'lucide-react';

import { PdfReader } from '@/components/pdf';
import { Button } from '@/components/ui/button';
import FrontendLayout from '@/layouts/frontend-layout';

interface Props {
    title: string;
    file: string;
    downloadUrl: string;
    backUrl: string;
    type: string;
}

export default function DocumentViewer({
    title,
    file,
    downloadUrl,
    backUrl,
}: Props) {
    return (
        <FrontendLayout>
            <Head title={`${title} · Document`} />

            <div className="flex flex-1 flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                        <Button asChild variant="outline" size="sm">
                            <Link href={backUrl}>
                                <ArrowLeft className="size-4" />
                                Back
                            </Link>
                        </Button>
                        <div className="min-w-0">
                            <h1 className="truncate text-xl font-semibold tracking-tight sm:text-2xl">
                                {title}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                PDF document viewer
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Button asChild variant="outline" size="sm">
                            <a href={downloadUrl} download>
                                <Download className="size-4" />
                                Download
                            </a>
                        </Button>
                    </div>
                </div>

                <PdfReader
                    file={file}
                    title={title}
                    className="min-h-[70vh] flex-1 rounded-xl shadow-sm sm:min-h-[calc(100dvh-13rem)]"
                    onClose={() => router.visit(backUrl)}
                />
            </div>
        </FrontendLayout>
    );
}
