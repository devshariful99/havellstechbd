import { Head, usePage } from '@inertiajs/react';

import type { SharedData } from '@/types';

interface SeoHeadProps {
    /** Page-specific title segment (becomes "Page - Brand"). Omit on homepage. */
    title?: string;
    description?: string;
    /** Brand-first title: "Site Name | Tagline" without a page prefix. */
    homepage?: boolean;
}

export default function SeoHead({
    title,
    description,
    homepage = false,
}: SeoHeadProps) {
    const { name, contactDetails } = usePage<SharedData>().props;
    const siteName =
        contactDetails?.site_name || name || 'HavellsTech Power Engineering';
    const tagline =
        contactDetails?.site_tagline ||
        'Industrial electrical solutions for Bangladesh';
    const metaDescription =
        description ||
        contactDetails?.site_description ||
        'HavellsTech Power Engineering delivers industrial electrical products, power systems, and certified engineering solutions for factories and infrastructure across Bangladesh.';

    const documentTitle = homepage ? `${siteName} | ${tagline}` : title;
    const ogTitle = documentTitle || siteName;

    return (
        <Head title={documentTitle}>
            <meta
                head-key="description"
                name="description"
                content={metaDescription}
            />
            <meta head-key="og:title" property="og:title" content={ogTitle} />
            <meta
                head-key="og:description"
                property="og:description"
                content={metaDescription}
            />
            <meta head-key="og:type" property="og:type" content="website" />
        </Head>
    );
}
