import { storeConfig } from "@/config/store";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Términos y Condiciones",
};

export default function TerminosPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">Términos y Condiciones</h1>

      <div className="prose prose-neutral max-w-none space-y-6 text-muted-foreground">
        <p className="text-sm">
          Última actualización: {new Date().toLocaleDateString("es-AR")}
        </p>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            1. Información General
          </h2>
          <p>
            Bienvenido/a a {storeConfig.name}. Al acceder y utilizar este sitio
            web, aceptás estos términos y condiciones en su totalidad. Si no
            estás de acuerdo con estos términos, por favor no utilices nuestro
            sitio.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            2. Productos y Precios
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Los precios están expresados en Pesos Argentinos (ARS) e incluyen
              IVA.
            </li>
            <li>
              Nos reservamos el derecho de modificar precios sin previo aviso.
            </li>
            <li>
              Las imágenes de los productos son ilustrativas y pueden variar
              levemente.
            </li>
            <li>
              La disponibilidad de productos está sujeta a stock existente.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            3. Compras y Pagos
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Las compras se procesan a través de Mercado Pago, plataforma
              segura de pagos.
            </li>
            <li>
              Una vez confirmado el pago, recibirás un email de confirmación.
            </li>
            <li>El pedido se preparará una vez acreditado el pago.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">4. Envíos</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Realizamos envíos a todo el país a través de correo o mensajería.
            </li>
            <li>
              Los tiempos de entrega son estimativos y pueden variar según la
              zona.
            </li>
            <li>
              El envío es gratuito en compras mayores a $
              {storeConfig.freeShippingThreshold.toLocaleString("es-AR")}.
            </li>
            <li>
              Una vez despachado, recibirás el número de seguimiento por email.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            5. Devoluciones y Cambios
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Aceptamos devoluciones dentro de los 10 días de recibido el
              producto.
            </li>
            <li>
              El producto debe estar sin usar, en su empaque original y en
              perfectas condiciones.
            </li>
            <li>
              Los costos de envío de la devolución corren por cuenta del
              comprador, salvo que el producto tenga defectos.
            </li>
            <li>
              Para iniciar una devolución, contactanos a {storeConfig.email}.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            6. Uso del Sitio
          </h2>
          <p>
            El usuario se compromete a utilizar el sitio de manera responsable y
            a no realizar actividades que puedan dañar, inutilizar o sobrecargar
            el sitio.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            7. Propiedad Intelectual
          </h2>
          <p>
            Todo el contenido del sitio (textos, imágenes, logos) es propiedad
            de {storeConfig.name}y está protegido por las leyes de propiedad
            intelectual.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">8. Contacto</h2>
          <p>
            Para cualquier consulta sobre estos términos, podés contactarnos a:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Email: {storeConfig.email}</li>
            <li>Teléfono: {storeConfig.phone}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            9. Modificaciones
          </h2>
          <p>
            Nos reservamos el derecho de modificar estos términos en cualquier
            momento. Los cambios entrarán en vigencia desde su publicación en el
            sitio.
          </p>
        </section>
      </div>

      <div className="mt-12 text-center">
        <Link href="/" className="text-primary hover:underline">
          ← Volver al inicio
        </Link>
      </div>
    </div>
  );
}
