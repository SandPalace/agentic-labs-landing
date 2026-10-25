import Link from 'next/link';

const VARIANTS = [
  { href: 'lab/sonar-a', name: 'sonar-a', note: 'Variant A' },
  { href: 'lab/sonar-b', name: 'sonar-b', note: 'Variant B' },
];

export default async function LabIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <main style={{ padding: 32, background: '#1a1b26', color: '#c0caf5', minHeight: '100dvh' }}>
      <p>~/lab $ ls</p>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {VARIANTS.map((v) => (
          <li key={v.name} style={{ padding: '6px 0' }}>
            <Link href={`/${locale}/${v.href}`} style={{ color: '#7aa2f7' }}>{v.name}/</Link>
            <span style={{ opacity: 0.5 }}>  # {v.note}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
