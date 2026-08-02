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

const fieldClassName = cn(
    'h-12',
    'w-full',
    'rounded-md',
    'border-2',
    'border-[#d4d4d4]',
    'bg-white',
    'px-4',
    'text-sm',
    'text-[#333333]',
    'caret-[#333333]',
    'placeholder:text-[#6b7280]',
    'focus:border-[#c3102e]',
    'focus:outline-none',
    '[color-scheme:light]',
);

const textareaClassName = cn(
    fieldClassName,
    'h-auto',
    'min-h-24',
    'resize-y',
    'py-3',
);

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
                                <motion.input
                                    type="text"
                                    name="name"
                                    placeholder={
                                        contactData.form_name_placeholder ||
                                        'Your Name'
                                    }
                                    className={fieldClassName}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={
                                        isVisible
                                            ? { opacity: 1, scale: 1 }
                                            : { opacity: 0, scale: 0.95 }
                                    }
                                    transition={{ duration: 0.4, delay: 0.4 }}
                                />
                                <InputError message={errors.name} />
                                <motion.input
                                    type="email"
                                    name="email"
                                    placeholder={
                                        contactData.form_email_placeholder ||
                                        'Your Email'
                                    }
                                    className={fieldClassName}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={
                                        isVisible
                                            ? { opacity: 1, scale: 1 }
                                            : { opacity: 0, scale: 0.95 }
                                    }
                                    transition={{ duration: 0.4, delay: 0.5 }}
                                />
                                <InputError message={errors.email} />
                                <motion.input
                                    type="text"
                                    name="phone"
                                    placeholder={
                                        contactData.form_phone_placeholder ||
                                        'Phone Number'
                                    }
                                    className={fieldClassName}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={
                                        isVisible
                                            ? { opacity: 1, scale: 1 }
                                            : { opacity: 0, scale: 0.95 }
                                    }
                                    transition={{ duration: 0.4, delay: 0.6 }}
                                />
                                <InputError message={errors.phone} />
                                <motion.textarea
                                    name="message"
                                    placeholder={
                                        contactData.form_message_placeholder ||
                                        'Message'
                                    }
                                    rows={3}
                                    className={textareaClassName}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={
                                        isVisible
                                            ? { opacity: 1, scale: 1 }
                                            : { opacity: 0, scale: 0.95 }
                                    }
                                    transition={{ duration: 0.4, delay: 0.7 }}
                                />
                                <InputError message={errors.message} />
                                <motion.div
                                    className={cn('pt-2', 'text-center')}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={
                                        isVisible
                                            ? { opacity: 1, y: 0 }
                                            : { opacity: 0, y: 20 }
                                    }
                                    transition={{ duration: 0.4, delay: 0.8 }}
                                >
                                    <motion.button
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
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {contactData.form_submit_label ||
                                            'Submit'}
                                    </motion.button>
                                </motion.div>
                            </>
                        )}
                    </Form>
                </motion.div>
            </div>
        </div>
    );
}
