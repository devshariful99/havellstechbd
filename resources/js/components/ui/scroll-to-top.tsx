import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

export default function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);
    const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
    const [isScrolling, setIsScrolling] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.pageYOffset;
            
            // Trigger animation on every scroll
            setIsScrolling(true);
            
            // Clear existing timeout
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
            
            // Set new timeout to stop scrolling animation
            scrollTimeoutRef.current = setTimeout(() => {
                setIsScrolling(false);
            }, 150);
            
            // Determine scroll direction
            if (currentScrollY > lastScrollY) {
                setScrollDirection('down');
            } else if (currentScrollY < lastScrollY) {
                setScrollDirection('up');
            }
            
            // Toggle visibility based on scroll position
            if (currentScrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
            
            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        };
    }, [lastScrollY]);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 z-50 bg-[#c3102e] text-white p-4 rounded-full shadow-lg hover:bg-[#0077b8] transition-colors"
                    animate={{
                        opacity: 1,
                        scale: isScrolling ? [1, 1.1, 1] : 1,
                        rotate: scrollDirection === 'down' ? 0 : 180,
                        y: isScrolling ? [0, -5, 0] : 0
                    }}
                    transition={{
                        scale: { duration: 0.3, repeat: isScrolling ? Infinity : 0, repeatType: "reverse" },
                        y: { duration: 0.2 },
                        rotate: { duration: 0.3 }
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Scroll to top"
                >
                    <motion.svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        animate={{
                            y: isScrolling ? [0, -3, 0] : [0, -2, 0],
                            rotate: scrollDirection === 'down' ? 0 : 180
                        }}
                        transition={{
                            y: { 
                                duration: isScrolling ? 0.5 : 1.5, 
                                repeat: Infinity, 
                                repeatType: "loop" 
                            }
                        }}
                    >
                        <path
                            d="M12 19V5M5 12L12 5L19 12"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </motion.svg>
                </motion.button>
            )}
        </AnimatePresence>
    );
}
