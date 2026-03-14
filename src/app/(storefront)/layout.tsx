import Header from "@/components/modules/Header/Header";
import Footer from "@/components/modules/Footer";

export default function StorefrontLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </>
  );
}
