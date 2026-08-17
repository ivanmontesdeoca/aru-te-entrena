import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-poppins", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Aru te entrena", template: "%s · Aru te entrena" },
  description: "Gestión de entrenamientos personalizados",
  icons: { icon: "/brand/isotipo-estudio-axis.png", apple: "/brand/isotipo-estudio-axis.png" },
};

export const runtime = "nodejs";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html className={poppins.variable} lang="es">
      <body>{children}</body>
    </html>
  );
}
