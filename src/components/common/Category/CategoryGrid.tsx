import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Container, Typography } from "@mui/material";

export default async function CategoryGrid() {
  const categories = await prisma.category.findMany({
    take: 7,
    orderBy: { id: "asc" }
  });

  return (
    <section className="py-12 bg-slate-900/40">
      <Container maxWidth="xl">
        <Typography variant="h4" component="h2" className="text-2xl md:text-3xl font-black text-slate-100 mb-8 border-l-4 border-pink-500 pl-4 uppercase tracking-wide">
          Danh mục nội bật
        </Typography>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {categories.map((cat) => (
            <Link 
              key={cat.id} 
              href={`/products/${cat.slug}`} 
              className="flex flex-col items-center justify-center gap-4 bg-slate-800 border border-slate-700/50 p-6 rounded-2xl hover:-translate-y-2 hover:border-pink-500/50 hover:shadow-[0_10px_30px_rgba(236,72,153,0.15)] transition-all group"
            >
               <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-500/10 to-indigo-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 group-hover:scale-110 group-hover:bg-gradient-to-tr group-hover:from-pink-500 group-hover:to-indigo-500 group-hover:text-white transition-all shadow-inner">
                 <span className="text-2xl font-black">{cat.name.charAt(0)}</span>
               </div>
               <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors text-center uppercase tracking-wider">
                 {cat.name}
               </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
