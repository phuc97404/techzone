"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { postSchema, newsCategorySchema, PostInput, NewsCategoryInput } from "@/lib/validations/news";

// Server Actions MUST have 'use server' at the top of the file or function
// Since this is a dedicated actions file, we put it at the top.
// Wait, I should double check if I can use type casting here.

export async function createPost(data: PostInput) {
  try {
    const validated = postSchema.parse(data);
    const post = await (prisma as any).post.create({
      data: validated,
    });
    revalidatePath("/admin/news");
    revalidatePath("/news");
    revalidatePath("/");
    return { success: true, data: post };
  } catch (error: any) {
    return { success: false, error: error.message || "Không thể tạo bài viết" };
  }
}

export async function updatePost(id: string, data: PostInput) {
  try {
    const validated = postSchema.parse(data);
    const post = await (prisma as any).post.update({
      where: { id },
      data: validated,
    });
    revalidatePath("/admin/news");
    revalidatePath(`/news/${post.slug}`);
    revalidatePath("/");
    return { success: true, data: post };
  } catch (error: any) {
    return { success: false, error: error.message || "Không thể cập nhật bài viết" };
  }
}

export async function deletePost(id: string) {
  try {
    await (prisma as any).post.delete({
      where: { id },
    });
    revalidatePath("/admin/news");
    revalidatePath("/news");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: "Không thể xóa bài viết" };
  }
}

export async function toggleFeatured(id: string, isFeatured: boolean) {
  try {
    await (prisma as any).post.update({
      where: { id },
      data: { isFeatured },
    });
    revalidatePath("/admin/news");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: "Lỗi cập nhật trạng thái nổi bật" };
  }
}

export async function upsertNewsCategory(data: NewsCategoryInput) {
  try {
    const validated = newsCategorySchema.parse(data);
    const category = await (prisma as any).newsCategory.upsert({
      where: { id: data.id || "new-category" },
      update: { name: validated.name, slug: validated.slug },
      create: { name: validated.name, slug: validated.slug },
    });
    revalidatePath("/admin/news/categories");
    revalidatePath("/news");
    return { success: true, data: category };
  } catch (error: any) {
    return { success: false, error: "Lỗi xử lý danh mục" };
  }
}

export async function deleteNewsCategory(id: string) {
  try {
    // Check if category has posts
    const postCount = await (prisma as any).post.count({
      where: { categoryId: id }
    });
    
    if (postCount > 0) {
      return { success: false, error: "Không thể xóa danh mục đang có bài viết" };
    }

    await (prisma as any).newsCategory.delete({
      where: { id },
    });
    revalidatePath("/admin/news/categories");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: "Lỗi xóa danh mục" };
  }
}
