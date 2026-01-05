// Store configuration
export const storeConfig = {
  name: 'Glamify Makeup',
  description: 'Tu tienda de maquillaje favorita',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  
  // Contact
  email: 'contacto@glamify.com',
  phone: '+54 9 11 1234-5678',
  instagram: '@glamifymakeup',
  
  // Location (Argentina)
  country: 'Argentina',
  currency: 'ARS',
  currencySymbol: '$',
  locale: 'es-AR',
  
  // Shipping
  freeShippingThreshold: 50000, // Free shipping over $50,000 ARS
  defaultShippingCost: 3500,
  
  // Business
  businessHours: 'Lun - Vie: 9:00 - 18:00',
  
  // SEO
  seo: {
    title: 'Glamify Makeup | Maquillaje Profesional',
    description: 'Descubrí los mejores productos de maquillaje. Envíos a todo el país. ¡Realzá tu belleza con Glamify!',
    keywords: ['maquillaje', 'cosméticos', 'belleza', 'makeup', 'Argentina'],
  },
  
  // Social
  social: {
    instagram: 'https://instagram.com/glamifymakeup',
    facebook: 'https://facebook.com/glamifymakeup',
    tiktok: 'https://tiktok.com/@glamifymakeup',
  },
} as const

export type StoreConfig = typeof storeConfig
