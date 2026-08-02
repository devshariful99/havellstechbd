import { motion } from 'framer-motion';
import { useRef } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperInstance } from 'swiper/types';

interface HeroImage {
    src: string;
    alt: string;
}

interface HeroProps {
    images?: HeroImage[];
}

export default function Hero({ images = [] }: HeroProps) {
    const swiperRef = useRef<SwiperInstance | null>(null);

    if (images.length === 0) {
        return null;
    }

    return (
        <motion.div
            className="w-full overflow-hidden"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <Swiper
                onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                }}
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={0}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                }}
                loop={images.length > 1}
                className="hero-swiper"
                onMouseEnter={() => swiperRef.current?.autoplay?.stop()}
                onMouseLeave={() => swiperRef.current?.autoplay?.start()}
            >
                {images.map((image) => (
                    <SwiperSlide key={image.src}>
                        <img
                            src={image.src}
                            alt={image.alt}
                            className="aspect-[5/2] w-full object-cover object-center sm:aspect-[21/9] md:aspect-auto md:h-[360px] lg:h-[420px]"
                            loading="eager"
                            decoding="async"
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </motion.div>
    );
}
