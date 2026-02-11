import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// Use admin client to bypass RLS for verification codes
function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email y código son requeridos" },
        { status: 400 },
      );
    }

    const supabase = getAdminClient();

    // Find the verification code
    const { data: stored, error: fetchError } = await supabase
      .from("verification_codes")
      .select("*")
      .eq("email", email.toLowerCase())
      .eq("used", false)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (fetchError || !stored) {
      return NextResponse.json(
        { error: "Código no encontrado. Pedí uno nuevo." },
        { status: 400 },
      );
    }

    // Check expiration
    if (new Date() > new Date(stored.expires_at)) {
      // Delete expired code
      await supabase.from("verification_codes").delete().eq("id", stored.id);

      return NextResponse.json(
        { error: "Código expirado. Pedí uno nuevo." },
        { status: 400 },
      );
    }

    // Check code match
    if (stored.code !== code) {
      return NextResponse.json({ error: "Código incorrecto" }, { status: 400 });
    }

    // Mark as used and delete
    await supabase.from("verification_codes").delete().eq("id", stored.id);

    return NextResponse.json({ success: true, verified: true });
  } catch (error) {
    console.error("Error verifying code:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
