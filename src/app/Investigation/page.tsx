export const metadata = { title: "ROMI — Investigación" };

export default function Page() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-14">
      <h1 className="text-3xl font-bold text-[#023E8A]">Investigación</h1>
      <p className="mt-2 text-zinc-600">
        Misión, visión, valores y el porqué de ROMI en el ecosistema de salud digital.
      </p>

      <section className="mt-10 grid md:grid-cols-3 gap-6">
        <div className="rounded-2xl border p-5">
          <h2 className="font-semibold">Misión</h2>
          <p className="text-sm text-zinc-600 mt-2">…</p>
        </div>
        <div className="rounded-2xl border p-5">
          <h2 className="font-semibold">Visión</h2>
          <p className="text-sm text-zinc-600 mt-2">…</p>
        </div>
        <div className="rounded-2xl border p-5">
          <h2 className="font-semibold">Valores</h2>
          <p className="text-sm text-zinc-600 mt-2">…</p>
        </div>
      </section>
    </main>
  );
}
