import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { Edit, Package, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { DeleteProductButton } from "./delete-button";

export default async function AdminProductsPage() {
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from("products")
    .select(
      `
      *,
      category:categories(name)
    `
    )
    .order("created_at", { ascending: false });

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("name");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Productos</h1>
          <p className="text-muted-foreground">
            Gestiona el catálogo de productos
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/productos/nuevo">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Producto
          </Link>
        </Button>
      </div>

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">
              Error al cargar productos: {error.message}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Asegurate de haber ejecutado el schema SQL en Supabase.
            </p>
          </CardContent>
        </Card>
      )}

      {products && products.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No hay productos</h3>
            <p className="text-muted-foreground text-center mt-2">
              Empezá agregando tu primer producto al catálogo
            </p>
            <Button className="mt-4" asChild>
              <Link href="/admin/productos/nuevo">
                <Plus className="mr-2 h-4 w-4" />
                Agregar Producto
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {products && products.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Listado de Productos</CardTitle>
            <CardDescription>
              {products.length} productos en el catálogo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-sm text-muted-foreground">
                    <th className="pb-3 font-medium">Producto</th>
                    <th className="pb-3 font-medium">Categoría</th>
                    <th className="pb-3 font-medium text-right">Precio</th>
                    <th className="pb-3 font-medium text-right">Stock</th>
                    <th className="pb-3 font-medium text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b last:border-0">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-muted">
                            {product.images?.[0] ? (
                              <Image
                                src={product.images[0]}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center">
                                <Package className="h-6 w-6 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-xs text-muted-foreground">
                              SKU: {product.sku || "-"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="rounded-full bg-muted px-2 py-1 text-xs">
                          {product.category?.name || "Sin categoría"}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <div>
                          <p className="font-medium">
                            ${product.price.toLocaleString("es-AR")}
                          </p>
                          {product.compare_at_price && (
                            <p className="text-xs text-muted-foreground line-through">
                              $
                              {product.compare_at_price.toLocaleString("es-AR")}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-4 text-right">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${
                            product.stock === 0
                              ? "bg-red-100 text-red-700"
                              : product.stock <
                                (product.low_stock_threshold || 5)
                              ? "bg-orange-100 text-orange-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {product.stock} uds
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/admin/productos/${product.id}`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <DeleteProductButton
                            productId={product.id}
                            productName={product.name}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
