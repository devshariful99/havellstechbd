import { motion } from 'framer-motion';
import 'swiper/css';
import 'swiper/css/navigation';
import { useRef } from 'react';
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
            className="w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <Swiper
                onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                }}
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={0}
                slidesPerView={1}
                navigation
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                }}
                loop={images.length > 1}
                className="hero-swiper"
                onMouseEnter={() => swiperRef.current?.autoplay?.stop()}
                onMouseLeave={() => swiperRef.current?.autoplay?.start()}
            >
                {images.map((image, index) => (
                    <SwiperSlide key={image.src}>
                        <motion.img
                            src={image.src}
                            alt={image.alt}
                            className="h-[345px] w-full object-cover"
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1.2, delay: index * 0.2 }}
                            whileHover={{ scale: 1.05 }}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </motion.div>
    );
}
