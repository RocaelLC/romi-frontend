"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Heart } from "lucide-react";
import { useAuth } from "@/app/Auth/contexts/AuthContext";

const LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/Presentation", label: "Presentación" },
  { href: "/Services", label: "Servicios" },
  { href: "/Formation", label: "Formación" },
  { href: "/Investigation", label: "Investigación" },
  { href: "/Speciality", label: "Especialidades" },
  { href: "/Events", label: "Eventos" },
  { href: "/Contact", label: "Contacto" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const isLoggedIn = !!user;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  const handleLogout = () => {
    logout();
    setOpen(false);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 backdrop-blur bg-white/70 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center gap-4">
          <Link href="/" className="font-bold text-xl tracking-tight text-primary">
            <div className="flex items-center">
              <Heart className="h-6 w-6 text-indigo-600" />
              <h1 className="text-2xl text-zinc-900 font-semibold">ROMI</h1>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 py-1.5 rounded-full text-sm transition ${
                  isActive(l.href)
                    ? "bg-cyan-100 text-cyan-700"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="flex-1" />

          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/chat"
              className="px-3 py-1.5 rounded-full bg-cyan-500 text-white text-sm hover:bg-cyan-600"
            >
              Chat ROMI
            </Link>

            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-full text-sm border hover:bg-muted"
              >
                Cerrar sesión
              </button>
            ) : (
              <Link
                href="/Auth/Login"
                className="px-3 py-1.5 rounded-full text-sm border hover:bg-muted"
              >
                Iniciar sesión
              </Link>
            )}
          </div>

          <button
            className="md:hidden ml-auto p-2 rounded hover:bg-muted"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {open && (
          <div className="md:hidden border-t border-border bg-white/80 backdrop-blur">
            <div className="px-4 py-3 flex flex-col gap-1">
              {LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`px-3 py-2 rounded-md text-sm transition ${
                    isActive(l.href)
                      ? "bg-cyan-100 text-cyan-700"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {l.label}
                </Link>
              ))}

              <div className="h-2" />
              <Link
                href="/chat"
                onClick={() => setOpen(false)}
                className="px-3 py-2 rounded-md bg-cyan-500 text-white text-sm text-center hover:bg-cyan-600"
              >
                Chat ROMI
              </Link>

              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="mt-1 px-3 py-2 rounded-md text-sm border hover:bg-muted"
                >
                  Cerrar sesión
                </button>
              ) : (
                <Link
                  href="/Auth/Login"
                  onClick={() => setOpen(false)}
                  className="mt-1 px-3 py-2 rounded-md text-sm border text-center hover:bg-muted"
                >
                  Iniciar sesión
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
      <div className="h-2" />
    </>
  );
}
