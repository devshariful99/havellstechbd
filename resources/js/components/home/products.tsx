import 'swiper/css';
import 'swiper/css/navigation';
import { Link } from '@inertiajs/react';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
// eslint-disable-next-line import/order
import { motion } from 'framer-motion';

import type { DownloadableItem } from '@/types';

import { cn } from '../../lib/utils';

export default function Products({
    products,
}: {
    products: DownloadableItem[];
}) {
    return (
        <div className={cn('container', 'mx-auto', 'py-12', 'px-4', 'mt-20')}>
            <motion.div
                className=""
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <h2
                    className={cn(
                        'text-4xl',
                        'text-center',
                        'text-[#c3102e]',
                        'font-bold',
                        'mb-8',
                    )}
                >
                    PRODUCTS AND SERVICES
                </h2>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                <Swiper
                    modules={[Pagination]}
                    spaceBetween={20}
                    slidesPerView={1}
                    pagination={{ clickable: true }}
                    breakpoints={{
                        640: {
                            slidesPerView: 2,
                        },
                        768: {
                            slidesPerView: 3,
                        },
                        1024: {
                            slidesPerView: 4,
                        },
                    }}
                    className="products-swiper"
                    style={{ alignItems: 'stretch' }}
                >
                    {products.map((product, index) => (
                        <SwiperSlide
                            key={product.id}
                            style={{ height: 'auto' }}
                        >
                            <motion.div
                                className={cn(
                                    'bg-white',
                                    'border',
                                    'border-gray-200',
                                    'overflow-hidden',
                                    'h-full',
                                    'flex',
                                    'flex-col',
                                    'rounded-lg',
                                    'shadow-sm',
                                )}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.4,
                                    delay: index * 0.1,
                                }}
                                whileHover={{
                                    boxShadow: '0 15px 30px rgba(0,0,0,0.15)',
                                    borderColor: '#c3102e',
                                    transition: { duration: 0.2 },
                                }}
                            >
                                {/* Image */}
                                <div
                                    className={cn(
                                        'aspect-4/3',
                                        'overflow-hidden',
                                        'border-b',
                                        'border-gray-200',
                                        'bg-gray-100',
                                    )}
                                >
                                    {product.image ? (
                                        <motion.img
                                            src={`/storage/${product.image}`}
                                            alt={product.title ?? 'Product'}
                                            loading="lazy"
                                            className="h-full w-full object-cover"
                                            whileHover={{ scale: 1.1 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                                            No image
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div
                                    className={cn(
                                        'p-4',
                                        'text-center',
                                        'flex',
                                        'flex-col',
                                        'flex-1',
                                    )}
                                >
                                    <motion.h3
                                        className={cn(
                                            'max-w-[200px]',
                                            'mx-auto',
                                            'text-lg',
                                            'font-semibold',
                                            'mb-2',
                                            'line-clamp-2',
                                        )}
                                        whileHover={{ color: '#c3102e' }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {product.title}
                                    </motion.h3>
                                    <div className="mt-auto">
                                        {product.downloadLink ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <Link
                                                    href={route(
                                                        'documents.product',
                                                        product.id,
                                                    )}
                                                    className="rounded bg-[#c3102e] px-4 py-2 text-white transition-colors hover:bg-[#9c0d25] focus-visible:ring-2 focus-visible:ring-[#c3102e] focus-visible:ring-offset-2 focus-visible:outline-none"
                                                >
                                                    View
                                                </Link>
                                                <a
                                                    href={product.downloadLink}
                                                    download
                                                    className="rounded bg-[#170000] px-4 py-2 text-white transition-colors hover:bg-[#5a0a0f] focus-visible:ring-2 focus-visible:ring-[#170000] focus-visible:ring-offset-2 focus-visible:outline-none"
                                                >
                                                    Download
                                                </a>
                                            </div>
                                        ) : (
                                            <span
                                                className={cn(
                                                    'inline-block',
                                                    'bg-gray-400',
                                                    'text-white',
                                                    'px-4',
                                                    'py-2',
                                                    'rounded',
                                                    'cursor-not-allowed',
                                                )}
                                            >
                                                No File
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </motion.div>
        </div>
    );
}
