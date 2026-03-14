import React from 'react';
import Link from 'next/link';
import { ChevronRight, Zap } from 'lucide-react';
import { getFeaturedPosts, PostWithCategory } from '@/lib/news';
import NewsCard from './NewsCard';

export default async function FeaturedNews() {
  const posts: PostWithCategory[] = await getFeaturedPosts(4);

  if (posts.length === 0) return null;

  return (
    <section className="py-24 bg-slate-900 border-t border-slate-800">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm uppercase tracking-wider mb-2">
              <Zap size={16} fill="currentColor" />
              <span>Cập nhật công nghệ</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              Tin tức & Blog
            </h2>
            <p className="mt-4 text-slate-400 text-lg">
              Đừng bỏ lỡ những thông tin công nghệ cực HOT và mẹo vặt PC hữu ích từ đội ngũ chuyên gia TechZone.
            </p>
          </div>
          
          <Link 
            href="/news" 
            className="group flex items-center gap-1 bg-white text-slate-900 px-6 py-3 rounded-full hover:bg-indigo-400 hover:text-white transition-all shadow-xl"
          >
            Xem tất cả tin tức
            <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {posts.map((post) => (
            <NewsCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
