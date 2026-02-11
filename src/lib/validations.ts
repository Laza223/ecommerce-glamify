// lib/validations.ts
import { z } from "zod";

// ============================================
// ESQUEMAS DE PRODUCTO
// ============================================

export const productSchema = z.object({
  name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(255, "El nombre es demasiado largo"),

  slug: z
    .string()
    .min(3, "El slug debe tener al menos 3 caracteres")
    .regex(
      /^[a-z0-9-]+$/,
      "El slug solo puede contener letras minúsculas, números y guiones",
    ),

  description: z
    .string()
    .min(10, "La descripción debe tener al menos 10 caracteres")
    .optional()
    .nullable(),

  short_description: z
    .string()
    .max(500, "La descripción corta es demasiado larga")
    .optional()
    .nullable(),

  price: z
    .number()
    .positive("El precio debe ser positivo")
    .max(1000000, "El precio es demasiado alto"),

  compare_at_price: z.number().positive().optional().nullable(),

  cost: z.number().positive().optional().nullable(),

  stock: z
    .number()
    .int("El stock debe ser un número entero")
    .min(0, "El stock no puede ser negativo"),

  sku: z.string().optional().nullable(),

  track_inventory: z.boolean().default(true),

  category_id: z.string().uuid("Categoría inválida").optional().nullable(),

  brand: z
    .string()
    .max(100, "La marca es demasiado larga")
    .optional()
    .nullable(),

  tags: z.array(z.string()).default([]),

  images: z.array(z.string().url("URL de imagen inválida")).default([]),

  thumbnail: z.string().url().optional().nullable(),

  meta_title: z.string().max(255).optional().nullable(),
  meta_description: z.string().max(500).optional().nullable(),

  is_active: z.boolean().default(true),
  is_featured: z.boolean().default(false),
});

export type ProductFormData = z.infer<typeof productSchema>;

// ============================================
// ESQUEMAS DE CHECKOUT
// ============================================

export const checkoutCustomerSchema = z.object({
  email: z.string().email("Email inválido").toLowerCase(),

  name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(255, "El nombre es demasiado largo"),

  phone: z
    .string()
    .regex(/^\+?[0-9\s-()]+$/, "Teléfono inválido")
    .min(8, "El teléfono es muy corto")
    .max(20, "El teléfono es muy largo"),
});

export const checkoutAddressSchema = z.object({
  street: z
    .string()
    .min(5, "La dirección debe tener al menos 5 caracteres")
    .max(255, "La dirección es demasiado larga"),

  city: z
    .string()
    .min(2, "La ciudad debe tener al menos 2 caracteres")
    .max(100, "El nombre de la ciudad es demasiado largo"),

  state: z
    .string()
    .min(2, "La provincia debe tener al menos 2 caracteres")
    .max(100, "El nombre de la provincia es demasiado largo"),

  zip: z.string().regex(/^[0-9]{4,10}$/, "Código postal inválido"),

  country: z.string().default("Argentina"),

  notes: z.string().max(500, "Las notas son demasiado largas").optional(),
});

export const checkoutSchema = z.object({
  customer: checkoutCustomerSchema,
  shipping_address: checkoutAddressSchema,
  items: z
    .array(
      z.object({
        product_id: z.string().uuid(),
        variant_id: z.string().uuid().optional(),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1, "El carrito está vacío"),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

// ============================================
// ESQUEMAS DE CATEGORÍA
// ============================================

export const categorySchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre es demasiado largo"),

  slug: z
    .string()
    .min(2, "El slug debe tener al menos 2 caracteres")
    .regex(
      /^[a-z0-9-]+$/,
      "El slug solo puede contener letras minúsculas, números y guiones",
    ),

  description: z
    .string()
    .max(500, "La descripción es demasiado larga")
    .optional()
    .nullable(),

  image_url: z.string().url().optional().nullable(),

  parent_id: z.string().uuid().optional().nullable(),

  is_active: z.boolean().default(true),

  sort_order: z.number().int().default(0),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

// ============================================
// UTILIDADES DE VALIDACIÓN
// ============================================

/**
 * Validar y sanitizar datos con un esquema
 */
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): { success: true; data: T } | { success: false; errors: z.ZodError } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  return { success: false, errors: result.error };
}

/**
 * Formatear errores de Zod para mostrar en UI
 */
export function formatZodErrors(error: z.ZodError): Record<string, string> {
  const formatted: Record<string, string> = {};

  error.issues.forEach((err: z.ZodIssue) => {
    const path = err.path.join(".");
    formatted[path] = err.message;
  });

  return formatted;
}
