import Link from "next/link";
import Image from "next/image";
import { Container, Button, Typography } from "@mui/material";

export default function HeroBanner() {
  return (
    <section className="py-8 md:py-12">
      <Container maxWidth="xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Banner */}
          <div className="lg:col-span-2 relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-700/50 shadow-2xl flex flex-col justify-center min-h-[500px] p-8 md:p-12 lg:p-16 group">
            <div className="absolute inset-0 bg-gradient-to-tr from-pink-600/20 to-indigo-600/20 transition-opacity duration-500 group-hover:opacity-75" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-pink-500/10 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
            
            {/* 3D PC Image */}
            <div className="absolute right-[-5%] top-1/2 -translate-y-1/2 w-[55%] h-[90%] hidden md:block transition-transform duration-700 group-hover:scale-105 group-hover:-rotate-2">
              <Image 
                src="/images/hero/pc-hero.png"
                alt="PC Gaming"
                fill
                className="object-contain drop-shadow-[0_0_50px_rgba(236,72,153,0.3)]"
                priority
              />
            </div>

            <div className="relative z-10 max-w-lg">
              <span className="inline-block px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-black tracking-wider mb-6 shadow-sm">
                MỚI NHẤT 2024
              </span>
              <Typography variant="h2" component="h1" className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                Cấu Hình <span className="bg-gradient-to-r from-pink-500 to-indigo-500 bg-clip-text text-transparent">PC Gaming</span> Siêu Khủng
              </Typography>
              <Typography variant="body1" className="text-lg text-slate-300 mb-8 leading-relaxed max-w-md">
                Sức mạnh vượt trội, đồ hoạ mượt mà. Giảm giá ngay 15% cho 100 khách hàng đầu tiên!
              </Typography>
              <div className="flex flex-wrap items-center gap-4">
                <Link href="/products/pc-gaming" passHref>
                  <Button variant="contained" className="bg-gradient-to-r from-pink-500 to-indigo-500 text-white font-bold px-8 py-3.5 rounded-xl shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] hover:-translate-y-1 transition-all normal-case text-base">
                    Build Ngay
                  </Button>
                </Link>
                <Link href="/promotions" passHref>
                  <Button variant="outlined" className="border-slate-500 text-slate-300 font-bold px-8 py-3.5 rounded-xl hover:bg-slate-800 hover:border-slate-400 transition-all normal-case text-base">
                    Xem Chi Tiết
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Side Banners */}
          <div className="flex flex-col gap-6">
            {/* GPU Banner */}
            <Link href="/products/gpu" className="group flex-1 relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-700/50 p-8 flex flex-col justify-center min-h-[240px] shadow-lg hover:border-blue-500/50 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-slate-900 group-hover:from-blue-600/30 transition-colors" />
              
              <div className="absolute right-[-10%] top-1/2 -translate-y-1/2 w-[60%] h-[80%] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                <Image 
                  src="/images/hero/gpu-hero.png"
                  alt="RTX 4090"
                  fill
                  className="object-contain drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]"
                />
              </div>

              <div className="relative z-10">
                <Typography variant="h4" className="text-2xl font-black text-white mb-1">
                  RTX 40 Series
                </Typography>
                <Typography variant="body2" className="text-blue-400 font-bold mb-4 uppercase tracking-tighter">
                  Quái vật đồ họa
                </Typography>
                <span className="inline-flex font-bold text-sm text-slate-400 group-hover:text-blue-400 group-hover:translate-x-1 transition-all">
                  Mua ngay →
                </span>
              </div>
            </Link>

            {/* CPU Banner */}
            <Link href="/products/cpu" className="group flex-1 relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-700/50 p-8 flex flex-col justify-center min-h-[240px] shadow-lg hover:border-purple-500/50 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-slate-900 group-hover:from-purple-600/30 transition-colors" />
              
              <div className="absolute right-[-10%] top-1/2 -translate-y-1/2 w-[60%] h-[80%] transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3">
                <Image 
                  src="/images/hero/cpu-hero.png"
                  alt="Intel CPU"
                  fill
                  className="object-contain drop-shadow-[0_0_30px_rgba(168,85,247,0.3)]"
                />
              </div>

              <div className="relative z-10">
                <Typography variant="h4" className="text-2xl font-black text-white mb-1">
                  Intel Core 14th
                </Typography>
                <Typography variant="body2" className="text-purple-400 font-bold mb-4 uppercase tracking-tighter">
                  Đỉnh cao hiệu năng
                </Typography>
                <span className="inline-flex font-bold text-sm text-slate-400 group-hover:text-purple-400 group-hover:translate-x-1 transition-all">
                  Mua ngay →
                </span>
              </div>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
