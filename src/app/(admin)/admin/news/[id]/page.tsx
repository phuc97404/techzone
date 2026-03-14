import React from 'react';
import { prisma } from '@/lib/prisma';
import NewsPostForm from '@/components/admin/news/NewsPostForm';
import { notFound } from 'next/navigation';

export const metadata = {
  title: "Chỉnh sửa bài viết - Admin TechZone",
};

interface EditNewsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditNewsPage({ params }: EditNewsPageProps) {
  const { id } = await params;

  const [post, categories] = await Promise.all([
    (prisma as any).post.findUnique({
      where: { id }
    }),
    (prisma as any).newsCategory.findMany({
      orderBy: { name: 'asc' }
    })
  ]);

  if (!post) {
    return notFound();
  }

  return <NewsPostForm initialData={post} categories={categories} />;
}
