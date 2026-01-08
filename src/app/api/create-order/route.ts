import { createClient } from "@/lib/supabase/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { NextRequest, NextResponse } from "next/server";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

interface OrderItem {
  product_id: string;
  variant_id: string | null;
  quantity: number;
  unit_price: number;
  product_name: string;
  variant_name?: string;
  product_image?: string;
}

interface CreateOrderRequest {
  customer_email: string;
  customer_name: string;
  customer_phone?: string;
  shipping_address: {
    full_name: string;
    phone?: string;
    street_address: string;
    apartment?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  items: OrderItem[];
  subtotal: number;
  shipping_cost: number;
  total: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateOrderRequest = await request.json();

    // Validate required fields
    if (!body.customer_email || !body.items?.length) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    const supabase = await createClient();

    // Generate order number
    const orderNumber = `GM-${Date.now().toString(36).toUpperCase()}`;

    // Create order in database
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        status: "pending",
        customer_email: body.customer_email,
        customer_name: body.customer_name,
        customer_phone: body.customer_phone,
        shipping_address: body.shipping_address,
        subtotal: body.subtotal,
        shipping_cost: body.shipping_cost,
        tax: 0,
        total: body.total,
        currency: "ARS",
      })
      .select()
      .single();

    if (orderError) {
      console.error("Error creating order:", orderError);
      return NextResponse.json(
        { error: "Error al crear el pedido" },
        { status: 500 }
      );
    }

    // Create order items
    const orderItems = body.items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      variant_id: item.variant_id,
      product_name: item.product_name,
      variant_name: item.variant_name,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.unit_price * item.quantity,
      product_image: item.product_image,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("Error creating order items:", itemsError);
    }

    // Create Mercado Pago preference
    const preference = new Preference(client);

    const preferenceData = await preference.create({
      body: {
        items: body.items.map((item) => ({
          id: item.product_id,
          title:
            item.product_name +
            (item.variant_name ? ` - ${item.variant_name}` : ""),
          quantity: item.quantity,
          unit_price: item.unit_price,
          currency_id: "ARS",
        })),
        shipments: {
          cost: body.shipping_cost,
          mode: "not_specified",
        },
        payer: {
          email: body.customer_email,
          name: body.customer_name,
          phone: body.customer_phone
            ? { number: body.customer_phone }
            : undefined,
        },
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?order=${order.id}`,
          failure: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/failure?order=${order.id}`,
          pending: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/pending?order=${order.id}`,
        },
        auto_return: "approved",
        external_reference: order.id,
        notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/mercadopago`,
      },
    });

    // Update order with MP preference ID
    await supabase
      .from("orders")
      .update({ mp_preference_id: preferenceData.id })
      .eq("id", order.id);

    return NextResponse.json({
      success: true,
      order_id: order.id,
      order_number: orderNumber,
      checkout_url: preferenceData.init_point,
    });
  } catch (error) {
    console.error("Error in create-order:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
