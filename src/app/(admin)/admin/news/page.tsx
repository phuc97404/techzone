import React from 'react';
import { getPosts } from '@/lib/news';
import NewsListTable from '@/components/admin/news/NewsListTable';
import { Box } from '@mui/material';
import NewsHeader from '@/components/admin/news/NewsHeader';

export default async function AdminNewsPage() {
  const { posts } = await getPosts({ limit: 100 });

  return (
    <Box sx={{ p: 4 }}>
      {/* Header (Includes Breadcrumbs) */}
      <NewsHeader />

      {/* Table */}
      <NewsListTable posts={posts} />
    </Box>
  );
}
