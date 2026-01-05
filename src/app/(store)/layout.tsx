import { Footer } from "@/components/shared/footer";
import { Header } from "@/components/shared/header";
import { storeConfig } from "@/config/store";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: storeConfig.seo.title,
    template: `%s | ${storeConfig.name}`,
  },
  description: storeConfig.seo.description,
  keywords: [...storeConfig.seo.keywords],
  openGraph: {
    title: storeConfig.seo.title,
    description: storeConfig.seo.description,
    url: storeConfig.url,
    siteName: storeConfig.name,
    locale: storeConfig.locale,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: storeConfig.seo.title,
    description: storeConfig.seo.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
