import { Form } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import type { ContactPageData } from '@/types';

import { cn } from '../../lib/utils';
import InputError from '../input-error';

interface ContactProps {
    contactData: ContactPageData;
}

const fieldClassName = cn('contact-form-field');

const textareaClassName = cn('contact-form-field', 'contact-form-textarea');

export default function Contact({ contactData }: ContactProps) {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -100px 0px',
            },
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const offices = (contactData.offices ?? []).filter(
        (office) => office.lines.length > 0,
    );
    const phones = (contactData.phones ?? []).filter(
        (phoneGroup) => phoneGroup.lines.length > 0,
    );
    const hasOffices = offices.length > 0;
    const hasPhones = phones.length > 0;

    return (
        <div
            ref={sectionRef}
            className={cn('container', 'mx-auto', 'px-4', 'py-12')}
        >
            <div
                className={cn(
                    'grid',
                    'grid-cols-1',
                    'gap-10',
                    hasOffices && hasPhones
                        ? 'lg:grid-cols-3'
                        : hasOffices || hasPhones
                          ? 'lg:grid-cols-2'
                          : 'lg:grid-cols-1',
                )}
            >
                {hasOffices ? (
                    <motion.div
                        className={cn('space-y-5', 'text-[#333333]')}
                        initial={{ opacity: 0, x: -50 }}
                        animate={
                            isVisible
                                ? { opacity: 1, x: 0 }
                                : { opacity: 0, x: -50 }
                        }
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        {offices.map((office, index) => (
                            <motion.div
                                key={`${office.title}-${index}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={
                                    isVisible
                                        ? { opacity: 1, y: 0 }
                                        : { opacity: 0, y: 20 }
                                }
                                transition={{
                                    duration: 0.5,
                                    delay: 0.2 + index * 0.1,
                                }}
                            >
                                {office.title ? (
                                    <h3
                                        className={cn(
                                            'mb-1',
                                            'text-xl',
                                            'font-bold',
                                            'text-[#c3102e]',
                                        )}
                                    >
                                        {office.title}:
                                    </h3>
                                ) : null}
                                {office.lines.map((line) => (
                                    <p key={line} className="leading-7">
                                        {line}
                                    </p>
                                ))}
                            </motion.div>
                        ))}
                    </motion.div>
                ) : null}

                {hasPhones ? (
                    <motion.div
                        className={cn('space-y-5', 'text-[#333333]')}
                        initial={{ opacity: 0, y: 50 }}
                        animate={
                            isVisible
                                ? { opacity: 1, y: 0 }
                                : { opacity: 0, y: 50 }
                        }
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        {phones.map((phoneGroup, index) => (
                            <motion.div
                                key={`${phoneGroup.title}-${index}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={
                                    isVisible
                                        ? { opacity: 1, y: 0 }
                                        : { opacity: 0, y: 20 }
                                }
                                transition={{
                                    duration: 0.5,
                                    delay: 0.3 + index * 0.1,
                                }}
                            >
                                {phoneGroup.title ? (
                                    <h3
                                        className={cn(
                                            'mb-1',
                                            'text-xl',
                                            'font-bold',
                                            'text-[#c3102e]',
                                        )}
                                    >
                                        {phoneGroup.title}:
                                    </h3>
                                ) : null}
                                {phoneGroup.lines.map((line) => (
                                    <p key={line} className="leading-7">
                                        {line}
                                    </p>
                                ))}
                            </motion.div>
                        ))}
                    </motion.div>
                ) : null}

                <motion.div
                    className={cn(
                        'rounded-2xl',
                        'border',
                        'border-[#c3102e]',
                        'bg-white',
                        'p-8',
                        '[color-scheme:light]',
                        !hasOffices && !hasPhones
                            ? 'lg:mx-auto lg:max-w-xl'
                            : '',
                    )}
                    initial={{ opacity: 0, x: 50 }}
                    animate={
                        isVisible
                            ? { opacity: 1, x: 0 }
                            : { opacity: 0, x: 50 }
                    }
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <Form
                        method="POST"
                        action={route('contact.store')}
                        resetOnSuccess
                        onSuccess={() =>
                            toast.success(
                                contactData.form_success_message ||
                                    'Message sent successfully!',
                            )
                        }
                        className="space-y-4"
                    >
                        {({ errors }) => (
                            <>
                                {/*
                                  Plain inputs (not motion.*) so iOS Safari keeps
                                  placeholder color visible — opacity/transform on
                                  the control itself hides placeholders on mobile.
                                */}
                                <input
                                    type="text"
                                    name="name"
                                    placeholder={
                                        contactData.form_name_placeholder ||
                                        'Your Name'
                                    }
                                    className={fieldClassName}
                                />
                                <InputError message={errors.name} />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder={
                                        contactData.form_email_placeholder ||
                                        'Your Email'
                                    }
                                    className={fieldClassName}
                                />
                                <InputError message={errors.email} />
                                <input
                                    type="text"
                                    name="phone"
                                    placeholder={
                                        contactData.form_phone_placeholder ||
                                        'Phone Number'
                                    }
                                    className={fieldClassName}
                                />
                                <InputError message={errors.phone} />
                                <textarea
                                    name="message"
                                    placeholder={
                                        contactData.form_message_placeholder ||
                                        'Message'
                                    }
                                    rows={3}
                                    className={textareaClassName}
                                />
                                <InputError message={errors.message} />
                                <div className={cn('pt-2', 'text-center')}>
                                    <button
                                        type="submit"
                                        className={cn(
                                            'min-w-32',
                                            'rounded-full',
                                            'bg-[#760e12]',
                                            'px-8',
                                            'py-3',
                                            'font-semibold',
                                            'text-white',
                                            'transition',
                                            'hover:bg-[#5d0b0e]',
                                        )}
                                    >
                                        {contactData.form_submit_label ||
                                            'Submit'}
                                    </button>
                                </div>
                            </>
                        )}
                    </Form>
                </motion.div>
            </div>
        </div>
    );
}
