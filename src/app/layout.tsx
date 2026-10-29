import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import RegisterSW from "@/components/RegisterSW";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Labologics — Understand Your Labs",
  description:
    "Upload your medical reports and get an instant, plain-English summary powered by AI. For Pakistan labs — Chughtai, IDC and more. English + Urdu.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Labologics",
  },
  formatDetection: { telephone: false },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/apple-touch-icon.png",
  },
  openGraph: {
    title: "Labologics — Understand Your Labs",
    description:
      "AI lab report interpreter for Pakistan. Upload a Chughtai or IDC report and get a plain English + Urdu summary.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#0d9488",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={plusJakarta.variable}>
      <body className="bg-slate-50 font-sans antialiased">
        {/* Center the phone-app shell on desktop, full-bleed on mobile. */}
        <div className="mx-auto min-h-screen w-full max-w-[480px] bg-slate-50 shadow-none sm:shadow-xl">
          {children}
        </div>
        <RegisterSW />
      </body>
    </html>
  );
}
