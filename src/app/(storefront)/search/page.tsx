/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/prisma";
import ProductGrid from "@/components/common/Product/ProductGrid";
import styles from "./SearchPage.module.css";
import { Metadata } from "next";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Kết quả tìm kiếm cho "${q}" | TechZone` : "Tìm kiếm | TechZone",
    description: `Xem kết quả tìm kiếm cho ${q} trên TechZone - E-commerce linh kiện máy tính hàng đầu.`,
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q: query } = await searchParams;

  if (!query) {
    return (
      <div className={`container ${styles.page}`}>
        <h1>Tìm kiếm</h1>
        <p>Vui lòng nhập từ khóa để tìm kiếm.</p>
      </div>
    );
  }

  // Fetch results using full-text search
  let products = [];
  try {
    products = await prisma.product.findMany({
      where: {
        AND: [
          {
            OR: [
              {
                name: {
                  search: query.split(" ").join(" & "),
                },
              },
              {
                description: {
                  search: query.split(" ").join(" & "),
                },
              },
            ],
          },
          {
            status: "ACTIVE",
          },
        ],
      } as any,
      include: {
        category: {
          select: {
            slug: true,
          },
        },
        brand: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        _relevance: {
          fields: ["name"],
          search: query.split(" ").join(" & "),
          sort: "desc",
        },
      } as any,
    });
  } catch (error) {
    console.error("Full-text search failed, falling back to basic contains", error);
    // Fallback to basic search
    products = await prisma.product.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
        status: "ACTIVE",
      },
      include: {
        category: {
          select: {
            slug: true,
          },
        },
        brand: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.header}>
        <h1>Kết quả tìm kiếm cho &quot;{query}&quot;</h1>
        <p className={styles.count}>Tìm thấy {products.length} sản phẩm</p>
      </div>

      {products.length > 0 ? (
        <ProductGrid title="" products={products} />
      ) : (
        <div className={styles.noResults}>
          <p>Rất tiếc, chúng tôi không tìm thấy sản phẩm nào phù hợp với từ khóa của bạn.</p>
          <div className={styles.tips}>
              <h3>Gợi ý tìm kiếm:</h3>
              <ul>
                  <li>Kiểm tra lỗi chính tả.</li>
                  <li>Sử dụng các từ khóa tổng quát hơn.</li>
                  <li>Sử dụng ít từ khóa hơn.</li>
              </ul>
          </div>
        </div>
      )}
    </div>
  );
}
