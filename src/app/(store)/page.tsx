import { ProductCard } from "@/components/store/product-card";
import { Button } from "@/components/ui/button";
import { storeConfig } from "@/config/store";
import type { Category, Product } from "@/types";
import { ArrowRight, Shield, Sparkles, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Mock data - will be replaced with Supabase queries
const mockCategories: Category[] = [
  {
    id: "1",
    name: "Labiales",
    slug: "labiales",
    description: "Los mejores labiales",
    image_url:
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400",
    is_active: true,
    display_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Bases",
    slug: "bases",
    description: "Bases y correctores",
    image_url:
      "https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=400",
    is_active: true,
    display_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Ojos",
    slug: "ojos",
    description: "Maquillaje para ojos",
    image_url:
      "https://images.unsplash.com/photo-1583241800698-e8ab01830a07?w=400",
    is_active: true,
    display_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Brochas",
    slug: "brochas",
    description: "Sets de brochas",
    image_url:
      "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=400",
    is_active: true,
    display_order: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const mockProducts: Product[] = [
  {
    id: "1",
    category_id: "1",
    name: "Labial Matte Velvet Rose",
    slug: "labial-matte-velvet-rose",
    description: "Labial de larga duración",
    price: 4500,
    compare_at_price: 5500,
    cost_per_item: null,
    sku: "LAB-001",
    barcode: null,
    stock: 15,
    low_stock_threshold: 5,
    images: [
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400",
    ],
    is_active: true,
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: mockCategories[0],
  },
  {
    id: "2",
    category_id: "2",
    name: "Base Líquida Full Coverage",
    slug: "base-liquida-full-coverage",
    description: "Cobertura total",
    price: 8900,
    compare_at_price: null,
    cost_per_item: null,
    sku: "BAS-001",
    barcode: null,
    stock: 20,
    low_stock_threshold: 5,
    images: [
      "https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=400",
    ],
    is_active: true,
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: mockCategories[1],
  },
  {
    id: "3",
    category_id: "3",
    name: "Paleta de Sombras Sunset",
    slug: "paleta-sombras-sunset",
    description: "12 tonos vibrantes",
    price: 12500,
    compare_at_price: 15000,
    cost_per_item: null,
    sku: "PAL-001",
    barcode: null,
    stock: 8,
    low_stock_threshold: 5,
    images: [
      "https://images.unsplash.com/photo-1583241800698-e8ab01830a07?w=400",
    ],
    is_active: true,
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: mockCategories[2],
  },
  {
    id: "4",
    category_id: "4",
    name: "Set de Brochas Profesional",
    slug: "set-brochas-profesional",
    description: "12 brochas premium",
    price: 18900,
    compare_at_price: null,
    cost_per_item: null,
    sku: "BRO-001",
    barcode: null,
    stock: 3,
    low_stock_threshold: 5,
    images: [
      "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=400",
    ],
    is_active: true,
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: mockCategories[3],
  },
];

const features = [
  {
    icon: Truck,
    title: "Envío Gratis",
    description: `En compras mayores a ${
      storeConfig.currencySymbol
    }${storeConfig.freeShippingThreshold.toLocaleString()}`,
  },
  {
    icon: Shield,
    title: "Pago Seguro",
    description: "Todas las transacciones protegidas",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-white to-accent">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        </div>

        <div className="container relative mx-auto px-4 py-20">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                <Sparkles className="h-4 w-4" />
                Nueva Colección Disponible
              </div>

              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Realzá tu
                <span className="text-gradient-pink"> Belleza Natural</span>
              </h1>

              <p className="max-w-lg text-lg text-muted-foreground">
                Descubrí nuestra colección exclusiva de maquillaje. Productos de
                alta calidad para un look impecable todos los días.
              </p>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Button size="lg" className="shadow-pink" asChild>
                  <Link href="/productos">
                    Ver Productos
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/productos?ofertas=true">Ver Ofertas</Link>
                </Button>
              </div>
            </div>

            {/* Decorative gradient - Desktop only */}
            <div className="relative hidden lg:flex items-center justify-center">
              <div className="relative h-96 w-96">
                {/* Main gradient circle */}
                <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-gradient-to-br from-primary via-primary/60 to-primary/20 blur-3xl opacity-60" />
                {/* Secondary accent */}
                <div className="absolute bottom-10 left-10 h-40 w-40 rounded-full bg-gradient-to-tr from-secondary to-primary/30 blur-2xl opacity-50" />
                {/* Small highlight */}
                <div className="absolute right-20 bottom-20 h-24 w-24 rounded-full bg-white/40 blur-xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-y bg-muted/30 py-8">
        <div className="container mx-auto px-4">
          <div className="mx-auto flex max-w-2xl flex-col gap-6 sm:flex-row sm:justify-between">
            {features.map((feature) => (
              <div key={feature.title} className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{feature.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold lg:text-4xl">
              Explorá por <span className="text-primary">Categoría</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              Encontrá todo lo que necesitás para tu rutina de maquillaje
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
            {mockCategories.map((category) => (
              <Link
                key={category.id}
                href={`/productos?categoria=${category.slug}`}
                className="group relative aspect-[4/5] overflow-hidden rounded-2xl"
              >
                <Image
                  src={category.image_url || ""}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-bold text-white">
                    {category.name}
                  </h3>
                  <p className="mt-1 flex items-center text-sm text-white/80 transition-colors group-hover:text-primary">
                    Ver productos
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-muted/30 py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold lg:text-4xl">
                Productos <span className="text-primary">Destacados</span>
              </h2>
              <p className="mt-4 text-muted-foreground">
                Los favoritos de nuestras clientas
              </p>
            </div>
            <Button variant="outline" asChild className="hidden md:flex">
              <Link href="/productos">
                Ver todos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
            {mockProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Button asChild>
              <Link href="/productos">
                Ver todos los productos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-16 lg:py-24">
        <div className="absolute inset-0 bg-gradient-pink opacity-90" />
        <div className="absolute inset-0">
          <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
        </div>

        <div className="container relative mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-bold lg:text-4xl">
            ¿Lista para brillar?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">
            Suscribite a nuestro newsletter y recibí ofertas exclusivas y
            novedades antes que nadie.
          </p>
          <div className="mx-auto mt-8 flex max-w-md flex-col gap-4 sm:flex-row">
            <input
              type="email"
              placeholder="Tu email"
              className="flex-1 rounded-lg border-0 bg-white/20 px-4 py-3 text-white placeholder-white/70 backdrop-blur focus:outline-none focus:ring-2 focus:ring-white"
            />
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-primary hover:bg-white/90"
            >
              Suscribirme
            </Button>
          </div>
        </div>
      </section>

      {/* WhatsApp Button */}
      <a
        href={storeConfig.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110"
        aria-label="Contactar por WhatsApp"
      >
        <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </div>
  );
}
