import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "ROMI — Plataforma integral de atención médica digital",
  description:
    "Conectamos profesionales de la salud con tecnología avanzada para mejorar la atención al paciente.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-white text-zinc-900">
        <Nav />
        {children}
        <footer className="border-t mt-20">
          <div className="max-w-6xl mx-auto px-4 py-10 text-sm text-zinc-500">
            © {new Date().getFullYear()} ROMI — Todos los derechos reservados.
          </div>
        </footer>
      </body>
    </html>
  );
}
