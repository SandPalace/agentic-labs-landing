'use client';

import { useEffect, useRef, ReactNode } from 'react';

interface ParallaxSectionProps {
  children: ReactNode;
  speed?: number;
  className?: string;
}

export default function ParallaxSection({
  children,
  speed = 0.5,
  className = ''
}: ParallaxSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const scrolled = window.scrollY;
      const rect = sectionRef.current.getBoundingClientRect();
      const elementTop = rect.top + scrolled;
      const offset = (scrolled - elementTop) * speed;

      sectionRef.current.style.transform = `translateY(${offset}px)`;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return (
    <div ref={sectionRef} className={className}>
      {children}
    </div>
  );
}
