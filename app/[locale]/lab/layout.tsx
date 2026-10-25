import type { Metadata } from 'next';
import { jetbrainsNerd, plexMono, veraMono } from './fonts';
import './lab.css';

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function LabLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`lab ${jetbrainsNerd.variable} ${plexMono.variable} ${veraMono.variable}`} data-font="jetbrains">
      {children}
    </div>
  );
}
