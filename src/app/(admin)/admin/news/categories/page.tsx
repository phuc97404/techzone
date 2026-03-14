import React from 'react';
import { prisma } from '@/lib/prisma';
import CategoryManagement from '@/components/admin/news/categories/CategoryManagement';
import { Box, Typography, Breadcrumbs } from '@mui/material';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export const metadata = {
  title: "Quản lý danh mục - Admin TechZone",
};

export default async function AdminNewsCategoriesPage() {
  const categories = await (prisma as any).newsCategory.findMany({
    include: {
      _count: {
        select: { posts: true }
      }
    },
    orderBy: { name: 'asc' }
  });

  return (
    <Box sx={{ p: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs separator={<ChevronRight size={16} />} sx={{ mb: 2 }}>
        <Link href="/admin" className="text-gray-500 hover:text-blue-600 text-sm">Admin</Link>
        <Link href="/admin/news" className="text-gray-500 hover:text-blue-600 text-sm">Tin tức</Link>
        <Typography variant="body2" color="text.primary" sx={{ fontSize: '0.875rem' }}>Danh mục</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="900" gutterBottom>
          📂 Danh mục Tin tức
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Quản lý các chuyên mục bài viết. Anh có thể thêm mới, đổi tên hoặc xóa các mục không cần thiết.
        </Typography>
      </Box>

      <CategoryManagement categories={categories} />
    </Box>
  );
}
