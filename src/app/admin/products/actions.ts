// app/admin/products/actions.ts
"use server";

import { uploadImage } from "@/lib/cloudinary";
import { withAdmin } from "@/lib/supabase-admin";
import { createClient } from "@/lib/supabase/server";
import { generateSlug } from "@/lib/utils";
import { productSchema, type ProductFormData } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export type ActionResult<T = any> =
  | { success: true; data: T }
  | { success: false; error: string; details?: any };

/**
 * Crear producto
 */
export async function createProduct(formData: FormData): Promise<ActionResult> {
  try {
    // Verificar autenticación
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "No autenticado" };
    }

    // Ejecutar con permisos de admin
    return await withAdmin(user.id, async (adminClient) => {
      // Parsear datos del formulario
      const rawData = {
        name: formData.get("name") as string,
        slug:
          (formData.get("slug") as string) ||
          generateSlug(formData.get("name") as string),
        description: formData.get("description") as string,
        short_description: formData.get("short_description") as string,
        price: Number(formData.get("price")),
        compare_at_price: formData.get("compare_at_price")
          ? Number(formData.get("compare_at_price"))
          : null,
        cost: formData.get("cost") ? Number(formData.get("cost")) : null,
        stock: Number(formData.get("stock") || 0),
        sku: formData.get("sku") as string,
        track_inventory: formData.get("track_inventory") === "true",
        category_id: (formData.get("category_id") as string) || null,
        brand: formData.get("brand") as string,
        tags: formData.get("tags")
          ? (formData.get("tags") as string).split(",").map((t) => t.trim())
          : [],
        is_active: formData.get("is_active") !== "false",
        is_featured: formData.get("is_featured") === "true",
      };

      // Validar datos
      const validation = productSchema.safeParse(rawData);
      if (!validation.success) {
        return {
          success: false,
          error: "Datos inválidos",
          details: validation.error.format(),
        };
      }

      // Manejar imágenes si se subieron
      const images: string[] = [];
      const imageFiles = formData.getAll("images") as File[];

      for (const file of imageFiles) {
        if (file.size > 0) {
          try {
            const result = await uploadImage(file, {
              folder: "glamify/products",
            });
            images.push(result.url);
          } catch (error) {
            console.error("Error uploading image:", error);
            // Continuar con las demás imágenes
          }
        }
      }

      // Insertar producto
      const { data: product, error } = await adminClient
        .from("products")
        .insert({
          ...validation.data,
          images,
          thumbnail: images[0] || null,
        } as any)
        .select()
        .single();

      if (error) {
        console.error("DB Error:", error);
        return {
          success: false,
          error: "Error al crear el producto",
        };
      }

      // Revalidar páginas
      revalidatePath("/admin/products");
      revalidatePath("/productos");
      revalidatePath("/");

      return { success: true, data: product };
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error inesperado",
    };
  }
}

/**
 * Actualizar producto
 */
export async function updateProduct(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "No autenticado" };
    }

    return await withAdmin(user.id, async (adminClient) => {
      // Obtener producto actual
      const { data: currentProduct, error: fetchError } = await adminClient
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError || !currentProduct) {
        return { success: false, error: "Producto no encontrado" };
      }

      // Parsear datos
      const rawData = {
        name: formData.get("name") as string,
        slug: formData.get("slug") as string,
        description: formData.get("description") as string,
        short_description: formData.get("short_description") as string,
        price: Number(formData.get("price")),
        compare_at_price: formData.get("compare_at_price")
          ? Number(formData.get("compare_at_price"))
          : null,
        cost: formData.get("cost") ? Number(formData.get("cost")) : null,
        stock: Number(formData.get("stock") || 0),
        sku: formData.get("sku") as string,
        track_inventory: formData.get("track_inventory") === "true",
        category_id: (formData.get("category_id") as string) || null,
        brand: formData.get("brand") as string,
        tags: formData.get("tags")
          ? (formData.get("tags") as string).split(",").map((t) => t.trim())
          : [],
        is_active: formData.get("is_active") !== "false",
        is_featured: formData.get("is_featured") === "true",
      };

      // Validar
      const validation = productSchema.partial().safeParse(rawData);
      if (!validation.success) {
        return {
          success: false,
          error: "Datos inválidos",
          details: validation.error.format(),
        };
      }

      // Manejar nuevas imágenes
      let images = currentProduct.images || [];
      const newImageFiles = formData.getAll("new_images") as File[];

      for (const file of newImageFiles) {
        if (file.size > 0) {
          try {
            const result = await uploadImage(file, {
              folder: "glamify/products",
            });
            images.push(result.url);
          } catch (error) {
            console.error("Error uploading image:", error);
          }
        }
      }

      // Eliminar imágenes marcadas
      const imagesToDelete = formData.getAll("delete_images") as string[];
      for (const imageUrl of imagesToDelete) {
        images = images.filter((img: string) => img !== imageUrl);
        // TODO: Extraer public_id de la URL y llamar deleteImage(publicId)
      }

      // Actualizar producto
      const { data: product, error } = await adminClient
        .from("products")
        .update({
          ...validation.data,
          images,
          thumbnail: images[0] || null,
        } as any)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("DB Error:", error);
        return { success: false, error: "Error al actualizar el producto" };
      }

      // Revalidar
      revalidatePath("/admin/products");
      revalidatePath("/productos");
      revalidatePath(`/productos/${product.slug}`);

      return { success: true, data: product };
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error inesperado",
    };
  }
}

/**
 * Eliminar producto
 */
export async function deleteProduct(id: string): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "No autenticado" };
    }

    return await withAdmin(user.id, async (adminClient) => {
      // Verificar que no hay órdenes con este producto
      const { data: orderItems } = await adminClient
        .from("order_items")
        .select("id")
        .eq("product_id", id)
        .limit(1);

      if (orderItems && orderItems.length > 0) {
        // En lugar de eliminar, desactivar
        const { error } = await adminClient
          .from("products")
          .update({ is_active: false })
          .eq("id", id);

        if (error) {
          return { success: false, error: "Error al desactivar el producto" };
        }

        revalidatePath("/admin/products");
        revalidatePath("/productos");

        return {
          success: true,
          data: { message: "Producto desactivado (tiene órdenes asociadas)" },
        };
      }

      // Si no hay órdenes, eliminar
      const { error } = await adminClient
        .from("products")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Delete error:", error);
        return { success: false, error: "Error al eliminar el producto" };
      }

      revalidatePath("/admin/products");
      revalidatePath("/productos");

      return { success: true, data: { message: "Producto eliminado" } };
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error inesperado",
    };
  }
}

/**
 * Bulk update de productos
 */
export async function bulkUpdateProducts(
  ids: string[],
  updates: Partial<ProductFormData>,
): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "No autenticado" };
    }

    return await withAdmin(user.id, async (adminClient) => {
      const { data, error } = await adminClient
        .from("products")
        .update(updates as any)
        .in("id", ids)
        .select();

      if (error) {
        return { success: false, error: "Error al actualizar productos" };
      }

      revalidatePath("/admin/products");
      revalidatePath("/productos");

      return {
        success: true,
        data: {
          message: `${data.length} productos actualizados`,
          products: data,
        },
      };
    });
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error inesperado",
    };
  }
}

/**
 * Duplicar producto
 */
export async function duplicateProduct(id: string): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "No autenticado" };
    }

    return await withAdmin(user.id, async (adminClient) => {
      // Obtener producto original
      const { data: original, error: fetchError } = await adminClient
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError || !original) {
        return { success: false, error: "Producto no encontrado" };
      }

      // Crear copia
      const {
        id: _id,
        slug: _slug,
        sku,
        created_at: _created_at,
        updated_at: _updated_at,
        ...productData
      } = original;

      const newProduct = {
        ...productData,
        name: `${original.name} (Copia)`,
        slug: generateSlug(`${original.name} copia ${Date.now()}`),
        sku: sku ? `${sku}-COPY-${Date.now()}` : null,
        is_active: false, // Desactivado por defecto
      };

      const { data, error } = await adminClient
        .from("products")
        .insert(newProduct as any)
        .select()
        .single();

      if (error) {
        console.error("Duplicate error:", error);
        return { success: false, error: "Error al duplicar el producto" };
      }

      revalidatePath("/admin/products");

      return { success: true, data };
    });
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error inesperado",
    };
  }
}
