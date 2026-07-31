import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

interface HeroProps {
    title: string;
    breadcrumb: string;
    image: string | null;
    imageAlt: string | null;
}

export default function Hero({
    title,
    breadcrumb,
    image,
    imageAlt,
}: HeroProps) {
    const imageSrc = image
        ? image.startsWith('/')
            ? image
            : `/${image}`
        : '/assets/images/contact/Image03.jpg';

    return (
        <motion.section
            className="relative w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <motion.img
                src={imageSrc}
                alt={imageAlt || 'Contact banner'}
                className="h-[345px] w-full object-cover"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2 }}
            />

            <div aria-hidden="true" className="absolute inset-0 bg-black/60" />

            <motion.div
                className="absolute inset-0 flex items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
            >
                <div className="container mx-auto px-4 text-white">
                    <h1 className="text-center text-4xl font-bold">
                        {title || 'Contact Us'}
                    </h1>

                    <nav
                        aria-label="Breadcrumb"
                        className="mt-3 text-center text-base"
                    >
                        <ol className="flex items-center justify-center gap-2">
                            <li className="group relative inline-block">
                                <Link
                                    href="/"
                                    className="relative transition-colors hover:text-[#c3102e]"
                                >
                                    Home
                                    <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#c3102e] transition-all duration-300 ease-in-out group-hover:w-full" />
                                </Link>
                            </li>
                            <li aria-hidden="true">/</li>
                            <li aria-current="page">
                                {breadcrumb || 'Contact Us'}
                            </li>
                        </ol>
                    </nav>
                </div>
            </motion.div>
        </motion.section>
    );
}
