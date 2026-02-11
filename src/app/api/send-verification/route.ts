import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Use admin client to bypass RLS for verification codes
function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    }

    const supabase = getAdminClient();
    const code = generateCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes

    // Delete any existing codes for this email
    await supabase
      .from("verification_codes")
      .delete()
      .eq("email", email.toLowerCase());

    // Store the new code
    const { error: insertError } = await supabase
      .from("verification_codes")
      .insert({
        email: email.toLowerCase(),
        code,
        expires_at: expiresAt,
      });

    if (insertError) {
      console.error("Error storing verification code:", insertError);
      return NextResponse.json(
        { error: "Error al generar código" },
        { status: 500 },
      );
    }

    // Send email with the code
    const { error } = await resend.emails.send({
      from: "Glamify Makeup <onboarding@resend.dev>",
      to: email,
      subject: "Tu código de verificación - Glamify Makeup",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #ec4899; margin: 0;">Glamify Makeup</h1>
          </div>
          
          <h2 style="color: #333; text-align: center;">Tu código de verificación</h2>
          
          <div style="background: #f8f8f8; border-radius: 10px; padding: 30px; text-align: center; margin: 20px 0;">
            <p style="font-size: 36px; font-weight: bold; color: #ec4899; letter-spacing: 8px; margin: 0;">
              ${code}
            </p>
          </div>
          
          <p style="color: #666; text-align: center;">
            Ingresá este código en la página de checkout para continuar con tu compra.
          </p>
          
          <p style="color: #999; text-align: center; font-size: 12px; margin-top: 30px;">
            Este código expira en 10 minutos.<br>
            Si no solicitaste este código, podés ignorar este email.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Error al enviar email" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending verification:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
