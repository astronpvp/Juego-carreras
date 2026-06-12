import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Carrera Trivial",
  description: "Juego de carreras online con preguntas tipo trivial",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}