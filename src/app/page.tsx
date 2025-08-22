import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen">
      <header className="sticky top-0 bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="font-bold text-xl text-[#023E8A]">ROMI</div>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/"> Home </Link>
            <Link href="/chat" className="px-4 py-2 rounded-xl bg-[#00B4D8] text-white">
              Iniciar Chat
            </Link>
            <Link href="/AboutUs">Sobre nosotros </Link> 
          </nav>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#023E8A]">
            Tu asistente médico virtual, <span className="text-[#00B4D8]">siempre cerca</span>
          </h1>
          <p className="mt-4 text-zinc-600">
            Orientación segura, recordatorios y conexión con profesionales.
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
