import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { addReviewSchema } from "@/lib/validations/api";
import { auth } from "@/lib/auth";
import { z } from "zod";

export async function POST(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
       return NextResponse.json({ error: "Cần phải đăng nhập để đánh giá" }, { status: 401 });
    }
    
    const params = await context.params;
    const { slug: id } = params;
    const body = await request.json();
    const { rating, comment } = addReviewSchema.parse(body);

    // Validate product 
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
       return NextResponse.json({ error: "Sản phẩm không có thực" }, { status: 404 });
    }

    // Create review and update product stats
    await prisma.$transaction(async (tx) => {
       await tx.review.create({
          data: {
             rating,
             comment,
             userId: session.user.id,
             productId: id
          }
       });

       // Reconfigure and compute new average rating
       const totalReviews = await tx.review.count({ where: { productId: id } });
       const aggregate = await tx.review.aggregate({
         where: { productId: id },
         _avg: { rating: true }
       });

       await tx.product.update({
         where: { id },
         data: {
           rating: aggregate._avg.rating || rating,
           reviewCount: totalReviews
         }
       });
    });

    return NextResponse.json({ message: "Đã gửi nhận xét thành công" }, { status: 201 });
  } catch (error) {
     if (error instanceof z.ZodError) {
        return NextResponse.json({ error: "Dữ liệu không hoàn thiện", details: error.issues }, { status: 400 });
     }
     
     return NextResponse.json({ error: "Lỗi tạo bình luận" }, { status: 500 });
  }
}
