"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface OrderStatusSelectProps {
  orderId: string;
  currentStatus: string;
}

const statuses = [
  { value: "pending", label: "Pendiente", description: "Esperando pago" },
  { value: "paid", label: "Pagado", description: "Pago confirmado" },
  { value: "shipped", label: "Enviado", description: "En camino" },
  {
    value: "delivered",
    label: "Entregado",
    description: "Recibido por cliente",
  },
  { value: "cancelled", label: "Cancelado", description: "Pedido cancelado" },
];

export function OrderStatusSelect({
  orderId,
  currentStatus,
}: OrderStatusSelectProps) {
  const [status, setStatus] = useState(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) throw error;

      setStatus(newStatus);
      toast.success("Estado actualizado");
      router.refresh();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Error desconocido";
      toast.error("Error al actualizar", { description: message });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Select
      value={status}
      onValueChange={handleStatusChange}
      disabled={isUpdating}
    >
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {statuses.map((s) => (
          <SelectItem key={s.value} value={s.value}>
            <div>
              <p className="font-medium">{s.label}</p>
              <p className="text-xs text-muted-foreground">{s.description}</p>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
