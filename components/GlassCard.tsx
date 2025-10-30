import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export default function GlassCard({ children, className = '' }: GlassCardProps) {
  return (
    <div
      className={`
        backdrop-blur-lg bg-gray-600/20
        border-2 border-white/30
        rounded-3xl
        shadow-xl shadow-black/10
        p-8
        ${className}
      `}
    >
      {children}
    </div>
  );
}
