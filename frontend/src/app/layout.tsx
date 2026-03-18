import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Inter } from "next/font/google";
import type { Locale } from "@/lib/translations";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://perfiai.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Perfiai – Premium Parfüm Keşif Platformu",
    template: "%s | Perfiai",
  },
  description:
    "Doğal dil ile parfüm keşfet. AI destekli öneriler, 3000+ parfüm. Lüks koku deneyimi.",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: siteUrl,
    siteName: "Perfiai",
    title: "Perfiai – Premium Parfüm Keşif Platformu",
    description: "AI destekli parfüm keşfi. 3000+ parfüm arasından doğal dil ile ara.",
    images: [{ url: "/logo.png", width: 512, height: 512, alt: "Perfiai" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Perfiai – Premium Parfüm Keşif",
    description: "AI destekli parfüm keşfi. 3000+ parfüm.",
  },
  robots: { index: true, follow: true },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "tr";
  const theme = (cookieStore.get("theme")?.value as "dark" | "light") || "dark";

  return (
    <html lang={locale} className={theme} suppressHydrationWarning>
      <body className={`${inter.variable} min-h-screen font-sans antialiased`}>
        <ThemeProvider initialTheme={theme}>
          <AuthProvider>
            <LanguageProvider initialLocale={locale}>
            <AnimatedBackground />
            <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            </LanguageProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
