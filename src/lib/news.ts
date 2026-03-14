import { prisma } from "@/lib/prisma";

export type PostWithCategory = Awaited<ReturnType<typeof getPosts>>["posts"][0];

export async function getPosts(options: { 
  categoryId?: string; 
  slug?: string;
  isFeatured?: boolean; 
  page?: number; 
  limit?: number 
} = {}) {
  const { categoryId, slug, isFeatured, page = 1, limit = 10 } = options;
  const skip = (page - 1) * limit;

  const where: any = {};
  if (categoryId) where.categoryId = categoryId;
  if (slug) {
    where.category = {
      slug: slug
    };
  }
  if (isFeatured !== undefined) where.isFeatured = isFeatured;

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    }),
    prisma.post.count({ where }),
  ]);

  return {
    posts,
    total,
    pages: Math.ceil(total / limit),
  };
}

export async function getPostBySlug(slug: string) {
  return prisma.post.findUnique({
    where: { slug },
    include: {
      category: true,
    },
  });
}

export async function getNewsCategories() {
  console.log("🔍 DEBUG - PRISMA MODELS:", Object.keys(prisma).filter(k => !k.startsWith('_') && !k.startsWith('$')));
  console.log("🔍 DEBUG - newsCategory exists?", !!(prisma as any).newsCategory);
  
  if (!(prisma as any).newsCategory) {
    throw new Error("MODEL_MISSING: newsCategory is missing from Prisma Client. Try restarting the server.");
  }

  return (prisma as any).newsCategory.findMany({
    orderBy: {
      name: "asc",
    },
  });
}

export async function getFeaturedPosts(limit = 4) {
  return prisma.post.findMany({
    where: { isFeatured: true },
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
  });
}

export async function getRelatedPosts(categoryId: string, currentPostId: string, limit = 3) {
  return prisma.post.findMany({
    where: {
      categoryId,
      id: { not: currentPostId },
    },
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
  });
}
