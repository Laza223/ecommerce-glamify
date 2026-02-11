// lib/cloudinary.ts
import { v2 as cloudinary } from "cloudinary";

// Configurar Cloudinary
if (!process.env.CLOUDINARY_API_KEY) {
  console.warn("Cloudinary not configured");
} else {
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

/**
 * Obtener URL optimizada de Cloudinary
 */
export function getOptimizedImageUrl(
  url: string,
  options?: {
    width?: number;
    height?: number;
    quality?: number | "auto";
    format?: "auto" | "webp" | "avif";
  },
): string {
  // Si no es una URL de Cloudinary, devolverla tal cual
  if (!url || !url.includes("cloudinary")) {
    return url;
  }

  const {
    width = 800,
    height,
    quality = "auto:good",
    format = "auto",
  } = options || {};

  // Construir transformaciones
  const transformations: string[] = [
    `f_${format}`,
    `q_${quality}`,
    `w_${width}`,
    "c_limit", // No hacer la imagen más grande que el original
    "dpr_auto", // Device Pixel Ratio automático
  ];

  if (height) {
    transformations.push(`h_${height}`);
  }

  // Aplicar transformaciones
  const transformString = transformations.join(",");

  // Insertar transformaciones en la URL
  return url.replace("/upload/", `/upload/${transformString}/`);
}

/**
 * Subir imagen a Cloudinary
 */
export async function uploadImage(
  file: File | string, // File o base64
  options?: {
    folder?: string;
    publicId?: string;
    tags?: string[];
  },
): Promise<{
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  size: number;
}> {
  try {
    let base64: string;

    if (typeof file === "string") {
      base64 = file;
    } else {
      // Convertir File a base64
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      base64 = `data:${file.type};base64,${buffer.toString("base64")}`;
    }

    const result = await cloudinary.uploader.upload(base64, {
      folder: options?.folder || "glamify/products",
      public_id: options?.publicId,
      tags: options?.tags,
      transformation: [
        { width: 2000, height: 2000, crop: "limit" },
        { quality: "auto:best" },
      ],
      allowed_formats: ["jpg", "png", "webp", "avif"],
      resource_type: "auto",
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      size: result.bytes,
    };
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw new Error("Error al subir la imagen");
  }
}

/**
 * Eliminar imagen de Cloudinary
 */
export async function deleteImage(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    throw new Error("Error al eliminar la imagen");
  }
}

/**
 * Generar blur placeholder para Next.js Image
 */
export function getBlurDataUrl(url: string): string {
  if (!url || !url.includes("cloudinary")) {
    return "";
  }

  // Generar una versión super pequeña y borrosa
  return url.replace(
    "/upload/",
    "/upload/w_10,h_10,c_fill,e_blur:1000,f_auto,q_1/",
  );
}
