import 'swiper/css';
import 'swiper/css/pagination';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useRef } from 'react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperInstance } from 'swiper/types';

import type { DownloadableItem } from '@/types';

import { cn } from '../../lib/utils';

export default function Products({
    products,
}: {
    products: DownloadableItem[];
}) {
    const swiperRef = useRef<SwiperInstance | null>(null);

    if (products.length === 0) {
        return null;
    }

    return (
        <div className={cn('container', 'mx-auto', 'mt-20', 'px-4', 'py-12')}>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <h2
                    className={cn(
                        'mb-8',
                        'text-center',
                        'text-4xl',
                        'font-bold',
                        'text-[#c3102e]',
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
                    onSwiper={(swiper) => {
                        swiperRef.current = swiper;
                    }}
                    modules={[Pagination, Autoplay]}
                    spaceBetween={20}
                    slidesPerView={1}
                    pagination={{ clickable: true }}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                    }}
                    loop={products.length > 1}
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
                    onMouseEnter={() => swiperRef.current?.autoplay?.stop()}
                    onMouseLeave={() => swiperRef.current?.autoplay?.start()}
                >
                    {products.map((product, index) => {
                        const title = product.title ?? 'Product';
                        const hasPdf = Boolean(product.downloadLink);

                        const card = (
                            <motion.div
                                className={cn(
                                    'flex',
                                    'h-full',
                                    'flex-col',
                                    'overflow-hidden',
                                    'rounded-lg',
                                    'border',
                                    'border-gray-200',
                                    'bg-white',
                                    'shadow-sm',
                                    '[color-scheme:light]',
                                    hasPdf && 'transition-shadow',
                                )}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.4,
                                    delay: index * 0.05,
                                }}
                                whileHover={
                                    hasPdf
                                        ? {
                                              boxShadow:
                                                  '0 15px 30px rgba(0,0,0,0.15)',
                                              borderColor: '#c3102e',
                                              transition: { duration: 0.2 },
                                          }
                                        : undefined
                                }
                            >
                                <div
                                    className={cn(
                                        'aspect-4/3',
                                        'overflow-hidden',
                                        'border-b',
                                        'border-gray-200',
                                        'bg-white',
                                        'p-3',
                                    )}
                                >
                                    {product.image ? (
                                        <img
                                            src={`/storage/${product.image}`}
                                            alt={title}
                                            loading="lazy"
                                            className="h-full w-full object-contain"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                                            No image
                                        </div>
                                    )}
                                </div>

                                <div
                                    className={cn(
                                        'flex',
                                        'flex-1',
                                        'flex-col',
                                        'bg-white',
                                        'p-4',
                                        'text-center',
                                    )}
                                >
                                    <h3
                                        className={cn(
                                            'mx-auto',
                                            'line-clamp-2',
                                            'max-w-[200px]',
                                            'text-lg',
                                            'font-semibold',
                                            'text-[#c3102e]',
                                        )}
                                    >
                                        {title}
                                    </h3>
                                </div>
                            </motion.div>
                        );

                        return (
                            <SwiperSlide
                                key={product.id}
                                style={{ height: 'auto' }}
                            >
                                {hasPdf ? (
                                    <Link
                                        href={route(
                                            'documents.product',
                                            product.id,
                                        )}
                                        className="block h-full cursor-pointer focus-visible:rounded-lg focus-visible:ring-2 focus-visible:ring-[#c3102e] focus-visible:ring-offset-2 focus-visible:outline-none"
                                        aria-label={`View ${title} PDF`}
                                    >
                                        {card}
                                    </Link>
                                ) : (
                                    <div
                                        className="h-full"
                                        aria-label={`${title} (no PDF available)`}
                                    >
                                        {card}
                                    </div>
                                )}
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
            </motion.div>
        </div>
    );
}
