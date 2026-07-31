import { motion } from 'framer-motion';

interface AnimatedContainerProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    duration?: number;
    animation?: 'fadeIn' | 'slideUp' | 'scale' | 'slideInLeft' | 'slideInRight';
}

const animations = {
    fadeIn: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.6 }
    },
    slideUp: {
        initial: { opacity: 0, y: 50 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
    },
    scale: {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
    },
    slideInLeft: {
        initial: { opacity: 0, x: -50 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
    },
    slideInRight: {
        initial: { opacity: 0, x: 50 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
    }
};

export default function AnimatedContainer({ 
    children, 
    className = '', 
    delay = 0, 
    duration = 0.6,
    animation = 'fadeIn' 
}: AnimatedContainerProps) {
    const animationConfig = animations[animation];
    
    return (
        <motion.div
            className={className}
            initial={animationConfig.initial}
            animate={animationConfig.animate}
            transition={{ 
                delay, 
                duration,
                ease: "easeOut"
            }}
        >
            {children}
        </motion.div>
    );
}
