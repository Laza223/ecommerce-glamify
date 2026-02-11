// lib/supabase-admin.ts
import { createClient } from "@supabase/supabase-js";

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
}

/**
 * Supabase Admin Client - USE WITH CAUTION
 * This bypasses RLS and should only be used in secure server-side contexts
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}

/**
 * Verificar si el usuario actual es admin
 */
export async function checkIsAdmin(userId: string): Promise<boolean> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  return !error && data?.role === "admin";
}

/**
 * Wrapper para acciones de admin
 */
export async function withAdmin<T>(
  userId: string | undefined,
  action: (supabase: ReturnType<typeof createAdminClient>) => Promise<T>,
): Promise<T> {
  if (!userId) {
    throw new Error("No autorizado: Usuario no autenticado");
  }

  const isAdmin = await checkIsAdmin(userId);

  if (!isAdmin) {
    throw new Error("No autorizado: No eres administrador");
  }

  const supabase = createAdminClient();
  return action(supabase);
}
