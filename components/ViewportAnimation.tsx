'use client';

import { useEffect, useRef, ReactNode, useState } from 'react';

interface ViewportAnimationProps {
  children: ReactNode;
  className?: string;
  animation?: 'fade-up' | 'fade-in' | 'scale-up' | 'slide-left' | 'slide-right';
  delay?: number;
}

export default function ViewportAnimation({
  children,
  className = '',
  animation = 'fade-up',
  delay = 0
}: ViewportAnimationProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

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
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const animationClasses = {
    'fade-up': isVisible
      ? 'opacity-100 translate-y-0'
      : 'opacity-0 translate-y-8',
    'fade-in': isVisible
      ? 'opacity-100'
      : 'opacity-0',
    'scale-up': isVisible
      ? 'opacity-100 scale-100'
      : 'opacity-0 scale-95',
    'slide-left': isVisible
      ? 'opacity-100 translate-x-0'
      : 'opacity-0 translate-x-8',
    'slide-right': isVisible
      ? 'opacity-100 translate-x-0'
      : 'opacity-0 -translate-x-8',
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${animationClasses[animation]} ${className}`}
      style={{
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  );
}
