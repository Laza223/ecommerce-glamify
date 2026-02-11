🚀 PR Completo: Refactoring Total de Glamify E-commerce
Te voy a crear un PR masivo con TODOS los archivos necesarios para transformar tu e-commerce en una aplicación production-ready.

📁 Estructura de Archivos del PR
text

glamify/
├── .env.local.example (NUEVO)
├── middleware.ts (NUEVO)
├── supabase/
│ └── migrations/
│ ├── 001_enable_rls.sql (NUEVO)
│ ├── 002_add_policies.sql (NUEVO)
│ └── 003_add_functions.sql (NUEVO)
├── lib/
│ ├── supabase-admin.ts (NUEVO)
│ ├── supabase-server.ts (NUEVO)
│ ├── rate-limit.ts (NUEVO)
│ ├── cloudinary.ts (NUEVO)
│ ├── validations.ts (NUEVO)
│ └── utils.ts (MODIFICADO)
├── types/
│ ├── database.ts (NUEVO)
│ └── index.ts (MODIFICADO)
├── hooks/
│ └── use-cart.ts (MODIFICADO)
├── components/
│ ├── ui/
│ │ ├── button.tsx (NUEVO)
│ │ ├── skeleton.tsx (NUEVO)
│ │ └── toast.tsx (NUEVO)
│ ├── products/
│ │ ├── product-card.tsx (MODIFICADO)
│ │ ├── add-to-cart-button.tsx (MODIFICADO)
│ │ └── product-grid-skeleton.tsx (NUEVO)
│ └── providers/
│ ├── cart-provider.tsx (MODIFICADO)
│ └── toast-provider.tsx (NUEVO)
├── app/
│ ├── layout.tsx (MODIFICADO)
│ ├── error.tsx (NUEVO)
│ ├── loading.tsx (NUEVO)
│ ├── (shop)/
│ │ ├── productos/
│ │ │ ├── page.tsx (MODIFICADO)
│ │ │ ├── loading.tsx (NUEVO)
│ │ │ └── [slug]/
│ │ │ └── page.tsx (MODIFICADO)
│ │ └── checkout/
│ │ └── page.tsx (MODIFICADO)
│ ├── admin/
│ │ ├── layout.tsx (MODIFICADO)
│ │ └── products/
│ │ └── actions.ts (MODIFICADO)
│ └── api/
│ ├── checkout/
│ │ └── route.ts (MODIFICADO)
│ └── webhooks/
│ └── mercadopago/
│ └── route.ts (MODIFICADO)
└── package.json (MODIFICADO)
🔧 PASO 1: Instalar Dependencias
JSON

// package.json
{
"name": "glamify",
"version": "0.2.0",
"private": true,
"scripts": {
"dev": "next dev",
"build": "next build",
"start": "next start",
"lint": "next lint",
"type-check": "tsc --noEmit",
"generate-types": "npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/database.ts"
},
"dependencies": {
"next": "14.0.3",
"react": "^18",
"react-dom": "^18",
"@supabase/supabase-js": "^2.39.0",
"@supabase/ssr": "^0.0.10",
"mercadopago": "^2.0.1",
"cloudinary": "^1.41.0",
"react-hot-toast": "^2.4.1",
"react-hook-form": "^7.48.2",
"@hookform/resolvers": "^3.3.2",
"zod": "^3.22.4",
"lucide-react": "^0.294.0",
"class-variance-authority": "^0.7.0",
"clsx": "^2.0.0",
"tailwind-merge": "^2.1.0",
"@radix-ui/react-dialog": "^1.0.5",
"@radix-ui/react-dropdown-menu": "^2.0.6",
"@radix-ui/react-checkbox": "^1.0.4",
"@radix-ui/react-label": "^2.0.2",
"slugify": "^1.6.6",
"nanoid": "^5.0.4"
},
"devDependencies": {
"typescript": "^5",
"@types/node": "^20",
"@types/react": "^18",
"@types/react-dom": "^18",
"autoprefixer": "^10.0.1",
"postcss": "^8",
"tailwindcss": "^3.3.0",
"eslint": "^8",
"eslint-config-next": "14.0.3"
}
}
🔧 PASO 2: Variables de Entorno
env

# .env.local.example

# ============================================

# SUPABASE

# ============================================

NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ============================================

# CLOUDINARY

# ============================================

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tu-cloud-name
CLOUDINARY_API_KEY=123456789
CLOUDINARY_API_SECRET=abcdefghijk
CLOUDINARY_UPLOAD_PRESET=glamify-products

# ============================================

# MERCADO PAGO

# ============================================

MERCADOPAGO_ACCESS_TOKEN=APP_USR-xxxxx
MERCADOPAGO_PUBLIC_KEY=APP_USR-xxxxx

# ============================================

# APP

# ============================================

NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Glamify
ADMIN_EMAIL=admin@glamify.com
🗄️ PASO 3: Migraciones de Supabase
SQL

-- supabase/migrations/001_enable_rls.sql

-- ============================================
-- HABILITAR RLS EN TODAS LAS TABLAS
-- ============================================

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CREAR FUNCIÓN HELPER PARA ADMINS
-- ============================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
RETURN EXISTS (
SELECT 1
FROM public.admins
WHERE id = auth.uid()
);
END;

$$
;

CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS
$$

DECLARE
user_role text;
BEGIN
SELECT role INTO user_role
FROM public.admins
WHERE id = auth.uid();

    IF user_role IS NOT NULL THEN
        RETURN user_role;
    END IF;

    IF auth.uid() IS NOT NULL THEN
        RETURN 'customer';
    END IF;

    RETURN 'anonymous';

END;

$$
;
SQL

-- supabase/migrations/002_add_policies.sql

-- ============================================
-- POLÍTICAS PARA PRODUCTOS
-- ============================================

-- Lectura pública para productos activos
CREATE POLICY "Productos activos son públicos"
ON products FOR SELECT
USING (is_active = true);

-- Admins pueden todo
CREATE POLICY "Admins manejan productos"
ON products FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

-- ============================================
-- POLÍTICAS PARA CATEGORÍAS
-- ============================================

CREATE POLICY "Categorías activas son públicas"
ON categories FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins manejan categorías"
ON categories FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

-- ============================================
-- POLÍTICAS PARA ÓRDENES
-- ============================================

-- Clientes ven sus propias órdenes
CREATE POLICY "Clientes ven sus órdenes"
ON orders FOR SELECT
USING (
    auth.uid() = customer_id
    OR is_admin()
);

-- Solo el sistema puede crear órdenes (via service role)
CREATE POLICY "Sistema crea órdenes"
ON orders FOR INSERT
WITH CHECK (auth.role() = 'service_role' OR is_admin());

-- Admins pueden actualizar órdenes
CREATE POLICY "Admins actualizan órdenes"
ON orders FOR UPDATE
USING (is_admin())
WITH CHECK (is_admin());

-- ============================================
-- POLÍTICAS PARA ORDER ITEMS
-- ============================================

CREATE POLICY "Ver items de órdenes propias"
ON order_items FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM orders
        WHERE orders.id = order_items.order_id
        AND (orders.customer_id = auth.uid() OR is_admin())
    )
);

-- ============================================
-- POLÍTICAS PARA CLIENTES
-- ============================================

CREATE POLICY "Clientes ven su propio perfil"
ON customers FOR SELECT
USING (auth.uid() = id OR is_admin());

CREATE POLICY "Clientes actualizan su perfil"
ON customers FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- ============================================
-- POLÍTICAS PARA CONFIGURACIÓN
-- ============================================

CREATE POLICY "Configuración pública para lectura"
ON store_settings FOR SELECT
USING (true);

CREATE POLICY "Solo admins modifican configuración"
ON store_settings FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

-- ============================================
-- POLÍTICAS PARA VARIANTES
-- ============================================

CREATE POLICY "Variantes de productos públicos"
ON product_variants FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM products
        WHERE products.id = product_variants.product_id
        AND products.is_active = true
    )
);

CREATE POLICY "Admins manejan variantes"
ON product_variants FOR ALL
USING (is_admin())
WITH CHECK (is_admin());
SQL

-- supabase/migrations/003_add_functions.sql

-- ============================================
-- FUNCIÓN: ACTUALIZAR STOCK DESPUÉS DE PAGO
-- ============================================

CREATE OR REPLACE FUNCTION public.update_stock_after_payment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS
$$

BEGIN
-- Solo cuando el pago es aprobado
IF NEW.payment_status = 'approved' AND
(OLD.payment_status IS NULL OR OLD.payment_status != 'approved') THEN

        -- Actualizar stock de productos
        UPDATE products p
        SET stock = GREATEST(0, p.stock - oi.quantity)
        FROM order_items oi
        WHERE oi.order_id = NEW.id
        AND oi.product_id = p.id
        AND p.track_inventory = true;

        -- Actualizar stock de variantes si existen
        UPDATE product_variants pv
        SET stock = GREATEST(0, pv.stock - oi.quantity)
        FROM order_items oi
        WHERE oi.order_id = NEW.id
        AND oi.variant_id = pv.id;

    END IF;

    RETURN NEW;

END;

$$
;

-- Crear trigger
DROP TRIGGER IF EXISTS trigger_update_stock ON orders;
CREATE TRIGGER trigger_update_stock
    AFTER UPDATE OF payment_status ON orders
    FOR EACH ROW
    EXECUTE FUNCTION public.update_stock_after_payment();

-- ============================================
-- FUNCIÓN: ESTADÍSTICAS DEL DASHBOARD
-- ============================================

CREATE OR REPLACE FUNCTION public.get_admin_dashboard_stats()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS
$$

DECLARE
stats json;
BEGIN
-- Verificar que es admin
IF NOT is_admin() THEN
RAISE EXCEPTION 'Unauthorized';
END IF;

    SELECT json_build_object(
        'total_products', (SELECT COUNT(*) FROM products WHERE is_active = true),
        'total_orders', (SELECT COUNT(*) FROM orders),
        'pending_orders', (SELECT COUNT(*) FROM orders WHERE status = 'pending'),
        'total_revenue', (SELECT COALESCE(SUM(total), 0) FROM orders WHERE payment_status = 'approved'),
        'low_stock_products', (SELECT COUNT(*) FROM products WHERE stock < 5 AND track_inventory = true),
        'recent_orders', (
            SELECT json_agg(row_to_json(o))
            FROM (
                SELECT id, order_number, customer_name, total, status, created_at
                FROM orders
                ORDER BY created_at DESC
                LIMIT 5
            ) o
        )
    ) INTO stats;

    RETURN stats;

END;

$$
;

-- ============================================
-- FUNCIÓN: BUSCAR PRODUCTOS
-- ============================================

CREATE OR REPLACE FUNCTION public.search_products(
    search_query text DEFAULT NULL,
    category_slug text DEFAULT NULL,
    brand_filter text DEFAULT NULL,
    min_price numeric DEFAULT NULL,
    max_price numeric DEFAULT NULL,
    sort_by text DEFAULT 'created_at',
    sort_order text DEFAULT 'desc'
)
RETURNS SETOF products
LANGUAGE plpgsql
STABLE
AS
$$

BEGIN
RETURN QUERY
SELECT p.\*
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
WHERE
p.is_active = true
AND (search_query IS NULL OR
p.name ILIKE '%' || search_query || '%' OR
p.description ILIKE '%' || search_query || '%')
AND (category_slug IS NULL OR c.slug = category_slug)
AND (brand_filter IS NULL OR p.brand = brand_filter)
AND (min_price IS NULL OR p.price >= min_price)
AND (max_price IS NULL OR p.price <= max_price)
ORDER BY
CASE
WHEN sort_by = 'price' AND sort_order = 'asc' THEN p.price
WHEN sort_by = 'price' AND sort_order = 'desc' THEN -p.price
WHEN sort_by = 'name' AND sort_order = 'asc' THEN p.name
WHEN sort_by = 'created_at' AND sort_order = 'desc' THEN -EXTRACT(EPOCH FROM p.created_at)
ELSE -EXTRACT(EPOCH FROM p.created_at)
END;
END;

$$
;
💻 PASO 4: Archivos Core de Library
Supabase Clients
TypeScript

// lib/supabase-server.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.delete(name)
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
TypeScript

// lib/supabase-admin.ts
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set')
}

/**
 * Supabase Admin Client - USE WITH CAUTION
 * This bypasses RLS and should only be used in secure server-side contexts
 */
export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}

/**
 * Verificar si el usuario actual es admin
 */
export async function checkIsAdmin(userId: string): Promise<boolean> {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('admins')
    .select('id')
    .eq('id', userId)
    .single()

  return !!data && !error
}

/**
 * Wrapper para acciones de admin
 */
export async function withAdmin<T>(
  userId: string | undefined,
  action: (supabase: ReturnType<typeof createAdminClient>) => Promise<T>
): Promise<T> {
  if (!userId) {
    throw new Error('No autorizado: Usuario no autenticado')
  }

  const isAdmin = await checkIsAdmin(userId)

  if (!isAdmin) {
    throw new Error('No autorizado: No eres administrador')
  }

  const supabase = createAdminClient()
  return action(supabase)
}
Rate Limiting
TypeScript

// lib/rate-limit.ts
interface RateLimitResult {
  success: boolean
  remaining: number
  reset: Date
}

interface RateLimitOptions {
  interval: number // milliseconds
  uniqueTokenPerInterval: number
}

class RateLimiter {
  private requests = new Map<string, number[]>()

  constructor(private options: RateLimitOptions) {}

  check(identifier: string): RateLimitResult {
    const now = Date.now()
    const requestTimestamps = this.requests.get(identifier) || []

    // Filter out timestamps outside the interval
    const recentTimestamps = requestTimestamps.filter(
      timestamp => now - timestamp < this.options.interval
    )

    // Check if limit is exceeded
    if (recentTimestamps.length >= this.options.uniqueTokenPerInterval) {
      const oldestTimestamp = recentTimestamps[0]
      const reset = new Date(oldestTimestamp + this.options.interval)

      return {
        success: false,
        remaining: 0,
        reset
      }
    }

    // Add current timestamp
    recentTimestamps.push(now)
    this.requests.set(identifier, recentTimestamps)

    // Clean up old entries periodically
    if (Math.random() < 0.01) {
      this.cleanup()
    }

    return {
      success: true,
      remaining: this.options.uniqueTokenPerInterval - recentTimestamps.length,
      reset: new Date(now + this.options.interval)
    }
  }

  private cleanup() {
    const now = Date.now()

    for (const [key, timestamps] of this.requests.entries()) {
      const recent = timestamps.filter(
        t => now - t < this.options.interval
      )

      if (recent.length === 0) {
        this.requests.delete(key)
      } else {
        this.requests.set(key, recent)
      }
    }
  }
}

// Pre-configured rate limiters
export const apiLimiter = new RateLimiter({
  interval: 60_000, // 1 minute
  uniqueTokenPerInterval: 10 // 10 requests per minute
})

export const checkoutLimiter = new RateLimiter({
  interval: 3600_000, // 1 hour
  uniqueTokenPerInterval: 5 // 5 checkouts per hour
})

export const uploadLimiter = new RateLimiter({
  interval: 3600_000, // 1 hour
  uniqueTokenPerInterval: 20 // 20 uploads per hour
})
Cloudinary Optimizado
TypeScript

// lib/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary'

// Configurar Cloudinary
if (!process.env.CLOUDINARY_API_KEY) {
  console.warn('Cloudinary not configured')
} else {
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  })
}

/**
 * Obtener URL optimizada de Cloudinary
 */
export function getOptimizedImageUrl(
  url: string,
  options?: {
    width?: number
    height?: number
    quality?: number | 'auto'
    format?: 'auto' | 'webp' | 'avif'
  }
): string {
  // Si no es una URL de Cloudinary, devolverla tal cual
  if (!url || !url.includes('cloudinary')) {
    return url
  }

  const {
    width = 800,
    height,
    quality = 'auto:good',
    format = 'auto'
  } = options || {}

  // Construir transformaciones
  const transformations: string[] = [
    `f_${format}`,
    `q_${quality}`,
    `w_${width}`,
    'c_limit', // No hacer la imagen más grande que el original
    'dpr_auto' // Device Pixel Ratio automático
  ]

  if (height) {
    transformations.push(`h_${height}`)
  }

  // Aplicar transformaciones
  const transformString = transformations.join(',')

  // Insertar transformaciones en la URL
  return url.replace('/upload/', `/upload/${transformString}/`)
}

/**
 * Subir imagen a Cloudinary
 */
export async function uploadImage(
  file: File | string, // File o base64
  options?: {
    folder?: string
    publicId?: string
    tags?: string[]
  }
): Promise<{
  url: string
  publicId: string
  width: number
  height: number
  format: string
  size: number
}> {
  try {
    let base64: string

    if (typeof file === 'string') {
      base64 = file
    } else {
      // Convertir File a base64
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      base64 = `data:${file.type};base64,${buffer.toString('base64')}`
    }

    const result = await cloudinary.uploader.upload(base64, {
      folder: options?.folder || 'glamify/products',
      public_id: options?.publicId,
      tags: options?.tags,
      transformation: [
        { width: 2000, height: 2000, crop: 'limit' },
        { quality: 'auto:best' }
      ],
      allowed_formats: ['jpg', 'png', 'webp', 'avif'],
      resource_type: 'auto'
    })

    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      size: result.bytes
    }
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error)
    throw new Error('Error al subir la imagen')
  }
}

/**
 * Eliminar imagen de Cloudinary
 */
export async function deleteImage(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId)
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error)
    throw new Error('Error al eliminar la imagen')
  }
}

/**
 * Generar blur placeholder para Next.js Image
 */
export function getBlurDataUrl(url: string): string {
  if (!url || !url.includes('cloudinary')) {
    return ''
  }

  // Generar una versión super pequeña y borrosa
  return url.replace(
    '/upload/',
    '/upload/w_10,h_10,c_fill,e_blur:1000,f_auto,q_1/'
  )
}
Validaciones con Zod
TypeScript

// lib/validations.ts
import { z } from 'zod'

// ============================================
// ESQUEMAS DE PRODUCTO
// ============================================

export const productSchema = z.object({
  name: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(255, 'El nombre es demasiado largo'),

  slug: z.string()
    .min(3, 'El slug debe tener al menos 3 caracteres')
    .regex(/^[a-z0-9-]+$/, 'El slug solo puede contener letras minúsculas, números y guiones'),

  description: z.string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .optional()
    .nullable(),

  short_description: z.string()
    .max(500, 'La descripción corta es demasiado larga')
    .optional()
    .nullable(),

  price: z.number()
    .positive('El precio debe ser positivo')
    .max(1000000, 'El precio es demasiado alto'),

  compare_at_price: z.number()
    .positive()
    .optional()
    .nullable(),

  cost: z.number()
    .positive()
    .optional()
    .nullable(),

  stock: z.number()
    .int('El stock debe ser un número entero')
    .min(0, 'El stock no puede ser negativo'),

  sku: z.string()
    .optional()
    .nullable(),

  track_inventory: z.boolean().default(true),

  category_id: z.string().uuid('Categoría inválida').optional().nullable(),

  brand: z.string()
    .max(100, 'La marca es demasiado larga')
    .optional()
    .nullable(),

  tags: z.array(z.string()).default([]),

  images: z.array(z.string().url('URL de imagen inválida')).default([]),

  thumbnail: z.string().url().optional().nullable(),

  meta_title: z.string().max(255).optional().nullable(),
  meta_description: z.string().max(500).optional().nullable(),

  is_active: z.boolean().default(true),
  is_featured: z.boolean().default(false)
})

export type ProductFormData = z.infer<typeof productSchema>

// ============================================
// ESQUEMAS DE CHECKOUT
// ============================================

export const checkoutCustomerSchema = z.object({
  email: z.string()
    .email('Email inválido')
    .toLowerCase(),

  name: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(255, 'El nombre es demasiado largo'),

  phone: z.string()
    .regex(/^\+?[0-9\s-()]+$/, 'Teléfono inválido')
    .min(8, 'El teléfono es muy corto')
    .max(20, 'El teléfono es muy largo')
})

export const checkoutAddressSchema = z.object({
  street: z.string()
    .min(5, 'La dirección debe tener al menos 5 caracteres')
    .max(255, 'La dirección es demasiado larga'),

  city: z.string()
    .min(2, 'La ciudad debe tener al menos 2 caracteres')
    .max(100, 'El nombre de la ciudad es demasiado largo'),

  state: z.string()
    .min(2, 'La provincia debe tener al menos 2 caracteres')
    .max(100, 'El nombre de la provincia es demasiado largo'),

  zip: z.string()
    .regex(/^[0-9]{4,10}$/, 'Código postal inválido'),

  country: z.string()
    .default('Argentina'),

  notes: z.string()
    .max(500, 'Las notas son demasiado largas')
    .optional()
})

export const checkoutSchema = z.object({
  customer: checkoutCustomerSchema,
  shipping_address: checkoutAddressSchema,
  items: z.array(z.object({
    product_id: z.string().uuid(),
    variant_id: z.string().uuid().optional(),
    quantity: z.number().int().positive()
  })).min(1, 'El carrito está vacío')
})

export type CheckoutFormData = z.infer<typeof checkoutSchema>

// ============================================
// ESQUEMAS DE CATEGORÍA
// ============================================

export const categorySchema = z.object({
  name: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre es demasiado largo'),

  slug: z.string()
    .min(2, 'El slug debe tener al menos 2 caracteres')
    .regex(/^[a-z0-9-]+$/, 'El slug solo puede contener letras minúsculas, números y guiones'),

  description: z.string()
    .max(500, 'La descripción es demasiado larga')
    .optional()
    .nullable(),

  image_url: z.string().url().optional().nullable(),

  parent_id: z.string().uuid().optional().nullable(),

  is_active: z.boolean().default(true),

  sort_order: z.number().int().default(0)
})

export type CategoryFormData = z.infer<typeof categorySchema>

// ============================================
// UTILIDADES DE VALIDACIÓN
// ============================================

/**
 * Validar y sanitizar datos con un esquema
 */
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: z.ZodError } {
  const result = schema.safeParse(data)

  if (result.success) {
    return { success: true, data: result.data }
  }

  return { success: false, errors: result.error }
}

/**
 * Formatear errores de Zod para mostrar en UI
 */
export function formatZodErrors(error: z.ZodError): Record<string, string> {
  const formatted: Record<string, string> = {}

  error.errors.forEach((err) => {
    const path = err.path.join('.')
    formatted[path] = err.message
  })

  return formatted
}
Utilidades Mejoradas
TypeScript

// lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import slugify from 'slugify'

/**
 * Combinar clases de Tailwind de forma segura
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formatear precio en pesos argentinos
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price)
}

/**
 * Generar slug a partir de texto
 */
export function generateSlug(text: string): string {
  return slugify(text, {
    lower: true,
    strict: true,
    locale: 'es'
  })
}

/**
 * Truncar texto
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length).trim() + '...'
}

/**
 * Formatear fecha
 */
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

/**
 * Calcular descuento porcentual
 */
export function calculateDiscount(price: number, comparePrice: number): number {
  if (comparePrice <= price) return 0
  return Math.round((1 - price / comparePrice) * 100)
}

/**
 * Obtener iniciales de un nombre
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/**
 * Esperar X milisegundos (útil para testing)
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): T {
  let timeout: NodeJS.Timeout

  return ((...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }) as T
}

/**
 * Obtener IP del request
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded?.split(',')[0] || 'unknown'
  return ip
}

/**
 * Generar número de orden único
 */
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 5)
  return `ORD-${timestamp}-${random}`.toUpperCase()
}
🎨 PASO 5: Componentes UI Base
Button Component
TypeScript

// components/ui/button.tsx
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-pink-500 text-white hover:bg-pink-600 focus-visible:ring-pink-500',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus-visible:ring-gray-500',
        outline: 'border-2 border-gray-300 bg-transparent hover:bg-gray-100',
        ghost: 'hover:bg-gray-100 hover:text-gray-900',
        danger: 'bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500',
        success: 'bg-green-500 text-white hover:bg-green-600 focus-visible:ring-green-500',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4',
        lg: 'h-12 px-6 text-lg',
        icon: 'h-10 w-10',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button, buttonVariants }
Skeleton Component
TypeScript

// components/ui/skeleton.tsx
import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
  animation?: 'pulse' | 'wave' | 'none'
  width?: number | string
  height?: number | string
}

export function Skeleton({
  className,
  variant = 'rectangular',
  animation = 'pulse',
  width,
  height,
}: SkeletonProps) {
  const baseClasses = 'bg-gray-200'

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: '',
  }

  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  }

  const style: React.CSSProperties = {
    width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
    height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
  }

  return (
    <div
      className={cn(
        baseClasses,
        animationClasses[animation],
        variantClasses[variant],
        className
      )}
      style={style}
      aria-busy="true"
      aria-live="polite"
    />
  )
}

// Añadir en globals.css:
// @keyframes shimmer {
//   0% {
//     background-position: -200% 0;
//   }
//   100% {
//     background-position: 200% 0;
//   }
// }
//
// .animate-shimmer {
//   animation: shimmer 1.5s infinite;
//   background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
//   background-size: 200% 100%;
// }
🛒 PASO 6: Cart Provider Mejorado
TypeScript

// hooks/use-cart.ts
'use client'

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { toast } from 'react-hot-toast'
import type { Product, ProductVariant } from '@/types'

interface CartItem {
  id: string // product_id o product_id-variant_id
  product: Product
  variant?: ProductVariant | null
  quantity: number
  addedAt: Date
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
  isLoading: boolean
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; variant?: ProductVariant | null; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'HYDRATE'; payload: CartItem[] }

const CART_STORAGE_KEY = 'glamify-cart-v2'
const MAX_QUANTITY_PER_ITEM = 10

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, variant, quantity } = action.payload

      // Validar stock
      const availableStock = variant?.stock ?? product.stock
      if (availableStock === 0) {
        toast.error('Producto agotado')
        return state
      }

      const itemId = variant ? `${product.id}-${variant.id}` : product.id
      const existingItemIndex = state.items.findIndex(item => item.id === itemId)

      if (existingItemIndex > -1) {
        const existingItem = state.items[existingItemIndex]
        const newQuantity = Math.min(
          existingItem.quantity + quantity,
          Math.min(availableStock, MAX_QUANTITY_PER_ITEM)
        )

        if (newQuantity === existingItem.quantity) {
          toast.error(`Máximo ${MAX_QUANTITY_PER_ITEM} unidades por producto`)
          return state
        }

        const newItems = [...state.items]
        newItems[existingItemIndex] = {
          ...existingItem,
          quantity: newQuantity
        }

        toast.success('Cantidad actualizada')
        return { ...state, items: newItems }
      }

      // Nuevo item
      const newItem: CartItem = {
        id: itemId,
        product,
        variant: variant || null,
        quantity: Math.min(quantity, Math.min(availableStock, MAX_QUANTITY_PER_ITEM)),
        addedAt: new Date()
      }

      toast.success(`${product.name} agregado al carrito`)
      return {
        ...state,
        items: [...state.items, newItem],
        isOpen: true // Abrir carrito al agregar
      }
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload.id)
      toast.success('Producto eliminado')
      return { ...state, items: newItems }
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload

      if (quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: { id } })
      }

      const itemIndex = state.items.findIndex(item => item.id === id)
      if (itemIndex === -1) return state

      const item = state.items[itemIndex]
      const availableStock = item.variant?.stock ?? item.product.stock
      const newQuantity = Math.min(quantity, Math.min(availableStock, MAX_QUANTITY_PER_ITEM))

      if (newQuantity === quantity && quantity > MAX_QUANTITY_PER_ITEM) {
        toast.error(`Máximo ${MAX_QUANTITY_PER_ITEM} unidades`)
      } else if (newQuantity === quantity && quantity > availableStock) {
        toast.error(`Solo hay ${availableStock} unidades disponibles`)
      }

      const newItems = [...state.items]
      newItems[itemIndex] = {
        ...item,
        quantity: newQuantity
      }

      return { ...state, items: newItems }
    }

    case 'CLEAR_CART':
      toast.success('Carrito vaciado')
      return { ...state, items: [] }

    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen }

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }

    case 'HYDRATE':
      return { ...state, items: action.payload }

    default:
      return state
  }
}

interface CartContextValue extends CartState {
  addItem: (product: Product, variant?: ProductVariant | null, quantity?: number) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  itemCount: number
  subtotal: number
  hasStock: (productId: string, variantId?: string) => boolean
  getItemQuantity: (productId: string, variantId?: string) => number
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isOpen: false,
    isLoading: true
  })

  // Hidratar desde localStorage
  useEffect(() => {
    dispatch({ type: 'SET_LOADING', payload: true })

    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY)
      if (stored) {
        const items = JSON.parse(stored)
        // Convertir strings de fecha a Date objects
        const hydratedItems = items.map((item: any) => ({
          ...item,
          addedAt: new Date(item.addedAt)
        }))
        dispatch({ type: 'HYDRATE', payload: hydratedItems })
      }
    } catch (error) {
      console.error('Error loading cart:', error)
      localStorage.removeItem(CART_STORAGE_KEY)
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  // Guardar en localStorage cuando cambie
  useEffect(() => {
    if (!state.isLoading) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items))
      } catch (error) {
        console.error('Error saving cart:', error)
      }
    }
  }, [state.items, state.isLoading])

  const addItem = (product: Product, variant?: ProductVariant | null, quantity = 1) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, variant, quantity } })
  }

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } })
  }

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' })
  }

  const hasStock = (productId: string, variantId?: string): boolean => {
    const itemId = variantId ? `${productId}-${variantId}` : productId
    const item = state.items.find(i => i.id === itemId)
    if (!item) return true

    const stock = item.variant?.stock ?? item.product.stock
    return item.quantity < stock
  }

  const getItemQuantity = (productId: string, variantId?: string): number => {
    const itemId = variantId ? `${productId}-${variantId}` : productId
    const item = state.items.find(i => i.id === itemId)
    return item?.quantity || 0
  }

  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0)

  const subtotal = state.items.reduce((sum, item) => {
    const basePrice = Number(item.product.price)
    const variantModifier = Number(item.variant?.price_modifier || 0)
    return sum + (basePrice + variantModifier) * item.quantity
  }, 0)

  // No renderizar children hasta que se haya hidratado
  if (state.isLoading) {
    return null
  }

  return (
    <CartContext.Provider value={{
      ...state,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      toggleCart,
      hasStock,
      getItemQuantity,
      itemCount,
      subtotal
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
🎯 PASO 7: Componentes de Producto Mejorados
Product Card Mejorado
TypeScript

// components/products/product-card.tsx
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Heart, Eye } from 'lucide-react'
import { formatPrice, calculateDiscount } from '@/lib/utils'
import { getOptimizedImageUrl, getBlurDataUrl } from '@/lib/cloudinary'
import { Button } from '@/components/ui/button'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
  priority?: boolean
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const hasDiscount = product.compare_at_price && product.compare_at_price > product.price
  const discountPercent = hasDiscount
    ? calculateDiscount(product.price, product.compare_at_price!)
    : 0

  const imageUrl = product.thumbnail || product.images?.[0]
  const optimizedUrl = imageUrl ? getOptimizedImageUrl(imageUrl, { width: 400 }) : ''
  const blurUrl = imageUrl ? getBlurDataUrl(imageUrl) : ''

  const isOutOfStock = product.stock === 0

  return (
    <article className="group relative">
      <Link
        href={`/productos/${product.slug}`}
        className="block"
        aria-label={`Ver ${product.name}`}
      >
        <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
          {optimizedUrl ? (
            <Image
              src={optimizedUrl}
              alt={product.name}
              fill
              className={cn(
                "object-cover transition-transform duration-300",
                "group-hover:scale-105",
                isOutOfStock && "opacity-50"
              )}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              priority={priority}
              placeholder={blurUrl ? "blur" : "empty"}
              blurDataURL={blurUrl}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400">
              <ShoppingCart className="h-12 w-12" />
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {hasDiscount && (
              <span className="rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white shadow-lg">
                -{discountPercent}%
              </span>
            )}
            {product.is_featured && (
              <span className="rounded-full bg-gradient-to-r from-pink-500 to-purple-500 px-2 py-1 text-xs font-bold text-white shadow-lg">
                ⭐ Destacado
              </span>
            )}
            {isOutOfStock && (
              <span className="rounded-full bg-gray-800 px-2 py-1 text-xs font-bold text-white shadow-lg">
                Agotado
              </span>
            )}
            {product.stock > 0 && product.stock <= 3 && (
              <span className="rounded-full bg-yellow-500 px-2 py-1 text-xs font-bold text-white shadow-lg">
                ¡Últimas {product.stock}!
              </span>
            )}
          </div>

          {/* Quick Actions (visible on hover) */}
          <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              className="rounded-full bg-white/90 p-2 backdrop-blur-sm transition-transform hover:scale-110 hover:bg-white"
              aria-label="Agregar a favoritos"
              onClick={(e) => {
                e.preventDefault()
                // TODO: Implementar wishlist
                toast.success('Agregado a favoritos')
              }}
            >
              <Heart className="h-4 w-4" />
            </button>
            <button
              className="rounded-full bg-white/90 p-2 backdrop-blur-sm transition-transform hover:scale-110 hover:bg-white"
              aria-label="Vista rápida"
              onClick={(e) => {
                e.preventDefault()
                // TODO: Implementar quick view modal
              }}
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-3 space-y-1">
          {product.brand && (
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              {product.brand}
            </p>
          )}

          <h3 className="font-medium text-gray-900 group-hover:text-pink-600 transition-colors line-clamp-2">
            {product.name}
          </h3>

          <div className="flex items-center gap-2">
            <span className={cn(
              "font-bold",
              isOutOfStock ? "text-gray-400" : "text-gray-900"
            )}>
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(product.compare_at_price!)}
              </span>
            )}
          </div>

          {/* Rating (si tienes sistema de reviews) */}
          {product.rating && (
            <div className="flex items-center gap-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={cn(
                      "h-4 w-4",
                      i < Math.floor(product.rating!)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    )}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-gray-500">
                ({product.review_count || 0})
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Add to Cart Button */}
      <div className="mt-3">
        <AddToCartButton
          product={product}
          variant="secondary"
          size="sm"
          fullWidth
          disabled={isOutOfStock}
        />
      </div>
    </article>
  )
}
Add to Cart Button Mejorado
TypeScript

// components/products/add-to-cart-button.tsx
'use client'

import { useState } from 'react'
import { ShoppingCart, Check, X } from 'lucide-react'
import { useCart } from '@/hooks/use-cart'
import { Button, type ButtonProps } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Product, ProductVariant } from '@/types'

interface AddToCartButtonProps extends Omit<ButtonProps, 'onClick'> {
  product: Product
  variant?: ProductVariant | null
  quantity?: number
  showIcon?: boolean
  successDuration?: number
}

export function AddToCartButton({
  product,
  variant = null,
  quantity = 1,
  showIcon = true,
  successDuration = 2000,
  children,
  className,
  disabled,
  ...props
}: AddToCartButtonProps) {
  const { addItem, hasStock, getItemQuantity } = useCart()
  const [status, setStatus] = useState<'idle' | 'adding' | 'success' | 'error'>('idle')

  const currentQuantity = getItemQuantity(product.id, variant?.id)
  const availableStock = variant?.stock ?? product.stock
  const canAddMore = hasStock(product.id, variant?.id)
  const isOutOfStock = availableStock === 0
  const isMaxed = currentQuantity >= 10 || currentQuantity >= availableStock

  const handleAddToCart = async () => {
    if (isOutOfStock || isMaxed || !canAddMore) return

    setStatus('adding')

    try {
      // Simular delay para mejor UX
      await new Promise(resolve => setTimeout(resolve, 300))

      addItem(product, variant, quantity)
      setStatus('success')

      // Reset después del tiempo especificado
      setTimeout(() => {
        setStatus('idle')
      }, successDuration)
    } catch (error) {
      console.error('Error adding to cart:', error)
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  const getButtonContent = () => {
    switch (status) {
      case 'adding':
        return (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Agregando...</span>
          </>
        )

      case 'success':
        return (
          <>
            <Check className="h-4 w-4" />
            <span>¡Agregado!</span>
          </>
        )

      case 'error':
        return (
          <>
            <X className="h-4 w-4" />
            <span>Error</span>
          </>
        )

      default:
        if (isOutOfStock) {
          return 'Agotado'
        }
        if (isMaxed) {
          return 'Máximo alcanzado'
        }
        if (currentQuantity > 0) {
          return (
            <>
              {showIcon && <ShoppingCart className="h-4 w-4" />}
              <span>Agregar más ({currentQuantity})</span>
            </>
          )
        }
        return (
          <>
            {showIcon && <ShoppingCart className="h-4 w-4" />}
            <span>{children || 'Agregar al carrito'}</span>
          </>
        )
    }
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={disabled || isOutOfStock || isMaxed || status !== 'idle'}
      className={cn(
        'gap-2 transition-all',
        status === 'success' && 'bg-green-500 hover:bg-green-600',
        status === 'error' && 'bg-red-500 hover:bg-red-600',
        className
      )}
      aria-label={`Agregar ${product.name} al carrito`}
      {...props}
    >
      {getButtonContent()}
    </Button>
  )
}
📝 PASO 8: Admin Actions Seguras
TypeScript

// app/admin/products/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { createAdminClient, withAdmin } from '@/lib/supabase-admin'
import { productSchema, type ProductFormData } from '@/lib/validations'
import { generateSlug } from '@/lib/utils'
import { uploadImage, deleteImage } from '@/lib/cloudinary'

export type ActionResult<T = any> =
  | { success: true; data: T }
  | { success: false; error: string; details?: any }

/**
 * Crear producto
 */
export async function createProduct(
  formData: FormData
): Promise<ActionResult> {
  try {
    // Verificar autenticación
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'No autenticado' }
    }

    // Ejecutar con permisos de admin
    return await withAdmin(user.id, async (adminClient) => {
      // Parsear datos del formulario
      const rawData = {
        name: formData.get('name') as string,
        slug: formData.get('slug') as string || generateSlug(formData.get('name') as string),
        description: formData.get('description') as string,
        short_description: formData.get('short_description') as string,
        price: Number(formData.get('price')),
        compare_at_price: formData.get('compare_at_price')
          ? Number(formData.get('compare_at_price'))
          : null,
        cost: formData.get('cost') ? Number(formData.get('cost')) : null,
        stock: Number(formData.get('stock') || 0),
        sku: formData.get('sku') as string,
        track_inventory: formData.get('track_inventory') === 'true',
        category_id: formData.get('category_id') as string || null,
        brand: formData.get('brand') as string,
        tags: formData.get('tags')
          ? (formData.get('tags') as string).split(',').map(t => t.trim())
          : [],
        is_active: formData.get('is_active') !== 'false',
        is_featured: formData.get('is_featured') === 'true'
      }

      // Validar datos
      const validation = productSchema.safeParse(rawData)
      if (!validation.success) {
        return {
          success: false,
          error: 'Datos inválidos',
          details: validation.error.format()
        }
      }

      // Manejar imágenes si se subieron
      const images: string[] = []
      const imageFiles = formData.getAll('images') as File[]

      for (const file of imageFiles) {
        if (file.size > 0) {
          try {
            const result = await uploadImage(file, {
              folder: 'glamify/products'
            })
            images.push(result.url)
          } catch (error) {
            console.error('Error uploading image:', error)
            // Continuar con las demás imágenes
          }
        }
      }

      // Insertar producto
      const { data: product, error } = await adminClient
        .from('products')
        .insert({
          ...validation.data,
          images,
          thumbnail: images[0] || null
        })
        .select()
        .single()

      if (error) {
        console.error('DB Error:', error)
        return {
          success: false,
          error: 'Error al crear el producto'
        }
      }

      // Revalidar páginas
      revalidatePath('/admin/products')
      revalidatePath('/productos')
      revalidatePath('/')

      return { success: true, data: product }
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error inesperado'
    }
  }
}

/**
 * Actualizar producto
 */
export async function updateProduct(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'No autenticado' }
    }

    return await withAdmin(user.id, async (adminClient) => {
      // Obtener producto actual
      const { data: currentProduct, error: fetchError } = await adminClient
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError || !currentProduct) {
        return { success: false, error: 'Producto no encontrado' }
      }

      // Parsear datos
      const rawData = {
        name: formData.get('name') as string,
        slug: formData.get('slug') as string,
        description: formData.get('description') as string,
        short_description: formData.get('short_description') as string,
        price: Number(formData.get('price')),
        compare_at_price: formData.get('compare_at_price')
          ? Number(formData.get('compare_at_price'))
          : null,
        cost: formData.get('cost') ? Number(formData.get('cost')) : null,
        stock: Number(formData.get('stock') || 0),
        sku: formData.get('sku') as string,
        track_inventory: formData.get('track_inventory') === 'true',
        category_id: formData.get('category_id') as string || null,
        brand: formData.get('brand') as string,
        tags: formData.get('tags')
          ? (formData.get('tags') as string).split(',').map(t => t.trim())
          : [],
        is_active: formData.get('is_active') !== 'false',
        is_featured: formData.get('is_featured') === 'true'
      }

      // Validar
      const validation = productSchema.partial().safeParse(rawData)
      if (!validation.success) {
        return {
          success: false,
          error: 'Datos inválidos',
          details: validation.error.format()
        }
      }

      // Manejar nuevas imágenes
      let images = currentProduct.images || []
      const newImageFiles = formData.getAll('new_images') as File[]

      for (const file of newImageFiles) {
        if (file.size > 0) {
          try {
            const result = await uploadImage(file, {
              folder: 'glamify/products'
            })
            images.push(result.url)
          } catch (error) {
            console.error('Error uploading image:', error)
          }
        }
      }

      // Eliminar imágenes marcadas
      const imagesToDelete = formData.getAll('delete_images') as string[]
      for (const imageUrl of imagesToDelete) {
        images = images.filter(img => img !== imageUrl)
        // TODO: Extraer public_id de la URL y llamar deleteImage(publicId)
      }

      // Actualizar producto
      const { data: product, error } = await adminClient
        .from('products')
        .update({
          ...validation.data,
          images,
          thumbnail: images[0] || null
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('DB Error:', error)
        return { success: false, error: 'Error al actualizar el producto' }
      }

      // Revalidar
      revalidatePath('/admin/products')
      revalidatePath('/productos')
      revalidatePath(`/productos/${product.slug}`)

      return { success: true, data: product }
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error inesperado'
    }
  }
}

/**
 * Eliminar producto
 */
export async function deleteProduct(id: string): Promise<ActionResult> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'No autenticado' }
    }

    return await withAdmin(user.id, async (adminClient) => {
      // Verificar que no hay órdenes con este producto
      const { data: orderItems } = await adminClient
        .from('order_items')
        .select('id')
        .eq('product_id', id)
        .limit(1)

      if (orderItems && orderItems.length > 0) {
        // En lugar de eliminar, desactivar
        const { error } = await adminClient
          .from('products')
          .update({ is_active: false })
          .eq('id', id)

        if (error) {
          return { success: false, error: 'Error al desactivar el producto' }
        }

        revalidatePath('/admin/products')
        revalidatePath('/productos')

        return {
          success: true,
          data: { message: 'Producto desactivado (tiene órdenes asociadas)' }
        }
      }

      // Si no hay órdenes, eliminar
      const { error } = await adminClient
        .from('products')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Delete error:', error)
        return { success: false, error: 'Error al eliminar el producto' }
      }

      revalidatePath('/admin/products')
      revalidatePath('/productos')

      return { success: true, data: { message: 'Producto eliminado' } }
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error inesperado'
    }
  }
}

/**
 * Bulk update de productos
 */
export async function bulkUpdateProducts(
  ids: string[],
  updates: Partial<ProductFormData>
): Promise<ActionResult> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'No autenticado' }
    }

    return await withAdmin(user.id, async (adminClient) => {
      const { data, error } = await adminClient
        .from('products')
        .update(updates)
        .in('id', ids)
        .select()

      if (error) {
        return { success: false, error: 'Error al actualizar productos' }
      }

      revalidatePath('/admin/products')
      revalidatePath('/productos')

      return {
        success: true,
        data: {
          message: `${data.length} productos actualizados`,
          products: data
        }
      }
    })
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error inesperado'
    }
  }
}

/**
 * Duplicar producto
 */
export async function duplicateProduct(id: string): Promise<ActionResult> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'No autenticado' }
    }

    return await withAdmin(user.id, async (adminClient) => {
      // Obtener producto original
      const { data: original, error: fetchError } = await adminClient
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError || !original) {
        return { success: false, error: 'Producto no encontrado' }
      }

      // Crear copia
      const { id: _, slug, sku, ...productData } = original

      const newProduct = {
        ...productData,
        name: `${original.name} (Copia)`,
        slug: generateSlug(`${original.name} copia ${Date.now()}`),
        sku: sku ? `${sku}-COPY-${Date.now()}` : null,
        is_active: false // Desactivado por defecto
      }

      const { data,






$$
