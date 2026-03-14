import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { productFilterSchema } from "@/lib/validations/api";
import { z } from "zod";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse và validate query params parameters
    const query = Object.fromEntries(searchParams);
    const filters = productFilterSchema.parse(query);

    const { category, brand, minPrice, maxPrice, search, sort, page = 1, limit = 12 } = filters;

    // Build the query
    const whereClause: Record<string, any> = {
      status: "ACTIVE",
    };

    if (category) {
      whereClause.category = { slug: category };
    }

    if (brand) {
      whereClause.brand = { slug: brand };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      whereClause.OR = [
        { salePrice: { gte: minPrice || 0, lte: maxPrice || Number.MAX_SAFE_INTEGER } },
        {
          AND: [
            { salePrice: null },
            { price: { gte: minPrice || 0, lte: maxPrice || Number.MAX_SAFE_INTEGER } }
          ]
        }
      ];
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // Determine sort order
    let orderBy: Record<string, string> = { createdAt: "desc" };
    switch (sort) {
      case "price_asc":
        orderBy = { price: "asc" }; // NOTE: Có thể phức tạp hơn nếu sort theo salePrice
        break;
      case "price_desc":
        orderBy = { price: "desc" };
        break;
      case "popular":
        orderBy = { reviewCount: "desc" };
        break;
      case "newest":
      default:
        orderBy = { createdAt: "desc" };
        break;
    }

    // Pagination
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        orderBy,
        skip,
        take: limit,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          brand: { select: { id: true, name: true, slug: true } },
        },
      }),
      prisma.product.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      data: products,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid parameters", details: error.issues }, { status: 400 });
    }
    
    console.error("Products API Error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
