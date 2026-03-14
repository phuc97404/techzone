"use client";

import React, { useTransition } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Switch, IconButton, Typography, Box, Chip
} from '@mui/material';
import { Edit, Trash2, ExternalLink } from 'lucide-react';
import { toggleFeatured, deletePost } from '@/app/actions/news';
import Link from 'next/link';

interface NewsListTableProps {
  posts: any[];
}

export default function NewsListTable({ posts }: NewsListTableProps) {
  const [isPending, startTransition] = useTransition();

  const handleToggleFeatured = (id: string, current: boolean) => {
    startTransition(async () => {
      const result = await toggleFeatured(id, !current);
      if (!result.success) alert(result.error);
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Anh có chắc muốn xóa bài viết này không?')) {
      startTransition(async () => {
        const result = await deletePost(id);
        if (!result.success) alert(result.error);
      });
    }
  };

  return (
    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #eee', borderRadius: 4 }}>
      <Table>
        <TableHead sx={{ bgcolor: '#f8f9fa' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>Tiêu đề bài viết</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Danh mục</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Ngày đăng</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Nổi bật</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }} align="right">Thao tác</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id} hover>
              <TableCell sx={{ maxWidth: 300 }}>
                <Typography variant="body2" fontWeight="medium" noWrap>
                  {post.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  /{post.slug}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip label={post.category.name} size="small" variant="outlined" />
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                </Typography>
              </TableCell>
              <TableCell>
                <Switch 
                  size="small"
                  checked={post.isFeatured}
                  onChange={() => handleToggleFeatured(post.id, post.isFeatured)}
                  disabled={isPending}
                />
              </TableCell>
              <TableCell align="right">
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                  <IconButton 
                    size="small" 
                    component={Link} 
                    href={`/news/${post.slug}`} 
                    target="_blank"
                    sx={{ color: '#6366f1' }}
                  >
                    <ExternalLink size={18} />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    component={Link} 
                    href={`/admin/news/${post.id}`}
                    sx={{ color: '#2563eb' }}
                  >
                    <Edit size={18} />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    onClick={() => handleDelete(post.id)}
                    sx={{ color: '#ef4444' }}
                    disabled={isPending}
                  >
                    <Trash2 size={18} />
                  </IconButton>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
