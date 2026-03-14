"use client";

import React from 'react';
import { Button, Typography, Box, Stack, Breadcrumbs } from '@mui/material';
import Link from 'next/link';
import { PlusCircle, ChevronRight } from 'lucide-react';

export default function NewsHeader() {
  return (
    <Box sx={{ mb: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs 
        separator={<ChevronRight size={16} />} 
        sx={{ mb: 2, '& .MuiBreadcrumbs-li': { fontSize: '0.85rem' } }}
      >
        <Link href="/admin" className="text-gray-500 hover:text-blue-600">Admin</Link>
        <Typography color="text.primary" sx={{ fontSize: '0.85rem' }}>Quản lý Tin tức</Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight="900" gutterBottom>
            📰 Quản lý Tin tức
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Danh sách tất cả bài viết trên hệ thống. Anh có thể thêm, sửa, xóa hoặc chọn tin nổi bật.
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button 
            variant="outlined" 
            component={Link}
            href="/admin/news/categories"
            sx={{ 
              borderRadius: 3, 
              textTransform: 'none', 
              fontWeight: 'bold',
              px: 3,
              py: 1
            }}
          >
            Quản lý danh mục
          </Button>
          <Button 
            variant="contained" 
            startIcon={<PlusCircle size={20} />}
            component={Link}
            href="/admin/news/new"
            sx={{ 
              borderRadius: 3, 
              textTransform: 'none', 
              fontWeight: 'bold',
              bgcolor: '#2563eb',
              '&:hover': { bgcolor: '#1d4ed8' },
              px: 3,
              py: 1
            }}
          >
            Viết bài mới
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
