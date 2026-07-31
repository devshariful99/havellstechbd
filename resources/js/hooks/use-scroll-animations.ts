import { useInView } from 'framer-motion';
import { useRef } from 'react';

export function useScrollAnimation(threshold = 0.1) {
    const ref = useRef(null);
    const isInView = useInView(ref, { 
        once: true, 
        amount: threshold 
    });
    
    return { ref, isInView };
}

export const animationVariants = {
    fadeIn: {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
    },
    slideUp: {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 }
    },
    slideDown: {
        hidden: { opacity: 0, y: -50 },
        visible: { opacity: 1, y: 0 }
    },
    slideLeft: {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0 }
    },
    slideRight: {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0 }
    },
    scale: {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1 }
    }
};

export const animationTransition = {
    duration: 0.6,
    ease: "easeOut"
};
