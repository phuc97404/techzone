import React from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getPostBySlug, getRelatedPosts, getPosts } from '@/lib/news';
import NewsCard from '@/components/news/NewsCard';
import PostContent from '@/components/news/PostContent';
import { Calendar, User, Clock, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';

interface PostDetailPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PostDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) return { title: 'Bài viết không tồn tại' };

  return {
    title: `${post.title} | TechZone News`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.thumbnail],
      type: 'article',
    },
  };
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const relatedPosts = await getRelatedPosts(post.categoryId, post.id);

  const formattedDate = new Date(post.createdAt).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Breadcrumb & Hero */}
      <div className="container mx-auto px-4 pt-8 mb-8">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-blue-600">Trang chủ</Link>
          <ChevronRight size={14} />
          <Link href="/news" className="hover:text-blue-600">Tin tức</Link>
          <ChevronRight size={14} />
          <span className="text-gray-900 font-medium truncate">{post.title}</span>
        </nav>

        <header className="max-w-4xl mx-auto text-center">
          <Link 
            href={`/news?category=${post.category.slug}`}
            className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-bold mb-4 hover:bg-blue-100 transition-colors"
          >
            {post.category.name}
          </Link>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-8 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap justify-center items-center gap-6 text-gray-500 text-sm mb-12">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <User size={16} />
              </div>
              <span className="font-semibold text-gray-900">Ban biên tập TechZone</span>
            </div>
            <div className="flex items-center gap-2 border-l border-gray-200 pl-6">
              <Calendar size={18} />
              <span>{formattedDate}</span>
            </div>
          </div>
        </header>

        {/* Feature Image */}
        <div className="relative aspect-[21/9] w-full max-w-6xl mx-auto rounded-3xl overflow-hidden shadow-2xl mb-16">
          <Image
            src={post.thumbnail}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <PostContent content={post.content} />
          
          <div className="mt-16 pt-10 border-t border-gray-100 italic text-gray-400 text-sm">
            Lưu ý: Nội dung này thuộc bản quyền của TechZone. Vui lòng ghi rõ nguồn khi trích dẫn.
          </div>
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="bg-gray-50 mt-20 py-20 border-t border-gray-100">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Bài viết liên quan</h2>
                <p className="text-gray-500">Xem thêm các bài viết cùng chủ đề {post.category.name}</p>
              </div>
              <Link href="/news" className="text-blue-600 font-bold hover:underline mb-2 flex items-center gap-1">
                Xem tất cả <ChevronRight size={18} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <NewsCard key={relatedPost.id} post={relatedPost} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
