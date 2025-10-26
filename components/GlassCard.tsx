import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export default function GlassCard({ children, className = '' }: GlassCardProps) {
  return (
    <div
      className={`
        backdrop-blur-lg bg-white/10
        border border-white/20
        rounded-2xl
        shadow-xl shadow-black/10
        p-8
        ${className}
      `}
    >
      {children}
    </div>
  );
}
