import type { Metadata } from "next";
import "@/styles/globals.css";
import ThemeRegistry from "@/components/layout/ThemeRegistry";

export const metadata: Metadata = {
  title: {
    default: "Hupu - In 3D Custom Theo Yêu Cầu",
    template: "%s | Hupu",
  },
  description:
    "Hupu - Chuyên dịch vụ In 3D Custom theo yêu cầu: Máy in 3D, Filament, Mô hình Custom, Phụ kiện & Thiết kế 3D. Chất lượng cao, giá tốt nhất.",
  keywords: [
    "in 3D",
    "in 3D custom",
    "máy in 3D",
    "filament",
    "mô hình 3D",
    "3D printing",
    "prototype",
    "hupu",
  ],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "Hupu",
    title: "Hupu - In 3D Custom Theo Yêu Cầu",
    description:
      "Chuyên dịch vụ In 3D Custom theo yêu cầu. Máy in 3D, Filament, Mô hình Custom, Phụ kiện & Thiết kế 3D.",
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

