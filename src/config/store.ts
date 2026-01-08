// Store configuration
export const storeConfig = {
  name: "Glamify Makeup",
  description: "Tienda de maquillaje en Argentina",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",

  // Contact
  email: "contacto@glamifymakeup.com",
  phone: "+54 9 2323 582495",
  whatsapp: "https://wa.me/message/GVFU3Q3GOGWSG1",
  instagram: "@glamifymakeup_",

  // Location (Argentina)
  country: "Argentina",
  city: "Luján, Buenos Aires",
  currency: "ARS",
  currencySymbol: "$",
  locale: "es-AR",

  // Shipping
  freeShippingThreshold: 24999, // Free shipping over $24.999 ARS (Luján only)
  defaultShippingCost: 0, // Dynamic calculation based on location
  freeShippingZone: "Luján, Buenos Aires",

  // Business
  businessHours: "Lun - Vie: 9:00 - 18:00",

  // SEO
  seo: {
    title: "Glamify Makeup | Tu tienda de maquillaje",
    description:
      "Descubrí los mejores productos de maquillaje. Envíos a todo el país desde Luján, Buenos Aires. ¡Realzá tu belleza con Glamify!",
    keywords: [
      "maquillaje",
      "cosméticos",
      "belleza",
      "makeup",
      "Argentina",
      "Luján",
    ],
  },

  // Social
  social: {
    instagram: "https://www.instagram.com/glamifymakeup_/",
    facebook: "https://www.facebook.com/profile.php?id=61577747251254",
    tiktok: "https://www.tiktok.com/@glamifymakeup_",
  },
} as const;

export type StoreConfig = typeof storeConfig;
