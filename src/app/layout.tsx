import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/app-context";
import { Navbar } from "@/components/navbar";
import { Toast } from "@/components/toast";
import { Modals } from "@/components/modals";
import { DemoSwitcher } from "@/components/demo-switcher";
import { MobileNav } from "@/components/mobile-nav";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Vallas by Kory — Renta vallas digitales en minutos",
  description:
    "Busca, compara y reserva pantallas LED por campaña. Tu anuncio al aire en 24 horas, sin intermediarios.",
  icons: { icon: "/assets/kory-mark.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${geistMono.variable} antialiased`}>
        <AppProvider>
          <div className="flex min-h-screen flex-col pb-16 md:pb-0">
            <Navbar />
            {children}
          </div>
          <Modals />
          <Toast />
          <DemoSwitcher />
          <MobileNav />
        </AppProvider>
      </body>
    </html>
  );
}
