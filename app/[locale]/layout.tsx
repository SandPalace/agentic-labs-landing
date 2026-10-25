import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
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
const TITLE = "Mty Agentic Labs — Agentes de IA y automatización en Monterrey";
const DESCRIPTION =
  "Laboratorio de ingeniería en Monterrey. Diagnósticos, automatización de procesos, desarrollo de agentes de IA, integraciones ERP y capacitaciones. Hardware propio, proyectos en producción.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://agenticlabs.site"
  ),
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
    title: TITLE,
    description: DESCRIPTION,
    url: "/",
    locale: "es_MX",
    alternateLocale: ["en_US"],
  },
  twitter: {
    card: "summary",
    title: TITLE,
    description: DESCRIPTION,
  },
};

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
    "Laboratorio de ingeniería de inteligencia artificial y automatización con sede en Monterrey, México.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Monterrey",
    addressRegion: "Nuevo León",
    addressCountry: "MX",
  },
  areaServed: "MX",
  serviceType: [
    "Diagnóstico Operativo",
    "Automatización de Procesos",
    "Agentes de IA",
    "Integración ERP",
    "Capacitaciones",
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
