// src/components/doctors/DoctorsHero.tsx
"use client";

import { ShieldCheck, Video, Clock3 } from "lucide-react";

export default function DoctorsHero() {
  return (
    <>
      {/* Banda superior con gradiente */}
      <section className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen 
                          bg-gradient-to-br from-indigo-700 via-violet-600 to-blue-600">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Telemedicina Avanzada
          </h1>
          <p className="mt-3 text-base md:text-lg opacity-90">
            Conecta con especialistas de primer nivel desde la comodidad de tu hogar.
            Consultas seguras, diagnósticos precisos y seguimiento personalizado.
          </p>

          {/* Badges */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/90 text-zinc-800
                              px-3 py-1.5 text-sm shadow-sm">
              <Video className="w-4 h-4 text-indigo-600" />
              Consultas HD
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/90 text-zinc-800
                              px-3 py-1.5 text-sm shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              100% Seguro
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/90 text-zinc-800
                              px-3 py-1.5 text-sm shadow-sm">
              <Clock3 className="w-4 h-4 text-violet-600" />
              24/7 Disponible
            </span>
          </div>
        </div>
      </section>

      {/* Título de sección */}
      <div className="mx-auto max-w-6xl px-4 pt-10">
        <h2 className="text-2xl md:text-3xl font-extrabold text-zinc-900 text-center">
          Encuentra tu Especialista
        </h2>
        <p className="mt-1 text-zinc-500 text-center">
          Selecciona la especialidad o busca por nombre/ciudad y elige con quién consultar.
        </p>
      </div>
    </>
  );
}
