import ContactSection from '@/components/contact/contact';
import Hero from '@/components/contact/hero';
import Map from '@/components/contact/map';
import SeoHead from '@/components/seo-head';
import FrontendLayout from '@/layouts/frontend-layout';
import type { ContactPageData } from '@/types';

interface ContactPageProps {
    contactData: ContactPageData;
}

export default function Contact({ contactData }: ContactPageProps) {
    return (
        <FrontendLayout>
            <SeoHead title={contactData.hero_title || 'Contact'} />
            <Hero
                title={contactData.hero_title}
                breadcrumb={contactData.hero_breadcrumb}
                image={contactData.hero_image}
                imageAlt={contactData.hero_image_alt}
            />
            {contactData.map_embed_url ? (
                <Map
                    embedUrl={contactData.map_embed_url}
                    height={contactData.map_height}
                />
            ) : null}
            <ContactSection contactData={contactData} />
        </FrontendLayout>
    );
}
