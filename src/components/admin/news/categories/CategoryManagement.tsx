"use client";

import React, { useState, useTransition } from 'react';
import { 
  Box, TextField, Button, Paper, Typography, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, IconButton, Stack, Card, CardContent
} from '@mui/material';
import { Edit, Trash2, Plus, Save, X } from 'lucide-react';
import { upsertNewsCategory, deleteNewsCategory } from '@/app/actions/news';

interface Category {
  id: string;
  name: string;
  slug: string;
  _count?: {
    posts: number;
  };
}

interface CategoryManagementProps {
  categories: Category[];
}

export default function CategoryManagement({ categories }: CategoryManagementProps) {
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', slug: '' });

  const handleEdit = (cat: Category) => {
    setEditingId(cat.id);
    setFormData({ name: cat.name, slug: cat.slug });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ name: '', slug: '' });
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/([^0-9a-z-\s])/g, '')
      .replace(/(\s+)/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData(prev => ({
      ...prev,
      name,
      slug: editingId ? prev.slug : generateSlug(name) // Auto-slug only for new items
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const result = await upsertNewsCategory({
        id: editingId || undefined,
        ...formData
      });
      if (result.success) {
        handleCancel();
      } else {
        alert(result.error);
      }
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Anh có chắc muốn xóa danh mục này?')) {
      startTransition(async () => {
        const result = await deleteNewsCategory(id);
        if (!result.success) alert(result.error);
      });
    }
  };

  return (
    <Box>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="flex-start">
        {/* Form Column */}
        <Box sx={{ width: { xs: '100%', md: 350 } }}>
          <Card elevation={0} sx={{ border: '1px solid #eee', borderRadius: 4 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {editingId ? '📝 Sửa danh mục' : '➕ Thêm danh mục mới'}
              </Typography>
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                <Stack spacing={2}>
                  <TextField 
                    label="Tên danh mục" 
                    fullWidth 
                    size="small"
                    value={formData.name}
                    onChange={handleNameChange}
                    required
                  />
                  <TextField 
                    label="Slug (Đường dẫn)" 
                    fullWidth 
                    size="small"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    required
                  />
                  <Stack direction="row" spacing={1}>
                    <Button 
                      type="submit" 
                      variant="contained" 
                      fullWidth
                      disabled={isPending}
                      startIcon={editingId ? <Save size={16}/> : <Plus size={16}/>}
                      sx={{ bgcolor: '#2563eb', borderRadius: 2 }}
                    >
                      {editingId ? 'Cập nhật' : 'Thêm mới'}
                    </Button>
                    {editingId && (
                      <Button variant="outlined" color="inherit" onClick={handleCancel} sx={{ borderRadius: 2 }}>
                        <X size={16} />
                      </Button>
                    )}
                  </Stack>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* List Column */}
        <Box sx={{ flex: 1 }}>
          <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #eee', borderRadius: 4 }}>
            <Table size="small">
              <TableHead sx={{ bgcolor: '#f8f9fa' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Tên danh mục</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Slug</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="center">Số bài viết</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="right">Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories.map((cat) => (
                  <TableRow key={cat.id} hover>
                    <TableCell sx={{ fontWeight: 'medium' }}>{cat.name}</TableCell>
                    <TableCell color="text.secondary">/{cat.slug}</TableCell>
                    <TableCell align="center">{cat._count?.posts || 0}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => handleEdit(cat)} sx={{ color: '#2563eb' }}>
                        <Edit size={16} />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={() => handleDelete(cat.id)} 
                        sx={{ color: '#ef4444' }}
                        disabled={isPending}
                      >
                        <Trash2 size={16} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Stack>
    </Box>
  );
}
