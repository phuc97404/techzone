import { z } from "zod";

export const newsCategorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Tên danh mục phải có ít nhất 2 ký tự"),
  slug: z.string().min(2, "Slug phải có ít nhất 2 ký tự"),
});

export const postSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(5, "Tiêu đề phải có ít nhất 5 ký tự"),
  slug: z.string().min(5, "Slug phải có ít nhất 5 ký tự"),
  excerpt: z.string().min(10, "Mô tả ngắn phải có ít nhất 10 ký tự"),
  content: z.string().min(20, "Nội dung phải có ít nhất 20 ký tự"),
  thumbnail: z.string().url("Vui lòng nhập URL hình ảnh hợp lệ"),
  categoryId: z.string().min(1, "Vui lòng chọn danh mục"),
  isFeatured: z.boolean().default(false),
});

export type NewsCategoryInput = z.infer<typeof newsCategorySchema>;
export type PostInput = z.infer<typeof postSchema>;
