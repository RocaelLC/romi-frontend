// src/lib/api.ts
import { getToken } from "@/lib/auth";

// Allow either var and fallback if empty string
export const API_BASE =
  (process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL.trim()) ||
  (process.env.NEXT_PUBLIC_API_BASE && process.env.NEXT_PUBLIC_API_BASE.trim()) ||
  "http://localhost:3001";

// Centralized API endpoints used across the app
export const endpoints = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    me: "/auth/me",
  },
  users: {
    listDoctors: "/users/doctors",
  },
  appointments: {
    create: "/appointments",
    byDoctor: (doctorId: string) => `/appointments/doctor/${doctorId}`,
    byId: (id: string) => `/appointments/${id}`,
    updateStatus: (id: string) => `/appointments/${id}/status`,
  },
} as const;

// --- 🔧 Fix: use buildUrl for both functions ---
function buildUrl(input: string) {
  if (input.startsWith("http")) return input;
  const base = API_BASE.replace(/\/+$/, "");
  const path = input.startsWith("/") ? input : `/${input}`;
  return `${base}${path}`;
}

// Public fetch (no Authorization header)
export async function apiFetch<T>(input: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers as HeadersInit);
  if (!headers.has("Content-Type") && init.body) headers.set("Content-Type", "application/json");

  const url = buildUrl(input);

  if (process.env.NODE_ENV !== "production") {
    console.log("[apiFetch]", { url, method: (init.method || "GET").toUpperCase() });
  }

  const res = await fetch(url, { ...init, headers, cache: "no-store" });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || res.statusText);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export async function apiFetchAuth<T>(input: string, init: RequestInit = {}): Promise<T> {
  // usa tu helper centralizado (puede leer de cookie o localStorage)
  const token = getToken(); // <--- USA getToken()

  const url = buildUrl(input);

  if (process.env.NODE_ENV !== "production") {
    console.log("[apiFetchAuth]", { url, method: (init.method || "GET").toUpperCase(), hasToken: !!token });
  }

  const headers = new Headers(init.headers as HeadersInit);
  if (!headers.has("Content-Type") && init.body) headers.set("Content-Type", "application/json");
  if (token && !headers.has("Authorization")) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(url, {
    ...init,
    headers,
    // si usas cookies httpOnly en el backend, descomenta la línea siguiente:
    // credentials: "include",
  });
  if (res.status === 401) {
  if (typeof window !== "undefined") {
    const next = encodeURIComponent(window.location.pathname + window.location.search);
    window.location.href = `/Auth/Login?next=${next}`;
  }
  throw new Error("No autorizado");
} 

  const text = await res.text().catch(() => "");
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch { /* ignore */ }

  if (!res.ok) {
    const msg = data?.message || data?.error || text || `HTTP ${res.status}`;
    throw new Error(Array.isArray(msg) ? msg.join(", ") : msg);
  }
  return data as T;
}