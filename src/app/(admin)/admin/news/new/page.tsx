import React from 'react';
import { prisma } from '@/lib/prisma';
import NewsPostForm from '@/components/admin/news/NewsPostForm';

export const metadata = {
  title: "Viết bài mới - Admin TechZone",
};

export default async function NewNewsPage() {
  const categories = await (prisma as any).newsCategory.findMany({
    orderBy: { name: 'asc' }
  });

  return <NewsPostForm categories={categories} />;
}
