import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "ROMI — Virtual Health Assistant",
  description: "Safe guidance and reminders.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-[#F5F5F5] text-zinc-900">{children}</body>
    </html>
  );
}
