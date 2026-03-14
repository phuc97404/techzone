import { prisma } from "@/lib/prisma";
import OrderListClient from "./OrderListClient";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    select: {
       id: true,
       shippingName: true,
       total: true,
       status: true,
       createdAt: true
    }
  });

  const formattedData = orders.map(o => ({
    ...o,
    createdAt: o.createdAt.toISOString()
  }));

  return <OrderListClient initialData={formattedData} />;
}
