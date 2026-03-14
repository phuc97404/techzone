import React from 'react';
import { getPosts, getNewsCategories } from '@/lib/news';
import NewsCard from '@/components/news/NewsCard';
import CategoryFilter from '@/components/news/CategoryFilter';

interface NewsPageProps {
  searchParams: {
    category?: string;
    page?: string;
  };
}

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const { category, page } = await searchParams;
  const currentPage = parseInt(page || '1');
  const limit = 9;

  const [categories, { posts, total, pages }] = await Promise.all([
    getNewsCategories(),
    getPosts({ 
      slug: category, // Using slug from URL to filter
      page: currentPage, 
      limit 
    })
  ]);

  return (
    <div className="bg-white min-h-screen">
      {/* Header Section */}
      <div className="bg-gray-900 py-16 mb-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            TechZone News
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Cập nhật tin tức công nghệ mới nhất, thủ thuật phần cứng và những đánh giá chi tiết từ chuyên gia.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-20">
        {/* Filter */}
        <CategoryFilter categories={categories} currentCategory={category} />

        {posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <NewsCard key={post.id} post={post} />
              ))}
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div className="mt-16 flex justify-center gap-2">
                {Array.from({ length: pages }).map((_, i) => (
                  <a
                    key={i}
                    href={`/news?${category ? `category=${category}&` : ''}page=${i + 1}`}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold transition-all ${
                      currentPage === i + 1
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {i + 1}
                  </a>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
            <h3 className="text-2xl font-bold text-gray-400">Không có bài viết nào trong mục này.</h3>
            <p className="text-gray-400 mt-2">Vui lòng quay lại sau hoặc chọn danh mục khác.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Tin tức & Thủ thuật Công nghệ | TechZone',
  description: 'Đọc những tin tức mới nhất về CPU, GPU, Gaming Gear và các thủ thuật PC tại TechZone.',
};
