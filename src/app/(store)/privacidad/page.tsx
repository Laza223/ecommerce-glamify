import { storeConfig } from "@/config/store";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidad",
};

export default function PrivacidadPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">Política de Privacidad</h1>

      <div className="prose prose-neutral max-w-none space-y-6 text-muted-foreground">
        <p className="text-sm">
          Última actualización: {new Date().toLocaleDateString("es-AR")}
        </p>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            1. Información que Recopilamos
          </h2>
          <p>
            Cuando realizás una compra o te registrás en nuestro sitio,
            recopilamos:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Nombre completo</li>
            <li>Dirección de email</li>
            <li>Número de teléfono (opcional)</li>
            <li>Dirección de envío</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            2. Uso de la Información
          </h2>
          <p>Utilizamos tu información para:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Procesar y enviar tus pedidos</li>
            <li>Enviarte confirmaciones y actualizaciones de tu compra</li>
            <li>Responder tus consultas</li>
            <li>Mejorar nuestro servicio</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            3. Protección de Datos
          </h2>
          <p>
            Tu información personal está almacenada de forma segura. No
            compartimos, vendemos ni alquilamos tus datos personales a terceros,
            excepto cuando sea necesario para procesar tu pedido (ej: servicio
            de envío).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">4. Pagos</h2>
          <p>
            Los pagos se procesan a través de Mercado Pago. No almacenamos datos
            de tarjetas de crédito ni información financiera en nuestros
            servidores.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">5. Cookies</h2>
          <p>
            Utilizamos cookies para mejorar tu experiencia en el sitio, recordar
            tu carrito de compras y analizar el tráfico del sitio.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            6. Tus Derechos
          </h2>
          <p>Tenés derecho a:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Acceder a tus datos personales</li>
            <li>Solicitar la corrección de datos incorrectos</li>
            <li>Solicitar la eliminación de tus datos</li>
            <li>Darte de baja de comunicaciones comerciales</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">7. Contacto</h2>
          <p>
            Para ejercer tus derechos o realizar consultas sobre privacidad,
            contactanos a: {storeConfig.email}
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
