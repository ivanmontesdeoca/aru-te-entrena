import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aru te entrena",
  description: "Gestión de entrenamientos personalizados",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
