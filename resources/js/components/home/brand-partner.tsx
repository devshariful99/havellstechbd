import { motion } from 'framer-motion';
import 'swiper/css';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import type { OurPartner } from '@/types';

import { cn } from '../../lib/utils';

export default function BrandPartner({ partners }: { partners: OurPartner[] }) {
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
                    OUR BRAND PARTNERS
                </h2>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                <Swiper
                    modules={[Pagination, Autoplay]}
                    spaceBetween={20}
                    slidesPerView={1}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                    }}
                    loop={true}
                    breakpoints={{
                        640: {
                            slidesPerView: 2,
                        },
                        768: {
                            slidesPerView: 3,
                        },
                        1024: {
                            slidesPerView: 6,
                        },
                    }}
                    className="brand-partners-swiper"
                >
                    {partners.map((brandPartner, index) => (
                        <SwiperSlide
                            key={brandPartner.id}
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
                                    'p-4',
                                    'rounded-lg',
                                )}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.4,
                                    delay: index * 0.1,
                                }}
                                whileHover={{
                                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                                    borderColor: '#c3102e',
                                    transition: { duration: 0.2 },
                                }}
                            >
                                <div className="mx-auto h-[60px] w-[100px]">
                                    {brandPartner.image ? (
                                        <motion.img
                                            src={
                                                brandPartner.image.startsWith('/')
                                                    ? brandPartner.image
                                                    : `/${brandPartner.image}`
                                            }
                                            alt={
                                                brandPartner.title ??
                                                'Brand partner logo'
                                            }
                                            loading="lazy"
                                            className="h-full w-full object-contain"
                                            whileHover={{ scale: 1.1 }}
                                            transition={{ duration: 0.2 }}
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                                            {brandPartner.title ?? 'Partner'}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </motion.div>
        </div>
    );
}
