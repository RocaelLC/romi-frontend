import Link from "next/link";
 
export default function Home() {

  return (
    <main className="min-h-[70vh]">
      <section className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#023E8A]">
            Ayudando la medicina del mañana
          </h1>
          <h2 className="mt-3 text-xl">Plataforma integral de atención médica digital</h2>
          <p className="mt-4 text-zinc-600">
            Conectamos profesionales de la salud con tecnología avanzada para mejorar la atención al paciente.
          </p>
          <div className="mt-6">
            <Link href="/chat" className="px-5 py-3 rounded-xl bg-[#00B4D8] text-white">
              Hablar con ROMI ahora
            </Link>
          </div>
        </div>
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <p className="text-sm text-zinc-600">Demo</p>
          <ul className="mt-2 list-disc list-inside text-zinc-800 text-sm">
            <li>Chat web con consentimiento (luego)</li>
            <li>Hand-off humano (luego)</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
