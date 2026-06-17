# MTY Agentic Labs — Landing

The marketing landing for **MTY Agentic Labs** (Monterrey, México). Built with
**Next.js 16 (App Router)**, **next-intl** (EN / ES), and **Tailwind v4**.

## Design system

The site uses a "lab-tech" aesthetic — light base (`#EEF3FB`), brand blue
(`#1865D3`), yellow accent (`#FFE14D`), dark navy sections (`#0D1F3C`), with
mono labels and hairline 1px grid dividers between cards.

Fonts: **Space Grotesk** (display), **IBM Plex Sans** (body), **IBM Plex Mono**
(labels & nav).

## Stack

- **Framework:** Next.js 16 + React 19
- **i18n:** next-intl 4 (EN default, ES available — `localePrefix: 'always'`)
- **Styling:** Tailwind v4 (`@theme` block defines color + font tokens)
- **Content:** JSON files in `messages/{en,es}.json`
- **Deploy:** static export to `out/`, published to GitHub Pages via `gh-pages`

## Structure

```
app/
  layout.tsx              # root layout (passthrough)
  globals.css             # Tailwind v4 + design tokens
  [locale]/
    layout.tsx            # loads fonts + next-intl + JSON-LD
    page.tsx              # single homepage (10 sections)
components/
  Topbar.tsx              # sticky dark header w/ nav + lang
  Footer.tsx              # dark footer w/ nav + location
  ServiceCard.tsx         # S-01..S-04 hairline card
  ProblemCard.tsx         # 01..03 hairline card
  DiffCard.tsx            # D-01..D-03 outlined card
  AgentCard.tsx           # 6 agents (MANGO..MAIZ)
  CatalogCard.tsx         # EST-001.. featured studies
  StackItem.tsx           # OSS ecosystem strip
  LanguageToggle.tsx      # EN/ES switcher
i18n/
  routing.ts              # locales: en, es
  request.ts              # next-intl getRequestConfig
messages/
  en.json
  es.json
public/
  favicon.svg
  mark-white.svg
  mark.svg
  logo_mal.jpeg
```

## Develop

```bash
npm install
npm run dev        # http://localhost:9999
npm run build      # static export to ./out
npm run lint
npm run deploy     # publishes ./out to gh-pages
```

## Content

All copy lives in `messages/{en,es}.json`. The homepage reads from
`hero`, `services`, `problems`, `method`, `differentiators`, `agents`, `stack`,
`cta`, `topbar`, `footer`, and `common`. Keep both locales in sync.
