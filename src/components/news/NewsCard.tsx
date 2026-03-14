import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ArrowRight } from 'lucide-react';
import { PostWithCategory } from '@/lib/news';

interface NewsCardProps {
  post: PostWithCategory;
}

export default function NewsCard({ post }: NewsCardProps) {
  const formattedDate = new Date(post.createdAt).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <div className="group flex flex-col bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-700/50 transition-all duration-300 hover:shadow-2xl hover:bg-slate-800 hover:-translate-y-1">
      {/* Thumbnail */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={post.thumbnail}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-indigo-600/90 text-white text-[10px] font-black px-2 py-1 rounded-lg backdrop-blur-md uppercase tracking-wider">
            {post.category.name}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-5 flex flex-col">
        <div className="flex items-center gap-4 text-[10px] text-slate-500 mb-3 uppercase font-bold tracking-widest">
          <div className="flex items-center gap-1">
            <Calendar size={12} />
            <span>{formattedDate}</span>
          </div>
        </div>

        <Link href={`/news/${post.slug}`}>
          <h3 className="text-lg font-bold text-white mb-3 line-clamp-2 transition-colors group-hover:text-indigo-400 leading-snug">
            {post.title}
          </h3>
        </Link>

        <p className="text-slate-400 text-xs mb-6 line-clamp-3 leading-relaxed">
          {post.excerpt}
        </p>

        <div className="mt-auto pt-4 border-t border-slate-700/50 flex justify-between items-center">
          <Link 
            href={`/news/${post.slug}`}
            className="text-indigo-400 text-xs font-black flex items-center gap-1 group/btn uppercase tracking-widest"
          >
            Đọc tiếp 
            <ArrowRight size={14} className="transition-transform group-hover/btn:translate-x-1" />
          </Link>
          
          {post.isFeatured && (
            <span className="text-[9px] uppercase font-black text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              Nổi bật
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
