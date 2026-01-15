"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import type { Category, Product } from "@/types";
import { ArrowLeft, Loader2, Save, Upload, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface ProductFormProps {
  product?: Product;
  categories: Category[];
}

export function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter();
  const isEditing = !!product;

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    description: product?.description || "",
    price: product?.price || 0,
    compare_at_price: product?.compare_at_price || null,
    sku: product?.sku || "",
    stock: product?.stock || 0,
    low_stock_threshold: product?.low_stock_threshold || 5,
    category_id: product?.category_id || "",
    is_active: product?.is_active ?? true,
    is_featured: product?.is_featured ?? false,
    images: product?.images || [],
  });
  const [imageUrl, setImageUrl] = useState("");

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: isEditing ? prev.slug : generateSlug(name),
    }));
  };

  const addImageUrl = () => {
    if (imageUrl && !formData.images.includes(imageUrl)) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, imageUrl],
      }));
      setImageUrl("");
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const supabase = createClient();

      // Generate SKU if not provided
      const generatedSku =
        formData.sku ||
        `GLM-${Date.now().toString(36).toUpperCase()}-${Math.random()
          .toString(36)
          .substring(2, 5)
          .toUpperCase()}`;

      const productData = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description || null,
        price: Number(formData.price),
        compare_at_price: formData.compare_at_price
          ? Number(formData.compare_at_price)
          : null,
        sku: generatedSku,
        stock: Number(formData.stock),
        low_stock_threshold: Number(formData.low_stock_threshold),
        category_id: formData.category_id || null,
        is_active: formData.is_active,
        is_featured: formData.is_featured,
        images: formData.images,
      };

      if (isEditing) {
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", product.id);

        if (error) throw error;
        toast.success("Producto actualizado");
      } else {
        const { error } = await supabase.from("products").insert(productData);

        if (error) throw error;
        toast.success("Producto creado");
      }

      router.push("/admin/productos");
      router.refresh();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Error desconocido";
      toast.error("Error al guardar producto", {
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button type="button" variant="ghost" size="icon" asChild>
            <Link href="/admin/productos">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {isEditing ? "Editar Producto" : "Nuevo Producto"}
            </h1>
            <p className="text-muted-foreground">
              {isEditing
                ? "Modificá los datos del producto"
                : "Agregá un nuevo producto al catálogo"}
            </p>
          </div>
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {isEditing ? "Guardar Cambios" : "Crear Producto"}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Info */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Información General</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Ej: Labial Matte Rose"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug (URL)</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, slug: e.target.value }))
                    }
                    placeholder="labial-matte-rose"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Describe el producto..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoría</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, category_id: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccioná una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Precios</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="price">Precio *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      $
                    </span>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          price: Number(e.target.value),
                        }))
                      }
                      placeholder="0"
                      className="pl-8"
                      min="0"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="compare_at_price">
                    Precio anterior (tachado)
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      $
                    </span>
                    <Input
                      id="compare_at_price"
                      type="number"
                      value={formData.compare_at_price || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          compare_at_price: e.target.value
                            ? Number(e.target.value)
                            : null,
                        }))
                      }
                      placeholder="0"
                      className="pl-8"
                      min="0"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Si tiene precio anterior, se mostrará como oferta
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Imágenes</CardTitle>
              <CardDescription>
                Subí imágenes del producto (arrastrá o hacé click)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Cloudinary Upload Widget */}
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={async (e) => {
                    const files = e.target.files;
                    if (!files) return;

                    for (const file of Array.from(files)) {
                      const formDataUpload = new FormData();
                      formDataUpload.append("file", file);
                      formDataUpload.append(
                        "upload_preset",
                        "glamify_products"
                      );

                      try {
                        const res = await fetch(
                          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                          {
                            method: "POST",
                            body: formDataUpload,
                          }
                        );
                        const data = await res.json();
                        if (data.secure_url) {
                          setFormData((prev) => ({
                            ...prev,
                            images: [...prev.images, data.secure_url],
                          }));
                          toast.success("Imagen subida");
                        }
                      } catch {
                        toast.error("Error al subir imagen");
                      }
                    }
                    e.target.value = "";
                  }}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Click para seleccionar imágenes
                  </p>
                </label>
              </div>

              {/* También permitir URL manual */}
              <div className="flex gap-2">
                <Input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="O pegá una URL de imagen..."
                />
                <Button type="button" variant="outline" onClick={addImageUrl}>
                  Agregar URL
                </Button>
              </div>

              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {formData.images.map((img, index) => (
                    <div key={index} className="relative group">
                      <div className="relative aspect-square overflow-hidden rounded-lg border">
                        <Image
                          src={img}
                          alt={`Imagen ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -right-2 -top-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Stock</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, sku: e.target.value }))
                    }
                    placeholder="LAB-001"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Cantidad en stock *</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        stock: Number(e.target.value),
                      }))
                    }
                    min="0"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="low_stock">Alerta de bajo stock</Label>
                  <Input
                    id="low_stock"
                    type="number"
                    value={formData.low_stock_threshold}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        low_stock_threshold: Number(e.target.value),
                      }))
                    }
                    min="0"
                  />
                  <p className="text-xs text-muted-foreground">
                    Se mostrará alerta cuando el stock sea menor
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Visibilidad</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="is_active">Activo</Label>
                  <p className="text-xs text-muted-foreground">
                    Visible en la tienda
                  </p>
                </div>
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, is_active: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="is_featured">Destacado</Label>
                  <p className="text-xs text-muted-foreground">
                    Mostrar en inicio
                  </p>
                </div>
                <Switch
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, is_featured: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
