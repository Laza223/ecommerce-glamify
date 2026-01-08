import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email y código son requeridos" },
        { status: 400 }
      );
    }

    const stored = global.verificationCodes?.get(email.toLowerCase());

    if (!stored) {
      return NextResponse.json(
        { error: "Código no encontrado. Pedí uno nuevo." },
        { status: 400 }
      );
    }

    if (Date.now() > stored.expires) {
      global.verificationCodes.delete(email.toLowerCase());
      return NextResponse.json(
        { error: "Código expirado. Pedí uno nuevo." },
        { status: 400 }
      );
    }

    if (stored.code !== code) {
      return NextResponse.json({ error: "Código incorrecto" }, { status: 400 });
    }

    // Code is valid - remove it so it can't be reused
    global.verificationCodes.delete(email.toLowerCase());

    return NextResponse.json({ success: true, verified: true });
  } catch (error) {
    console.error("Error verifying code:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
