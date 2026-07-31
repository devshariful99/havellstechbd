import { usePage } from '@inertiajs/react';
import { Facebook, Linkedin, Mail, Phone, Twitter } from 'lucide-react';
import type { ComponentType } from 'react';

import type { SharedData } from '@/types';

const SOCIAL_ICONS: Record<string, { label: string; Icon: ComponentType<{ className?: string }> }> = {
    facebook: { label: 'Facebook', Icon: Facebook },
    twitter: { label: 'Twitter', Icon: Twitter },
    linkedin: { label: 'LinkedIn', Icon: Linkedin },
};

export default function HeaderTop() {
    const { contactDetails } = usePage<SharedData>().props;

    const phone = contactDetails?.phone;
    const email = contactDetails?.email;
    const social = Object.entries(contactDetails?.social ?? {}).filter(
        ([network, url]) => Boolean(url) && network in SOCIAL_ICONS,
    );

    return (
        <header className="border-b bg-[#c3102e]">
            <nav className="container mx-auto flex flex-col items-center justify-between gap-3 px-4 py-3 text-center md:flex-row md:text-left">
                <div className="flex flex-col items-center gap-4 md:flex-row md:gap-8">
                    {phone && (
                        <a
                            href={`tel:${phone.replace(/[^\d+]/g, '')}`}
                            className="flex items-center justify-center gap-2 text-[22px] font-normal text-white transition-opacity hover:opacity-80 md:justify-start"
                        >
                            <Phone aria-hidden="true" />
                            <span>{phone}</span>
                        </a>
                    )}

                    {email && (
                        <a
                            href={`mailto:${email}`}
                            className="flex items-center justify-center gap-2 text-base font-normal text-white transition-opacity hover:opacity-80 md:justify-start"
                        >
                            <Mail aria-hidden="true" />
                            <span>{email}</span>
                        </a>
                    )}
                </div>

                {social.length > 0 && (
                    <div className="flex items-center justify-center gap-6">
                        {social.map(([network, url]) => {
                            const { label, Icon } = SOCIAL_ICONS[network];

                            return (
                                <a
                                    key={network}
                                    href={url as string}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={label}
                                    className="text-white transition-opacity hover:opacity-80"
                                >
                                    <Icon className="size-5" />
                                </a>
                            );
                        })}
                    </div>
                )}
            </nav>
        </header>
    );
}
