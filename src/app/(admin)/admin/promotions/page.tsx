import { prisma } from "@/lib/prisma";
import PromotionListClient from "./PromotionListClient";

export default async function AdminPromotionsPage() {
  const promotions = await prisma.promotion.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      code: true,
      discountType: true,
      discountValue: true,
      startDate: true,
      endDate: true,
      active: true,
      usedCount: true,
    }
  });

  const formattedData = promotions.map(p => ({
     ...p,
     startDate: p.startDate.toISOString(),
     endDate: p.endDate.toISOString()
  }));

  return <PromotionListClient initialData={formattedData} />;
}
