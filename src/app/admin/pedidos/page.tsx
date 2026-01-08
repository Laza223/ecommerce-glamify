import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { storeConfig } from "@/config/store";
import { createClient } from "@/lib/supabase/server";
import { Eye, ShoppingCart } from "lucide-react";
import Link from "next/link";

export default async function AdminOrdersPage() {
  const supabase = await createClient();

  const { data: orders, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      order_items(count)
    `
    )
    .order("created_at", { ascending: false });

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      {
        variant: "default" | "secondary" | "destructive" | "outline";
        label: string;
      }
    > = {
      pending: { variant: "secondary", label: "Pendiente" },
      paid: { variant: "default", label: "Pagado" },
      shipped: { variant: "outline", label: "Enviado" },
      delivered: { variant: "default", label: "Entregado" },
      cancelled: { variant: "destructive", label: "Cancelado" },
    };
    const config = variants[status] || { variant: "secondary", label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(storeConfig.locale, {
      style: "currency",
      currency: storeConfig.currency,
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Pedidos</h1>
        <p className="text-muted-foreground">
          Gestiona los pedidos de tus clientes
        </p>
      </div>

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">
              Error al cargar pedidos: {error.message}
            </p>
          </CardContent>
        </Card>
      )}

      {orders && orders.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No hay pedidos</h3>
            <p className="text-muted-foreground text-center mt-2">
              Cuando recibas tu primer pedido, aparecerá acá
            </p>
          </CardContent>
        </Card>
      )}

      {orders && orders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Listado de Pedidos</CardTitle>
            <CardDescription>{orders.length} pedidos recibidos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-sm text-muted-foreground">
                    <th className="pb-3 font-medium">Pedido</th>
                    <th className="pb-3 font-medium">Cliente</th>
                    <th className="pb-3 font-medium">Fecha</th>
                    <th className="pb-3 font-medium text-right">Total</th>
                    <th className="pb-3 font-medium text-center">Estado</th>
                    <th className="pb-3 font-medium text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b last:border-0">
                      <td className="py-4">
                        <p className="font-medium">#{order.order_number}</p>
                        <p className="text-xs text-muted-foreground">
                          {order.order_items?.[0]?.count || 0} productos
                        </p>
                      </td>
                      <td className="py-4">
                        <p className="font-medium">{order.customer_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {order.customer_email}
                        </p>
                      </td>
                      <td className="py-4 text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString(
                          "es-AR",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </td>
                      <td className="py-4 text-right font-medium">
                        {formatPrice(order.total)}
                      </td>
                      <td className="py-4 text-center">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="py-4">
                        <div className="flex justify-end">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/admin/pedidos/${order.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
