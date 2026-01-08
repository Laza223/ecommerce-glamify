import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <Card className="max-w-md w-full">
        <CardContent className="pt-8 pb-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>

          <h1 className="text-2xl font-bold text-green-600 mb-2">
            ¡Pago confirmado!
          </h1>

          <p className="text-muted-foreground mb-6">
            Gracias por tu compra. Te enviamos un email con los detalles de tu
            pedido.
          </p>

          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/productos">Seguir comprando</Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/">Volver al inicio</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
