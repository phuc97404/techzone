import React from 'react';
import Link from 'next/link';

interface CategoryFilterProps {
  categories: { id: string; name: string; slug: string }[];
  currentCategory?: string;
}

export default function CategoryFilter({ categories, currentCategory }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-10 pb-4 border-b border-gray-100">
      <Link
        href="/news"
        className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
          !currentCategory
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
        }`}
      >
        Tất cả
      </Link>
      
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/news?category=${cat.slug}`}
          className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
            currentCategory === cat.slug
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
          }`}
        >
          {cat.name}
        </Link>
      ))}
    </div>
  );
}
