import 'swiper/css';
import { Link } from '@inertiajs/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
// eslint-disable-next-line import/order
import { motion } from 'framer-motion';

import type { DownloadableItem } from '@/types';

import { cn } from '../../lib/utils';

interface ApprovedProps {
    approveds: DownloadableItem[];
}

export default function Approved({ approveds }: ApprovedProps) {
    return (
        <div className="bg-[#000000]">
            <div className={cn('container', 'mx-auto', 'py-24', 'px-4')}>
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
                        APPROVED, STANDARD AND TESTED
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
                        {approveds.map((approved, index) => {
                            const label =
                                approved.title ?? 'Approval certificate';

                            const card = (
                                <motion.div
                                    className={cn(
                                        'border',
                                        'border-white',
                                        'p-3',
                                        'overflow-hidden',
                                        'h-full',
                                        'flex',
                                        'flex-col',
                                    )}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.4,
                                        delay: index * 0.05,
                                    }}
                                    whileHover={{
                                        borderColor: '#c3102e',
                                        boxShadow:
                                            '0 0 20px rgba(195,16,46,0.5)',
                                        transition: { duration: 0.2 },
                                    }}
                                >
                                    <div className="mx-auto h-[152px]">
                                        <motion.img
                                            src={`/storage/${approved.image}`}
                                            alt={label}
                                            loading="lazy"
                                            className="h-full w-full object-contain"
                                            whileHover={{ scale: 1.1 }}
                                            transition={{
                                                duration: 0.2,
                                            }}
                                        />
                                    </div>
                                </motion.div>
                            );

                            if (!approved.downloadLink) {
                                return (
                                    <SwiperSlide
                                        key={approved.id}
                                        style={{ height: 'auto' }}
                                    >
                                        {card}
                                    </SwiperSlide>
                                );
                            }

                            return (
                                <SwiperSlide
                                    key={approved.id}
                                    style={{ height: 'auto' }}
                                >
                                    <Link
                                        href={route(
                                            'documents.approved',
                                            approved.id,
                                        )}
                                        aria-label={`View ${label}`}
                                        className="block w-full cursor-pointer text-left focus-visible:ring-2 focus-visible:ring-[#c3102e] focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
                                    >
                                        {card}
                                    </Link>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                </motion.div>
            </div>
        </div>
    );
}
