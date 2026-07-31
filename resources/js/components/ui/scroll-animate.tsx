import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface ScrollAnimateProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    duration?: number;
    direction?: 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade';
    threshold?: number;
}

const variants = {
    up: {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 }
    },
    down: {
        hidden: { opacity: 0, y: -50 },
        visible: { opacity: 1, y: 0 }
    },
    left: {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0 }
    },
    right: {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0 }
    },
    scale: {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1 }
    },
    fade: {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
    }
};

export default function ScrollAnimate({ 
    children, 
    className = '', 
    delay = 0, 
    duration = 0.6,
    direction = 'up',
    threshold = 0.1
}: ScrollAnimateProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: threshold });
    
    return (
        <motion.div
            ref={ref}
            className={className}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={variants[direction]}
            transition={{ 
                duration,
                delay,
                ease: "easeOut"
            }}
        >
            {children}
        </motion.div>
    );
}
