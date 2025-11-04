"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetch, apiFetchAuth, endpoints } from "@/lib/api"; // ⬅️ importa ambos
import { useAuth } from "@/app/Auth/contexts/AuthContext";
import { decodeJwt, setToken } from "@/lib/auth";

const schema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  remember: z.boolean().optional(),
});
type FormData = z.infer<typeof schema>;
type JwtClaims = { sub?: string; roles?: string[]; email?: string };

function mapRoleToRoute(roles?: string[] | null): string | null {
  const up = (roles ?? []).map((r) => String(r).toUpperCase());
  if (up.includes("DOCTOR"))  return "/doctor/appointments?filter=pending,confirmed";
  if (up.includes("PATIENT")) return "/doctores";
  return null;
}

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { login } = useAuth();

  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } =
    useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { remember: true } });

  async function onSubmit(data: FormData) {
    try {
      console.log("[Login] enviando credenciales...", data.email);

      //  LOGIN con apiFetch (SIN Authorization)
      const res = await apiFetch<{ access_token: string }>(endpoints.auth.login, {
        method: "POST",
        body: JSON.stringify({ email: data.email, password: data.password }),
      });

      console.log("[Login] token recibido", !!res?.access_token);
      setToken(res.access_token);
      login(res.access_token); // marca autenticado en el contexto

      const claims = decodeJwt<JwtClaims>(res.access_token) || {};
      console.log("[Login] claims:", claims);

      // intenta rol desde el token:
      let target = mapRoleToRoute(claims.roles ?? null);

      // si no hay roles en el token, consulta /auth/me con apiFetchAuth 
      if (!target) {
        try {
          const me = await apiFetchAuth<{ roles?: string[] }>(endpoints.auth.me);
          console.log("[Login] /auth/me ->", me);
          target = mapRoleToRoute(me?.roles ?? null);
        } catch (meErr) {
          console.warn("[Login] no se pudo consultar /auth/me", meErr);
        }
      }

      const next = params.get("next");
      const finalTarget = next || target || "/doctor/appointments?filter=pending,confirmed";
      console.log("[Login] redirigiendo a:", finalTarget);
      router.replace(finalTarget);
    } catch (err: any) {
      console.error("[Login] Error al iniciar sesión:", err);
      const message =
        err?.data?.message?.[0] ||
        err?.data?.message ||
        err?.message ||
        "Correo o contraseña incorrectos.";
      setError("root", { message });
    }
  }




  return (
    <div className="mx-auto max-w-md py-10">
      <h1 className="text-2xl font-semibold mb-1">Iniciar sesión</h1>
      <p className="text-sm text-muted-foreground mb-6">Accede con tu cuenta de ROMI</p>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
        <input type="email" placeholder="Correo" className="border p-2 rounded" {...register("email")} />
        {errors.email && <small className="text-red-600">{errors.email.message}</small>}

        <input type="password" placeholder="Contraseña" className="border p-2 rounded" {...register("password")} />
        {errors.password && <small className="text-red-600">{errors.password.message}</small>}

        {errors.root && <p className="rounded-md bg-red-50 p-3 text-sm text-red-600">{errors.root.message}</p>}

        <button
          type="submit"
          className="bg-cyan-700 text-white py-2 rounded mt-2 hover:bg-cyan-800"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <p className="text-sm text-muted-foreground mt-4">
        ¿No tienes cuenta?{" "}
        <Link href="/Auth/Login/Register" className="text-cyan-700 hover:underline">
          Crear cuenta
        </Link>
      </p>
    </div>
  );
 }

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-6">Cargando…</div>}>
      <LoginInner />
    </Suspense>
  );
}
