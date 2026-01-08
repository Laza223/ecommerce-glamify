import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Mercado Pago sends different notification types
    if (body.type !== "payment") {
      return NextResponse.json({ received: true });
    }

    const paymentId = body.data?.id;
    if (!paymentId) {
      return NextResponse.json({ error: "No payment ID" }, { status: 400 });
    }

    // Fetch payment details from Mercado Pago
    const mpResponse = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        },
      }
    );

    if (!mpResponse.ok) {
      console.error("Error fetching payment:", await mpResponse.text());
      return NextResponse.json(
        { error: "Error fetching payment" },
        { status: 500 }
      );
    }

    const payment = await mpResponse.json();
    const orderId = payment.external_reference;
    const status = payment.status;

    if (!orderId) {
      return NextResponse.json(
        { error: "No order reference" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Map MP status to our status
    let orderStatus = "pending";
    if (status === "approved") {
      orderStatus = "paid";
    } else if (status === "rejected" || status === "cancelled") {
      orderStatus = "cancelled";
    }

    // Update order status
    const { data: order, error } = await supabase
      .from("orders")
      .update({
        status: orderStatus,
        mp_payment_id: paymentId.toString(),
        mp_status: status,
      })
      .eq("id", orderId)
      .select(
        `
        *,
        order_items(*)
      `
      )
      .single();

    if (error) {
      console.error("Error updating order:", error);
      return NextResponse.json(
        { error: "Error updating order" },
        { status: 500 }
      );
    }

    // Send confirmation email if payment approved
    if (status === "approved" && order) {
      const shippingAddress = order.shipping_address as {
        full_name: string;
        street_address: string;
        apartment?: string;
        city: string;
        state: string;
        postal_code: string;
      };

      await resend.emails.send({
        from: "Glamify Makeup <onboarding@resend.dev>",
        to: order.customer_email,
        subject: `¡Gracias por tu compra! - Pedido #${order.order_number}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #ec4899; margin: 0;">Glamify Makeup</h1>
            </div>
            
            <h2 style="color: #333;">¡Gracias por tu compra, ${
              order.customer_name
            }!</h2>
            
            <p style="color: #666;">Tu pedido <strong>#${
              order.order_number
            }</strong> fue confirmado y está siendo preparado.</p>
            
            <div style="background: #f8f8f8; border-radius: 10px; padding: 20px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #333;">Resumen del pedido</h3>
              
              ${order.order_items
                ?.map(
                  (item: {
                    product_name: string;
                    variant_name?: string;
                    quantity: number;
                    unit_price: number;
                  }) => `
                <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee;">
                  <span>${item.product_name}${
                    item.variant_name ? ` - ${item.variant_name}` : ""
                  } x${item.quantity}</span>
                  <span style="font-weight: bold;">$${(
                    item.unit_price * item.quantity
                  ).toLocaleString("es-AR")}</span>
                </div>
              `
                )
                .join("")}
              
              <div style="display: flex; justify-content: space-between; padding: 10px 0;">
                <span>Envío</span>
                <span>${
                  order.shipping_cost === 0
                    ? "Gratis"
                    : `$${order.shipping_cost.toLocaleString("es-AR")}`
                }</span>
              </div>
              
              <div style="display: flex; justify-content: space-between; padding: 15px 0; border-top: 2px solid #ec4899; font-size: 18px; font-weight: bold;">
                <span>Total</span>
                <span style="color: #ec4899;">$${order.total.toLocaleString(
                  "es-AR"
                )}</span>
              </div>
            </div>
            
            <div style="background: #fff5f7; border-radius: 10px; padding: 20px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #333;">Dirección de envío</h3>
              <p style="color: #666; margin: 0;">
                ${shippingAddress.full_name}<br>
                ${shippingAddress.street_address}${
          shippingAddress.apartment ? `, ${shippingAddress.apartment}` : ""
        }<br>
                ${shippingAddress.city}, ${shippingAddress.state} ${
          shippingAddress.postal_code
        }
              </p>
            </div>
            
            <p style="color: #666;">Te enviaremos otro email cuando tu pedido sea despachado con el número de seguimiento.</p>
            
            <p style="color: #999; font-size: 12px; text-align: center; margin-top: 40px;">
              Si tenés alguna pregunta, respondé a este email o contactanos por WhatsApp.
            </p>
          </div>
        `,
      });
    }

    return NextResponse.json({ received: true, status: orderStatus });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
