// This is the root layout that wraps all localized layouts
// The actual HTML structure is in app/[locale]/layout.tsx
// This file must not render any HTML tags
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
