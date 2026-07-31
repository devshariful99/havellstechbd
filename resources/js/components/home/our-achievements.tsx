import { motion } from 'framer-motion';
import { Database, Headphones, Trophy, Smile } from "lucide-react";
import { useState, useEffect, useRef } from 'react';

const stats = [
  { icon: Database, value: 800, suffix: "+", label: "Projects" },
  { icon: Headphones, value: 700, suffix: "+", label: "Clients" },
  { icon: Trophy, value: 500, suffix: "+", label: "Awards Won" },
  { icon: Smile, value: 100, suffix: "%", label: "Customer Satisfaction" },
];

function CountUpAnimation({ target, suffix, delay = 0 }: { target: number; suffix: string; delay?: number }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const startDelay = setTimeout(() => {
      const duration = 2000;
      const steps = 60;
      const increment = target / steps;
      const stepDuration = duration / steps;
      
      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        if (currentStep >= steps) {
          setCount(target);
          clearInterval(interval);
        } else {
          setCount(Math.floor(increment * currentStep));
        }
      }, stepDuration);

      return () => clearInterval(interval);
    }, delay * 1000);

    return () => clearTimeout(startDelay);
  }, [isVisible, target, delay]);

  return (
    <span ref={elementRef}>{count}{suffix}</span>
  );
}

export default function OurAchievements() {
  return (
    <motion.section
      className="relative w-full"
      style={{
        backgroundImage: "url('/assets/images/hero/Image02.png')",
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div 
        className="absolute inset-0 bg-black/55"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
      />

      <div className="relative z-10 container mx-auto px-6 py-16">
        <div className="flex flex-wrap justify-around items-center gap-10">
          {stats.map(({ icon: Icon, value, suffix, label }, index) => (
            <motion.div 
              key={label} 
              className="flex flex-col items-center gap-3 text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 + index * 0.15 }}
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, delay: 0.7 + index * 0.15 }}
              >
                <Icon className="w-14 h-14 text-[#ffffff]" strokeWidth={1.5} />
              </motion.div>
              <motion.h2 
                className="text-5xl font-bold text-red-500"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.9 + index * 0.15 }}
              >
                <CountUpAnimation target={value} suffix={suffix} delay={0.9 + index * 0.15} />
              </motion.h2>
              <motion.p 
                className="text-white text-base font-medium tracking-wide"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.1 + index * 0.15 }}
              >
                {label}
              </motion.p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}