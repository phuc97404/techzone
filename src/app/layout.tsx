import type { Metadata } from "next";
import "@/styles/globals.css";
import ThemeRegistry from "@/components/layout/ThemeRegistry";

export const metadata: Metadata = {
  title: {
    default: "TechZone - Linh Kiện Máy Tính Chính Hãng",
    template: "%s | TechZone",
  },
  description:
    "TechZone - Chuyên cung cấp linh kiện máy tính chính hãng: CPU, GPU, RAM, SSD, Mainboard, Màn hình & Phụ kiện. Giá tốt nhất, bảo hành uy tín.",
  keywords: [
    "linh kiện máy tính",
    "CPU",
    "GPU",
    "RAM",
    "SSD",
    "mainboard",
    "màn hình",
    "phụ kiện gaming",
    "build PC",
    "techzone",
  ],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "TechZone",
    title: "TechZone - Linh Kiện Máy Tính Chính Hãng",
    description:
      "Chuyên cung cấp linh kiện máy tính chính hãng. CPU, GPU, RAM, SSD, Mainboard, Màn hình & Phụ kiện.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body suppressHydrationWarning>
        <ThemeRegistry>
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}

