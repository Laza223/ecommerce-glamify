import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { storeConfig } from "@/config/store";
import {
  ExternalLink,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import Link from "next/link";

export default function AdminConfigPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configuración</h1>
        <p className="text-muted-foreground">Información de la tienda</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Datos del Negocio</CardTitle>
            <CardDescription>
              Información de contacto y ubicación
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{storeConfig.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">
                  Teléfono/WhatsApp
                </p>
                <p className="font-medium">{storeConfig.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Ubicación</p>
                <p className="font-medium">{storeConfig.city}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Redes Sociales</CardTitle>
            <CardDescription>Links a las redes de la tienda</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link
              href={storeConfig.social.instagram}
              target="_blank"
              className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted transition-colors"
            >
              <Instagram className="h-5 w-5 text-pink-600" />
              <span className="flex-1">Instagram</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </Link>
            <Link
              href={storeConfig.social.facebook}
              target="_blank"
              className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted transition-colors"
            >
              <Facebook className="h-5 w-5 text-blue-600" />
              <span className="flex-1">Facebook</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </Link>
            <Link
              href={storeConfig.social.tiktok}
              target="_blank"
              className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted transition-colors"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
              </svg>
              <span className="flex-1">TikTok</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </Link>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Configuración de Envíos</CardTitle>
            <CardDescription>Reglas de envío y costos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">
                  Envío gratis desde
                </p>
                <p className="text-2xl font-bold text-primary">
                  ${storeConfig.freeShippingThreshold.toLocaleString("es-AR")}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Solo para {storeConfig.freeShippingZone}
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">
                  Horario de atención
                </p>
                <p className="text-lg font-medium">
                  {storeConfig.businessHours}
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Para modificar estos valores, editá el archivo{" "}
              <code className="bg-muted px-1 rounded">src/config/store.ts</code>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
