import { Metadata } from "next";

export const SITE_CONFIG = {
  name: "TechZone",
  description: "Cửa hàng linh kiện máy tính, laptop và phụ kiện công nghệ hàng đầu.",
  url: process.env.NEXT_PUBLIC_BASE_URL || "https://techzone.com",
  ogImage: "/og-image.jpg",
  links: {
    twitter: "https://twitter.com/techzone",
    facebook: "https://facebook.com/techzone",
  },
};

export function constructMetadata({
  title = SITE_CONFIG.name,
  description = SITE_CONFIG.description,
  image = SITE_CONFIG.ogImage,
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
} = {}): Metadata {
  return {
    title: {
      default: title,
      template: `%s | ${SITE_CONFIG.name}`,
    },
    description,
    keywords: [
      "linh kiện máy tính",
      "PC gaming",
      "laptop",
      "build PC",
      "TechZone",
      "phụ kiện máy tính",
    ],
    authors: [{ name: "TechZone Team" }],
    creator: "TechZone",
    openGraph: {
      type: "website",
      locale: "vi_VN",
      url: SITE_CONFIG.url,
      title,
      description,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@techzone",
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon-16x16.png",
      apple: "/apple-touch-icon.png",
    },
    metadataBase: new URL(SITE_CONFIG.url),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}

export function getProductSchema(product: any) {
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image: product.images,
    description: product.description,
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: product.brand?.name || "TechZone",
    },
    offers: {
      "@type": "Offer",
      url: `${SITE_CONFIG.url}/products/${product.category?.slug}/${product.slug}`,
      priceCurrency: "VND",
      price: product.salePrice || product.price,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: SITE_CONFIG.name,
      },
    },
  };
}
