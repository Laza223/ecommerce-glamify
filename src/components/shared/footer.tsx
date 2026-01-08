import { storeConfig } from "@/config/store";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo-glamify-makeup.jpeg"
                alt={storeConfig.name}
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className="text-xl font-bold">
                <span className="text-foreground">Glamify</span>
                <span className="text-primary"> Makeup</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              {storeConfig.description}. Los mejores productos de maquillaje
              para realzar tu belleza natural.
            </p>
            <div className="flex gap-4">
              <a
                href={storeConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={storeConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Tienda</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/productos"
                  className="text-muted-foreground hover:text-primary"
                >
                  Todos los Productos
                </Link>
              </li>
              <li>
                <Link
                  href="/productos?ofertas=true"
                  className="text-muted-foreground hover:text-primary"
                >
                  Ofertas
                </Link>
              </li>
              <li>
                <Link
                  href="/productos?nuevos=true"
                  className="text-muted-foreground hover:text-primary"
                >
                  Nuevos Ingresos
                </Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div className="space-y-4">
            <h3 className="font-semibold">Información</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/sobre-nosotros"
                  className="text-muted-foreground hover:text-primary"
                >
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link
                  href="/envios"
                  className="text-muted-foreground hover:text-primary"
                >
                  Envíos
                </Link>
              </li>
              <li>
                <Link
                  href="/devoluciones"
                  className="text-muted-foreground hover:text-primary"
                >
                  Devoluciones
                </Link>
              </li>
              <li>
                <Link
                  href="/terminos"
                  className="text-muted-foreground hover:text-primary"
                >
                  Términos y Condiciones
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4" id="contacto">
            <h3 className="font-semibold">Contacto</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                {storeConfig.email}
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                {storeConfig.phone}
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                {storeConfig.city}
              </li>
            </ul>
            <p className="text-xs text-muted-foreground">
              {storeConfig.businessHours}
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 text-center text-sm text-muted-foreground md:flex-row">
          <p>
            © {new Date().getFullYear()} {storeConfig.name}. Todos los derechos
            reservados.
          </p>
          <div className="flex gap-4">
            <Link href="/privacidad" className="hover:text-primary">
              Privacidad
            </Link>
            <Link href="/terminos" className="hover:text-primary">
              Términos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
