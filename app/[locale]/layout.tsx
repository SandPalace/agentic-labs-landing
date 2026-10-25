import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Poppins, Space_Grotesk } from "next/font/google";
import { routing } from '@/i18n/routing';
import "../globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const SITE_NAME = "Mty Agentic Labs";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  const title = t('title');
  const description = t('description');
  return {
    title,
    description,
    applicationName: SITE_NAME,
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://agenticlabs.site"),
    alternates: { canonical: `/${locale}`, languages: { es: '/es', en: '/en' } },
    icons: {
      icon: [
        { url: "/favicon.svg", type: "image/svg+xml" },
        { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      ],
      apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title,
      description,
      url: `/${locale}`,
      locale: locale === 'es' ? "es_MX" : "en_US",
      alternateLocale: [locale === 'es' ? "en_US" : "es_MX"],
    },
    twitter: { card: "summary", title, description },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Mty Agentic Labs",
  url: "https://agenticlabs.site",
  email: "hello@agenticlabs.site",
  logo: "https://agenticlabs.site/email/logo-mark-192.png",
  description:
    "Transformación agéntica para empresas: capacitación en IA, cerebro empresarial y agentes de IA conectados a tus sistemas, desde Monterrey, México.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Monterrey",
    addressRegion: "Nuevo León",
    addressCountry: "MX",
  },
  areaServed: "MX",
  serviceType: [
    "Diagnóstico de IA",
    "Taller IA para Negocios",
    "Acompañamiento mensual",
    "Cerebro empresarial",
    "Automatización de procesos",
    "Agentes de IA",
    "Integración de sistemas",
  ],
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${poppins.variable} ${spaceGrotesk.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
