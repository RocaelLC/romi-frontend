// src/app/(protected)/doctors/appointments/page.tsx
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiFetchAuth, endpoints } from "@/lib/api";
import { Check, X, CalendarDays, RefreshCw } from "lucide-react";

type AppointmentStatus = "PENDING" | "ACCEPTED" | "CANCELED" | "COMPLETED";
type Appointment = {
  id: string;
  scheduledAt: string;
  reason?: string | null;
  status: AppointmentStatus;
  patient?: { email?: string; fullName?: string };
};
type Me = { sub: string; roles: string[]; email: string };

const PAGE_SIZE = 10;

/* =============== helpers UI =============== */
function StatusPill({ value }: { value: AppointmentStatus }) {
  const map: Record<AppointmentStatus, string> = {
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    ACCEPTED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    CANCELED: "bg-zinc-100 text-zinc-600 border-zinc-200",
    COMPLETED: "bg-indigo-50 text-indigo-700 border-indigo-200",
  };
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs border ${map[value]}`}>
      {value}
    </span>
  );
}

function SkeletonRow() {
  return (
    <tr className="border-t">
      <td className="p-3"><div className="h-4 w-40 bg-zinc-100 animate-pulse rounded" /></td>
      <td className="p-3"><div className="h-4 w-44 bg-zinc-100 animate-pulse rounded" /></td>
      <td className="p-3"><div className="h-4 w-56 bg-zinc-100 animate-pulse rounded" /></td>
      <td className="p-3"><div className="h-5 w-20 bg-zinc-100 animate-pulse rounded-full" /></td>
      <td className="p-3 text-right"><div className="h-8 w-40 bg-zinc-100 animate-pulse rounded-lg ml-auto" /></td>
    </tr>
  );
}

export function formatWhen(iso: string) {
  const d = new Date(iso);
  const date = d.toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return { date, time };
}

/* =============== page =============== */
export default function AppointmentsPage() {
  const [doctorId, setDoctorId] = useState<string>("");
  const [items, setItems] = useState<Appointment[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [status, setStatus] = useState<"" | AppointmentStatus>("");
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [err, setErr] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const isoRange = useMemo(() => {
    const f = from ? new Date(`${from}T00:00:00`).toISOString() : undefined;
    const t = to ? new Date(`${to}T23:59:59`).toISOString() : undefined;
    return { f, t };
  }, [from, to]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const fetchMe = useCallback(async () => {
    const me = await apiFetchAuth<Me>(endpoints.auth.me);
    setDoctorId(me.sub);
  }, []);

  const load = useCallback(async () => {
    if (!doctorId) return;
    setLoading(true);
    setErr(null);
    try {
      const qs = new URLSearchParams();
      if (status) qs.set("status", status);
      if (isoRange.f && isoRange.t) {
        qs.set("from", isoRange.f);
        qs.set("to", isoRange.t);
      }
      qs.set("page", String(page));
      qs.set("size", String(PAGE_SIZE));

      const res = await apiFetchAuth<{ items: Appointment[]; total: number }>(
        `${endpoints.appointments.byDoctor(doctorId)}?${qs.toString()}`
      );
      setItems(res.items ?? []);
      setTotal(res.total ?? (res.items?.length ?? 0));
    } catch (e: any) {
      setErr(e?.message ?? "No se pudieron cargar las citas.");
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [doctorId, status, isoRange.f, isoRange.t, page]);

  useEffect(() => { fetchMe(); }, [fetchMe]);
  useEffect(() => { load(); }, [load]);

  /* =============== update status (optimista) =============== */
  async function updateStatus(id: string, next: "ACCEPTED" | "CANCELED") {
    // bloqueo del registro
    setBusyId(id);
    // snapshot previo
    const prev = items;
    // UI optimista
    setItems(prev.map(a => a.id === id ? { ...a, status: next } : a));
    try {
      await apiFetchAuth(endpoints.appointments.updateStatus(id), {
        method: "PUT",
        body: JSON.stringify({ status: next }),
      });
      // opcionalmente refrescar totales
      setTotal(t => t);
    } catch (e: any) {
      // rollback
      setItems(prev);
      alert(e?.message ?? "No fue posible actualizar el estado.");
    } finally {
      setBusyId(null);
    }
  }

  const canMovePrev = page > 1 && !loading;
  const canMoveNext = page < totalPages && !loading;

  return (
    <main className="max-w-6xl mx-auto p-6 space-y-6">
      <header className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold text-zinc-900">Mis Citas</h1>
        <button
          onClick={() => load()}
          className="ml-auto inline-flex items-center gap-2 px-3 py-2 rounded-lg border hover:bg-zinc-50"
          aria-label="Actualizar listado"
          title="Actualizar"
        >
          <RefreshCw className="w-4 h-4" />
          Actualizar
        </button>
      </header>

      {/* Filtros */}
      <section className="border rounded-xl bg-white p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-sm mb-1 text-zinc-700">Estado</label>
            <select
              className="w-full border rounded-lg px-3 py-2"
              value={status}
              onChange={(e) => { setStatus(e.target.value as any); setPage(1); }}
            >
              <option value="">Todos</option>
              <option value="PENDING">Pendiente</option>
              <option value="ACCEPTED">Aceptada</option>
              <option value="CANCELED">Cancelada</option>
              <option value="COMPLETED">Completada</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1 text-zinc-700">Desde</label>
            <input
              type="date"
              className="w-full border rounded-lg px-3 py-2"
              value={from}
              onChange={(e) => { setFrom(e.target.value); setPage(1); }}
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-zinc-700">Hasta</label>
            <input
              type="date"
              className="w-full border rounded-lg px-3 py-2"
              value={to}
              onChange={(e) => { setTo(e.target.value); setPage(1); }}
            />
          </div>
          <div className="hidden md:block self-end text-sm text-zinc-500">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />
              Rango afecta la búsqueda.
            </div>
          </div>
        </div>
      </section>

      {/* Tabla */}
      <section className="border rounded-xl bg-white overflow-hidden">
        {err && <div className="p-4 text-red-700 bg-red-50 border-b">{err}</div>}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 text-left">
              <tr>
                <th className="p-3 font-medium text-zinc-600">Paciente</th>
                <th className="p-3 font-medium text-zinc-600">Fecha/Hora</th>
                <th className="p-3 font-medium text-zinc-600">Motivo</th>
                <th className="p-3 font-medium text-zinc-600">Estado</th>
                <th className="p-3 font-medium text-right text-zinc-600">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <>
                  {Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)}
                </>
              )}

              {!loading && items.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-zinc-500">
                    No se encontraron citas para este filtro.
                  </td>
                </tr>
              )}

              {!loading && items.map((a) => {
                const { date, time } = formatWhen(a.scheduledAt);
                const disabled = busyId === a.id;
                return (
                  <tr key={a.id} className="border-t">
                    <td className="p-3">
                      {a.patient?.fullName || a.patient?.email || "Paciente"}
                    </td>
                    <td className="p-3">
                      <span className="capitalize">{date}</span>, {time}
                    </td>
                    <td className="p-3">{a.reason || "—"}</td>
                    <td className="p-3"><StatusPill value={a.status} /></td>
                    <td className="p-3">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => updateStatus(a.id, "CANCELED")}
                          disabled={disabled || a.status !== "PENDING"}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-white
                            ${disabled || a.status !== "PENDING" ? "bg-rose-300 cursor-not-allowed" : "bg-rose-600 hover:bg-rose-700"}`}
                          aria-label="Rechazar cita"
                          title="Rechazar"
                        >
                          <X className="w-4 h-4" /> Rechazar
                        </button>

                        <button
                          onClick={() => updateStatus(a.id, "ACCEPTED")}
                          disabled={disabled || a.status !== "PENDING"}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-white
                            ${disabled || a.status !== "PENDING" ? "bg-emerald-300 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700"}`}
                          aria-label="Aceptar cita"
                          title="Aceptar"
                        >
                          <Check className="w-4 h-4" /> Aceptar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Paginación */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-zinc-600">
          Total: {total} • Página {page} de {totalPages}
        </div>
        <div className="flex gap-2">
          <button
            className="px-3 py-2 border rounded-lg disabled:opacity-40"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={!canMovePrev}
          >
            Anterior
          </button>
          <button
            className="px-3 py-2 border rounded-lg disabled:opacity-40"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={!canMoveNext}
          >
            Siguiente
          </button>
        </div>
      </div>
    </main>
  );
}
