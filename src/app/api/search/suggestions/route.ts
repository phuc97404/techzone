import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query || query.length < 2) {
      return NextResponse.json([]);
    }

    // Using Prisma full-text search preview feature
    const products = await prisma.product.findMany({
      where: {
        OR: [
          {
            name: {
              search: query.split(" ").join(" & "),
            } as any,
          },
          {
            description: {
              search: query.split(" ").join(" & "),
            } as any,
          },
        ],
        status: "ACTIVE",
      },
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        salePrice: true,
        images: true,
        category: {
          select: {
            slug: true,
          },
        },
      },
      take: 5,
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Search suggestions error:", error);
    // Fallback to basic search if search feature is not supported by DB
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get("q") || "";
        const fallbackProducts = await prisma.product.findMany({
            where: {
                name: {
                    contains: query,
                    mode: "insensitive"
                },
                status: "ACTIVE"
            },
            select: {
                id: true,
                name: true,
                slug: true,
                price: true,
                salePrice: true,
                images: true,
                category: {
                    select: {
                        slug: true,
                    },
                },
            },
            take: 5
        });
        return NextResponse.json(fallbackProducts);
    } catch (fallbackError) {
        console.error("Fallback search failed:", fallbackError);
        return NextResponse.json({ error: "Failed to fetch suggestions" }, { status: 500 });
    }
  }
}
