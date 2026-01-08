import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Store verification codes in memory (in production, use Redis or similar)
// This is a Map<email, { code: string, expires: number }>
declare global {
  var verificationCodes: Map<string, { code: string; expires: number }>;
}

if (!global.verificationCodes) {
  global.verificationCodes = new Map();
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

    // Generate 6-digit code
    const code = generateCode();
    const expires = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store the code
    global.verificationCodes.set(email.toLowerCase(), { code, expires });

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
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending verification:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
