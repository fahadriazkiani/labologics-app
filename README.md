# Labologics — Understand Your Labs

AI lab report interpreter, rebuilt from **Reportsay** as a full-stack PWA.

Upload a Chughtai, IDC, or any other lab report → get a plain-English (or Urdu) summary powered by Gemini, save it to your account, and share it as a WhatsApp image.

> **Live prototype it replaces:** https://reportsay.streamlit.app/
> **Original source cloned for AI logic:** https://github.com/fahadriazkiani/Reportsay
> **UI:** converted from `labologics-preview.html` (attached design + screenshot) into Next.js 14 + Tailwind React components — not raw HTML.

## What was kept from the originals

| Source | Kept verbatim in intent |
|---|---|
| `labologics-preview.html` | `switchTab` (with `fadeIn`), `handleImageSelection` (base64), `formatMarkdown`, `analyzeReport` (Gemini `inlineData` payload), the 5 screens, hero card, upload area, loading/result states, disclaimer, and the exact bottom nav: Home · Info · **center BIG teal FAB** · Tests · Profile |
| `Reportsay/app.py` | `build_analysis_prompt` structure (Tests Detected / Normal / Abnormal / Summary / Next Steps + disclaimer), English + Urdu language choice, 10 MB limit, PDF first-page handling (Gemini reads the PDF directly), `FALLBACK_PRICES` / `LAB_LOCATIONS` / `COMMON_TESTS` price checker, PDF-style share/download, privacy note |
| Screenshot | Navy hero (`#1e293b` gradient), teal `#0d9488`, Plus Jakarta Sans, CBC / Chughtai · Oct 24 2026 and Lipid Profile / IDC · Sep 12 2026 as the demo reports |

## Production upgrades

- **Next.js 14 (App Router) + Tailwind CSS**, TypeScript, `Plus Jakarta Sans` via `next/font`.
- **Gemini server-side only** — `POST /api/analyze` builds the `inlineData` payload; `GEMINI_API_KEY` never reaches the browser (the preview called Google directly with an empty key).
- **Supabase Auth** (email/password + magic link) and a `reports` table with Row Level Security — users only ever see their own reports. File uploads go to a private-by-path Storage bucket (`report-images`). Run `supabase/schema.sql` once.
- **Guest mode:** without Supabase configured, analysis still works and reports save to `localStorage` on the device.
- **Share as WhatsApp image:** the summary is rendered to a 1080px PNG (`html-to-image`) and shared via the Web Share API with files; fallback downloads the PNG and opens `wa.me` with the summary text.
- **PWA:** `manifest.webmanifest`, service worker (`public/sw.js`, app-shell cache, API never cached), installable icons, `theme-color #0d9488`.
- **Greeting / profile are dynamic** after sign-in (the HTML hard-coded “Sarah Ahmed”). Before sign-in, the two screenshot reports appear labelled **Sample**.

## Screens

1. **Home** — hero card → AI Interpreter, Recent Reports (real + sample).
2. **Info** — Health Insights articles (CBC, HbA1c, Lipid, Thyroid), expandable.
3. **AI Interpreter** (center FAB) — upload image/PDF, English/Urdu, Gemini analysis, save, WhatsApp-image share, PNG download, copy.
4. **Tests** — Test Suggestions + Smart Price Checker (Lahore labs, Rs., lowest/highest/average, Google Maps directions).
5. **Profile** — Supabase account, report stats, settings, log out.

## Quick start

```bash
cp .env.example .env.local
# fill in GEMINI_API_KEY, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
npm install
npm run dev        # http://localhost:3000
npm run build      # production check
```

> Without `GEMINI_API_KEY`, the Interpreter shows a clear server error instead of silently failing. Without Supabase vars, the app runs in guest/demo mode.

## Supabase setup (5 minutes)

1. Create a project at https://supabase.com/dashboard — copy **Project URL** and **anon public key** from Settings → API.
2. SQL Editor → paste and run `supabase/schema.sql` (creates `reports`, RLS policies, and the `report-images` bucket).
3. Authentication → Providers → Email: enable Email + “Confirm email” as you prefer. For magic links, add this redirect URL under Authentication → URL Configuration → Redirect URLs: `https://<your-domain>/auth/callback` (and `http://localhost:3000/auth/callback` for local dev).
4. Set the site URL to your Vercel domain in the same place.

## Deploy to Vercel

```bash
npm i -g vercel   # or use the Vercel dashboard → Import Git Repository
vercel
```

In Vercel → Project → Settings → Environment Variables, add:

| Variable | Value |
|---|---|
| `GEMINI_API_KEY` | Your Google AI Studio key (server-only, no `NEXT_PUBLIC_` prefix) |
| `GEMINI_MODEL` | Optional, default `gemini-2.5-flash` |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://<ref>.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `NEXT_PUBLIC_APP_URL` | `https://<your-app>.vercel.app` |

Then redeploy. No build settings to change — Next.js is auto-detected.

Get a Gemini key: https://aistudio.google.com/app/apikey

## Project layout

```
src/
  app/
    layout.tsx            # font, metadata, PWA viewport, phone shell
    page.tsx              # switchTab shell + saved-report detail
    api/analyze/route.ts  # server-only Gemini inlineData call
    auth/callback/route.ts# Supabase magic-link callback
  components/
    BottomNav.tsx         # exact 5-item nav + center FAB
    Header.tsx  AuthProvider.tsx  LoginForm.tsx  ShareCard.tsx  RegisterSW.tsx
    screens/  HomeScreen  InfoScreen  InterpreterScreen  TestsScreen  ProfileScreen
  lib/
    gemini.ts             # buildAnalysisPrompt (from app.py) + limits
    formatMarkdown.ts     # ported formatter, HTML-escaped
    prices.ts             # FALLBACK_PRICES / LAB_LOCATIONS (from app.py)
    articles.ts  suggestions.ts  reports.ts  share.ts
    supabase/  client.ts  server.ts
supabase/schema.sql       # reports table + RLS + storage bucket
public/  manifest.webmanifest  sw.js  icons/
```

## Medical disclaimer

Labologics is educational only. AI summaries are not medical advice, diagnosis, or treatment. Always consult a qualified physician — the disclaimer appears on every analysis, share image, and saved report, as in Reportsay.

Made by Fahad Riaz Kiani — MLS, Founder Insilicologics + Labologics Academy.
