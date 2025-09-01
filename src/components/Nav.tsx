"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const links = [
    { href: "/", label: "Inicio" },
    { href: "/Presentation", label: "Presentación" },
    { href: "/Services", label: "Servicios" },
    { href: "/Formation", label: "Formación" },
    { href: "/Investigation", label: "Investigación" },
    { href: "/Speciality", label: "Especialidades" },
    { href: "/Events", label: "Eventos" },
    { href: "/Contact", label: "Contacto" },
    { href: "/chat", label: "Chat ROMI", cta: true },
];

export default function Nav() {
    const pathname = usePathname();

    return (
        <header className="sticky top-0 bg-white/90 backdrop-blur-sm shadow-sm z-50">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                <Link href="/" className="font-bold text-xl text-[#023E8A]">
                    ROMI
                </Link>
                <nav className="flex items-center gap-2 md:gap-4 text-sm">
                    {links.map((l) => {
                        const isActive = pathname === l.href;
                        const base =
                            "px-3 py-2 rounded-xl transition-colors";
                        const active = isActive
                            ? "text-[#023E8A] bg-[#CAF0F8]"
                            : "text-zinc-700 hover:text-[#023E8A]";
                        const cta = l.cta
                            ? "bg-[#00B4D8] text-white hover:bg-[#0096c7]"
                            : "";
                        return (
                            <Link
                                key={l.href}
                                href={l.href}
                                className={`${base} ${l.cta ? cta : active}`}
                            >
                                {l.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </header>
    );
}
