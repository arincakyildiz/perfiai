import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Inter } from "next/font/google";
import type { Locale } from "@/lib/translations";
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

export const metadata: Metadata = {
  title: "Perfiai – Premium Parfüm Keşif Platformu",
  description:
    "Doğal dil ile parfüm keşfet. AI destekli öneriler, 800+ parfüm. Lüks koku deneyimi.",
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
          <LanguageProvider initialLocale={locale}>
            <AnimatedBackground />
            <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
