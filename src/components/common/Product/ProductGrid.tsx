import Link from "next/link";
import { ProductCard } from "./ProductCard";
import { Container, Typography } from "@mui/material";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface ProductGridProps {
  title: string;
  products: any[];
  viewAllLink?: string;
}

export default function ProductGrid({ title, products, viewAllLink }: ProductGridProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-12 bg-slate-900">
      <Container maxWidth="xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-l-4 border-pink-500 pl-4">
          <Typography variant="h4" component="h2" className="text-2xl md:text-3xl font-black text-slate-100 uppercase tracking-wide">
            {title}
          </Typography>
          {viewAllLink && (
            <Link 
              href={viewAllLink} 
              className="text-pink-400 font-bold hover:text-pink-300 transition-colors uppercase text-sm tracking-wider flex items-center gap-2"
            >
              Xem tất cả →
            </Link>
          )}
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Container>
    </section>
  );
}
