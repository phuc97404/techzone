"use client";

import React, { useState, useTransition } from 'react';
import { 
  Box, TextField, Button, Paper, Typography, FormControl, 
  InputLabel, Select, MenuItem, Switch, FormControlLabel, 
  Stack, Card, CardContent, Divider, Breadcrumbs
} from '@mui/material';
import { Save, X, ArrowLeft, Image as ImageIcon, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createPost, updatePost } from '@/app/actions/news';

interface Category {
  id: string;
  name: string;
}

interface NewsPostFormProps {
  initialData?: any;
  categories: Category[];
}

export default function NewsPostForm({ initialData, categories }: NewsPostFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    excerpt: initialData?.excerpt || "",
    content: initialData?.content || "",
    thumbnail: initialData?.thumbnail || "",
    categoryId: initialData?.categoryId || "",
    isFeatured: initialData?.isFeatured || false,
  });

  const generateSlug = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/([^0-9a-z-\s])/g, '')
      .replace(/(\s+)/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setFormData(prev => {
      const updated = { ...prev, [name]: val };
      // Auto-generate slug if it's a new post and we're changing the title
      if (name === 'title' && !initialData) {
        updated.slug = generateSlug(value);
      }
      return updated;
    });
  };

  const handleSelectChange = (e: any) => {
    setFormData(prev => ({ ...prev, categoryId: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    startTransition(async () => {
      const result = initialData 
        ? await updatePost(initialData.id, formData as any)
        : await createPost(formData as any);

      if (result.success) {
        router.push('/admin/news');
        router.refresh();
      } else {
        setFormError(result.error);
      }
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 4 }}>
      {/* Top Bar */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Box>
          <Breadcrumbs separator={<ChevronRight size={16} />} sx={{ mb: 1 }}>
            <Link href="/admin/news" className="text-gray-500 hover:text-blue-600 flex items-center gap-1">
              <ArrowLeft size={16} /> Quản lý Tin tức
            </Link>
            <Typography variant="body2" color="text.primary">
              {initialData ? "Chỉnh sửa bài viết" : "Viết bài mới"}
            </Typography>
          </Breadcrumbs>
          <Typography variant="h4" fontWeight="900">
            {initialData ? "📝 Chỉnh sửa bài viết" : "✍️ Viết bài mới"}
          </Typography>
        </Box>

        <Stack direction="row" gap={2}>
          <Button 
            variant="outlined" 
            component={Link} 
            href="/admin/news"
            startIcon={<X size={18} />}
            sx={{ borderRadius: 3, textTransform: 'none' }}
          >
            Hủy bỏ
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={isPending}
            startIcon={<Save size={18} />}
            sx={{ 
              borderRadius: 3, 
              textTransform: 'none',
              bgcolor: '#2563eb',
              '&:hover': { bgcolor: '#1d4ed8' }
            }}
          >
            {isPending ? "Đang lưu..." : (initialData ? "Cập nhật bài viết" : "Đăng bài viết")}
          </Button>
        </Stack>
      </Stack>

      {formError && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: '#fef2f2', border: '1px solid #fee2e2', color: '#b91c1c' }}>
          <Typography variant="body2">{formError}</Typography>
        </Paper>
      )}

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
        {/* Main Content Column */}
        <Box sx={{ flex: 1 }}>
          <Card elevation={0} sx={{ border: '1px solid #eee', borderRadius: 4, mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>Nội dung chi tiết</Typography>
              <Stack spacing={3}>
                <TextField 
                  label="Tiêu đề bài viết"
                  name="title"
                  fullWidth
                  required
                  value={formData.title}
                  onChange={handleChange}
                  variant="outlined"
                  sx={{ '& .MuiInputBase-input': { color: '#0f172a' }, '& .MuiInputLabel-root': { color: '#64748b' } }}
                />
                <TextField 
                  label="Đường dẫn (Slug)"
                  name="slug"
                  fullWidth
                  required
                  value={formData.slug}
                  onChange={handleChange}
                  variant="outlined"
                  helperText="Đường dẫn tĩnh duy nhất cho bài viết này."
                  sx={{ '& .MuiInputBase-input': { color: '#0f172a' }, '& .MuiInputLabel-root': { color: '#64748b' } }}
                />
                <TextField 
                  label="Mô tả ngắn (Excerpt)"
                  name="excerpt"
                  fullWidth
                  required
                  multiline
                  rows={3}
                  value={formData.excerpt}
                  onChange={handleChange}
                  placeholder="Tóm tắt ngắn gọn nội dung bài viết..."
                  sx={{ '& .MuiInputBase-input': { color: '#0f172a' }, '& .MuiInputLabel-root': { color: '#64748b' } }}
                />
                <TextField 
                  label="Nội dung bài viết"
                  name="content"
                  fullWidth
                  required
                  multiline
                  rows={15}
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Nội dung chính của bài viết (Hỗ trợ HTML)..."
                  sx={{ '& .MuiInputBase-input': { color: '#0f172a' }, '& .MuiInputLabel-root': { color: '#64748b' } }}
                />
              </Stack>
            </CardContent>
          </Card>
        </Box>

        {/* Sidebar Column */}
        <Box sx={{ width: { xs: '100%', md: 350 } }}>
          <Stack spacing={3}>
            {/* Classification */}
            <Card elevation={0} sx={{ border: '1px solid #eee', borderRadius: 4 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Phân loại & Trạng thái</Typography>
                <Stack spacing={2}>
                  <FormControl fullWidth required>
                    <InputLabel id="category-label">Danh mục</InputLabel>
                    <Select
                      labelId="category-label"
                      value={formData.categoryId}
                      label="Danh mục"
                      onChange={handleSelectChange}
                    >
                      <MenuItem value="">-- Chọn danh mục --</MenuItem>
                      {categories.map(cat => (
                        <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Divider />

                  <FormControlLabel
                    control={
                      <Switch 
                        name="isFeatured"
                        checked={formData.isFeatured}
                        onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                      />
                    }
                    label="Bài viết nổi bật (Home)"
                  />
                </Stack>
              </CardContent>
            </Card>

            {/* Thumbnail */}
            <Card elevation={0} sx={{ border: '1px solid #eee', borderRadius: 4 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Ảnh đại diện (Thumbnail)</Typography>
                <TextField 
                  label="URL hình ảnh"
                  name="thumbnail"
                  fullWidth
                  required
                  value={formData.thumbnail}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  sx={{ mb: 2 }}
                />
                
                {formData.thumbnail ? (
                  <Box 
                    component="img" 
                    src={formData.thumbnail} 
                    sx={{ width: '100%', borderRadius: 2, height: 180, objectFit: 'cover' }}
                    onError={(e: any) => e.target.src = 'https://via.placeholder.com/400x250?text=Loi+anh'}
                  />
                ) : (
                  <Box 
                    sx={{ 
                      width: '100%', 
                      height: 180, 
                      bgcolor: '#f8f9fa', 
                      display: 'flex', 
                      flexDirection: 'column',
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      borderRadius: 2,
                      border: '2px dashed #eee'
                    }}
                  >
                    <ImageIcon size={40} className="text-gray-300 mb-2" />
                    <Typography variant="caption" color="text.secondary">Chưa có ảnh đại diện</Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}
