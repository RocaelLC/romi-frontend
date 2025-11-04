const TOKEN_KEY = "access_token";

export function setToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
    try {
      // Set a cookie so Next.js middleware can detect auth state on navigation
      // Non-HttpOnly cookie (client-set) – for production prefer server-set HttpOnly
      document.cookie = `access_token=${encodeURIComponent(token)}; Path=/; SameSite=Lax`;
    } catch {}
  }
}
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}
export function clearToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
    try {
      // Expire the access_token cookie
      document.cookie = `access_token=; Path=/; Max-Age=0; SameSite=Lax`;
    } catch {}
  }
}
/** Decodifica el payload del JWT (sin verificar firma) */
export function decodeJwt<T = any>(token: string): T | null {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, "=");
    const json =
      typeof window !== "undefined"
        ? decodeURIComponent(
            atob(padded)
              .split("")
              .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
              .join("")
          )
        : Buffer.from(padded, "base64").toString("utf8");
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}
