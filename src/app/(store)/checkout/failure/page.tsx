import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { XCircle } from "lucide-react";
import Link from "next/link";

export default function CheckoutFailurePage() {
  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <Card className="max-w-md w-full">
        <CardContent className="pt-8 pb-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6">
            <XCircle className="h-10 w-10 text-red-600" />
          </div>

          <h1 className="text-2xl font-bold text-red-600 mb-2">
            Pago no procesado
          </h1>

          <p className="text-muted-foreground mb-6">
            Hubo un problema con el pago. No se realizó ningún cargo a tu
            cuenta.
          </p>

          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/checkout">Intentar de nuevo</Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/carrito">Volver al carrito</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
