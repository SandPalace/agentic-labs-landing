"use client";

import { useEffect, useState, useRef } from "react";

interface Bubble {
  id: number;
  color: string;
  size: number;
  startX: number;
  startY: number;
  duration: number;
  delay: number;
  blur: number;
  opacity: number;
}

const colors = [
  "#60a5fa", // light blue
  "#3b82f6", // blue
  "#2563eb", // darker blue
  "#1d4ed8", // deep blue
  "#1e40af", // navy blue
  "#1e3a8a", // dark navy
];

function generateBubble(id: number, initial: boolean = false): Bubble {
  const duration = Math.random() * 10 + 25; // 15-25s (faster!)
  const color = colors[Math.floor(Math.random() * colors.length)];
  const size = Math.random() * 200 + 150; // 150-350px
  const startX = Math.random() * 100; // 0-100%
  const blur = Math.random() * 50 + 50; // 0-50px
  const opacity = Math.random() * 0.1 + 0.25; // 0.25-0.35

  // Initial bubbles start at 0% with negative delay (appear mid-animation)
  // New bubbles start at 0% but will be positioned below with CSS
  const delay = initial ? -(Math.random() * duration) : 0;
  const startY = 0;

  return {
    id,
    color,
    size,
    startX,
    startY,
    duration,
    delay,
    blur,
    opacity,
  };
}

export function GradientBackground() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    // Measure container height
    const updateHeight = () => {
      if (containerRef.current) {
        const height = containerRef.current.offsetHeight;
        setContainerHeight(height);
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);

    // Update height after content loads
    const timer = setTimeout(updateHeight, 100);

    return () => {
      window.removeEventListener('resize', updateHeight);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    // Generate initial bubbles with staggered negative delays
    const initialBubbles = Array.from({ length: 12 }, (_, i) =>
      generateBubble(i, true)
    );
    setBubbles(initialBubbles);

    // Continuously add new bubbles from bottom - infinite stream
    let nextId = initialBubbles.length;
    const interval = setInterval(() => {
      setBubbles((prev) => [...prev, generateBubble(nextId++, false)]);
    }, 3000); // Add new bubble every 3 seconds (slower spawning)

    // Remove bubbles that have finished their animation
    const cleanupInterval = setInterval(() => {
      setBubbles((prev) => {
        // Keep only the most recent 15 bubbles
        return prev.slice(-15);
      });
    }, 3000); // Cleanup every 3 seconds

    return () => {
      clearInterval(interval);
      clearInterval(cleanupInterval);
    };
  }, []);

  // Calculate animation distance based on container height
  const animationDistance = containerHeight > 0
    ? `${containerHeight + 500}px` // Container height + 500px buffer
    : '200vh'; // Fallback

  return (
    <>
      <style jsx>{`
        @keyframes float-up {
          0% {
            transform: translate(0, 400px) scale(1);
            opacity: 0;
          }
          5% {
            opacity: var(--bubble-opacity);
          }
          25% {
            transform: translate(30px, calc(var(--animation-distance) * -0.25 + 400px)) scale(1.1);
          }
          50% {
            transform: translate(-20px, calc(var(--animation-distance) * -0.5 + 400px)) scale(0.95);
          }
          75% {
            transform: translate(35px, calc(var(--animation-distance) * -0.75 + 400px)) scale(1.05);
          }
          95% {
            opacity: var(--bubble-opacity);
          }
          100% {
            transform: translate(0, calc(var(--animation-distance) * -1 + 400px)) scale(0.8);
            opacity: 0;
          }
        }

        .bubble-float {
          animation: float-up linear infinite;
        }
      `}</style>
      <div
        ref={containerRef}
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          ['--animation-distance' as string]: animationDistance,
        } as React.CSSProperties}
      >
        {bubbles.map((bubble) => (
          <div
            key={bubble.id}
            className="absolute rounded-full bubble-float"
            style={{
              left: `${bubble.startX}%`,
              bottom: `${bubble.startY}%`,
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              backgroundColor: bubble.color,
              ['--bubble-opacity' as string]: bubble.opacity,
              filter: `blur(${bubble.blur}px)`,
              animationDuration: `${bubble.duration}s`,
              animationDelay: `${bubble.delay}s`,
              willChange: 'transform',
            } as React.CSSProperties}
          />
        ))}
      </div>
    </>
  );
}
