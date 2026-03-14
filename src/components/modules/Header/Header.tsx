import Link from "next/link";
import { auth } from "@/lib/auth";
import MiniCart from "./MiniCart";
import SearchBar from "./SearchBar";
import { User, ShieldCheck } from "lucide-react";
import { Container } from "@mui/material";
import { getNewsCategories } from "@/lib/news";

const CATEGORIES = [
  { label: "CPU", href: "/products/cpu" },
  { label: "Mainboard", href: "/products/mainboard" },
  { label: "VGA - GPU", href: "/products/gpu" },
  { label: "RAM", href: "/products/ram" },
  { label: "SSD", href: "/products/ssd" },
  { label: "Màn Hình", href: "/products/man-hinh" },
  { label: "Phụ Kiện", href: "/products/phu-kien" },
  { label: "Tin tức", href: "/news", isNews: true },
];

export default async function Header() {
  const session = await auth();
  const newsCategories = await getNewsCategories();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/60 bg-slate-900/80 backdrop-blur-lg">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-pink-500 to-indigo-500 text-white text-xs font-medium py-1.5 text-center">
        <Container maxWidth="xl">
          <p>🔥 Hàng mới về: Khuyến mãi linh kiện PC đến 30% - MUA NGAY 🔥</p>
        </Container>
      </div>

      <Container maxWidth="xl">
        <div className="flex items-center justify-between h-20 gap-8">
          {/* Logo */}
          <Link href="/" className="flex flex-shrink-0 items-center gap-2 group">
            <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-pink-500 to-indigo-500 bg-clip-text text-transparent group-hover:from-pink-400 group-hover:to-indigo-400 transition-all">
              TechZone
            </span>
          </Link>

          {/* SearchBar */}
          <div className="flex-1 max-w-2xl px-4 hidden md:block">
            <SearchBar />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <MiniCart />
            
            <div className="h-8 w-px bg-slate-700/50 hidden sm:block" />

            {session?.user ? (
              <Link 
                href={session.user.role === 'ADMIN' ? '/admin' : '/account'} 
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 border border-slate-700/50 text-pink-400">
                   {session.user.role === 'ADMIN' ? <ShieldCheck size={16} /> : <User size={16} />}
                </div>
                <div className="hidden sm:flex flex-col">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                    {session.user.role === 'ADMIN' ? 'Quản trị' : 'Tài khoản'}
                  </span>
                  <span className="text-sm font-semibold truncate max-w-[100px] leading-tight text-slate-200">
                    {session.user.name?.split(' ')[session.user.name?.split(' ').length - 1] || 'Guest'}
                  </span>
                </div>
              </Link>
            ) : (
              <Link 
                href="/login" 
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors border border-slate-700/50"
              >
                <User size={18} className="text-pink-400" />
                <span className="hidden sm:inline">Đăng nhập</span>
              </Link>
            )}
          </div>
        </div>
      </Container>

      {/* Navigation */}
      <nav className="border-t border-slate-800/50 bg-slate-900/40">
        <Container maxWidth="xl">
          <ul className="flex items-center gap-6 overflow-x-auto scrollbar-hide py-3 text-sm font-medium">
            {CATEGORIES.map((cat) => (
              <li key={cat.href} className="flex-shrink-0 flex items-center gap-6">
                {cat.isNews && <div className="w-px h-4 bg-slate-700/50" />}
                <Link 
                  href={cat.href} 
                  className={`transition-colors block ${cat.isNews ? 'text-pink-400 hover:text-pink-300 font-bold' : 'text-slate-300 hover:text-pink-400'}`}
                >
                  {cat.label}
                </Link>
              </li>
            ))}
            
            {/* News Categories */}
            {newsCategories.map((cat: any) => (
              <li key={cat.id} className="flex-shrink-0">
                <Link 
                  href={`/news?category=${cat.slug}`} 
                  className="text-slate-400 hover:text-pink-400 transition-colors block text-xs"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </nav>
    </header>
  );
}
