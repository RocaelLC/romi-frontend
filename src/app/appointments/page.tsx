"use client";

import { useEffect, useState } from "react";
import { apiFetchAuth, endpoints } from "@/lib/api";
import { useRouter } from "next/navigation";
import { getToken, decodeJwt } from "@/lib/auth";

type Appointment = {
  id: string;
  patient: { id: string; email: string };
  scheduledAt: string;
  reason?: string | null;
  status: "PENDING" | "ACCEPTED" | "CANCELED" | "COMPLETED"; 
};

type JwtClaims = { sub?: string; roles?: string[]; doctorId?: string };

export default function DoctorAppointmentsPage() {
  const [items, setItems] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [doctorId, setDoctorId] = useState<string>("");
  const router = useRouter();

 type DoctorAppointmentsRes = Appointment[] | { items: Appointment[] };

const fetchData = async (docId: string) => {
  setLoading(true);
  const res = await apiFetchAuth<DoctorAppointmentsRes>(
    endpoints.appointments.byDoctor(docId)
  );
  const items = Array.isArray(res) ? res : (res.items ?? []);
  setItems(items);
  setLoading(false);
};

  // Resolver doctorId desde JWT o desde /auth/me
  useEffect(() => {
    (async () => {
      const token = getToken();
      const claims = token ? decodeJwt<JwtClaims>(token) : null;

      // Preferimos 'doctorId' si viene explícito en el JWT
      let id = claims?.doctorId;

      // Si no, usa 'sub' (si tu backend usa sub=doctorId) o consulta /auth/me
      if (!id) {
        if (claims?.sub) {
          id = claims.sub;
        } else {
          try {
            const me = await apiFetchAuth<{ id: string; roles?: string[] }>(endpoints.auth.me);
            id = me?.id;
          } catch {
            id = "";
          }
        }
      }

      if (id) {
        setDoctorId(id);
        fetchData(id);
      } else {
        setLoading(false);
      }
    })();
  }, []);

  const accept = async (id: string) => {
    await apiFetchAuth(endpoints.appointments.updateStatus(id), {
      method: "PUT",
      body: JSON.stringify({ status: "ACCEPTED" }),
      headers: { "Content-Type": "application/json" },
    });
    if (doctorId) fetchData(doctorId);
  };

  const cancel = async (id: string) => {
    await apiFetchAuth(endpoints.appointments.updateStatus(id), {
      method: "PUT",
      body: JSON.stringify({ status: "CANCELED" }),
      headers: { "Content-Type": "application/json" },
    });
    if (doctorId) fetchData(doctorId);
  };

  if (loading) return <p className="p-6">Loading appointments…</p>;

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My Appointments</h1>
        <button
          onClick={() => doctorId && fetchData(doctorId)}
          className="px-3 py-2 border rounded"
        >
          Refresh
        </button>
      </div>

      {items.length === 0 ? (
        <div className="p-6 border rounded">No appointments found.</div>
      ) : (
        <div className="overflow-x-auto border rounded">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3">Patient</th>
                <th className="text-left p-3">Date/Time</th>
                <th className="text-left p-3">Reason</th>
                <th className="text-left p-3">Status</th>
                <th className="text-right p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((ap) => (
                <tr key={ap.id} className="border-t">
                  <td className="p-3">{ap.patient?.email ?? "—"}</td>
                  <td className="p-3">
                    {new Date(ap.scheduledAt).toLocaleString()}
                  </td>
                  <td className="p-3">{ap.reason || "—"}</td>
                  <td className="p-3">{ap.status}</td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      disabled={ap.status !== "PENDING"}
                      onClick={() => accept(ap.id)}
                      className="px-3 py-1 rounded bg-black text-white disabled:opacity-40"
                    >
                      Accept
                    </button>
                    <button
                      disabled={
                        ap.status === "CANCELED" || ap.status === "COMPLETED"
                      }
                      onClick={() => cancel(ap.id)}
                      className="px-3 py-1 rounded border"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() =>
                        router.push(`/doctors/appointments/${ap.id}`)
                      }
                      className="px-3 py-1 rounded border"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
