import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { User, Package } from "lucide-react";
import OrdersFilter from "./OrdersFilter";
import AccountLogoutButton from "../AccountLogoutButton";

const statusColors: Record<string, string> = {
  PENDING: "#f59e0b",
  CONFIRMED: "#3b82f6",
  SHIPPING: "#8b5cf6",
  DELIVERED: "#10b981",
  CANCELLED: "#ef4444",
};

const statusLabels: Record<string, string> = {
  PENDING: "Chờ xử lý",
  CONFIRMED: "Đã xác nhận",
  SHIPPING: "Đang giao",
  DELIVERED: "Đã giao",
  CANCELLED: "Đã hủy",
};

export default async function OrdersPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/account/orders");
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          product: {
            select: { name: true, images: true, slug: true },
          },
        },
      },
    },
  });

  // Get user for sidebar
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true },
  });

  if (!user) redirect("/login");

  // Format orders for client component
  const formattedOrders = orders.map((order) => ({
    id: order.id,
    total: order.total,
    status: order.status,
    createdAt: order.createdAt.toISOString(),
    items: order.items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      price: item.price,
      productName: item.product.name,
      productImage: item.product.images[0] || "",
      productSlug: item.product.slug,
    })),
  }));

  // Count by status
  const statusCounts: Record<string, number> = {
    ALL: orders.length,
    PENDING: 0,
    CONFIRMED: 0,
    SHIPPING: 0,
    DELIVERED: 0,
    CANCELLED: 0,
  };
  orders.forEach((o) => {
    statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
  });

  return (
    <div className="container py-8 min-h-[60vh] animate-fade-in mx-auto px-4 lg:max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100">Đơn hàng của tôi</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 items-start">
        {/* Sidebar */}
        <aside className="flex flex-col gap-2">
          <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 text-center shadow-lg">
            <div className="w-[72px] h-[72px] rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center mx-auto mb-4 text-2xl font-extrabold text-white shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <p className="text-lg font-semibold text-slate-100 mb-1">{user.name}</p>
            <p className="text-sm text-slate-400 break-all">{user.email}</p>
          </div>

          <nav className="bg-slate-800/80 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden shadow-lg flex flex-col">
            <Link
              href="/account"
              className="flex items-center gap-3 px-5 py-3.5 text-sm font-medium text-slate-400 transition-colors border-l-4 border-transparent hover:bg-slate-700/30 hover:text-slate-200"
            >
              <User size={18} />
              Thông tin cá nhân
            </Link>
            <div className="h-px bg-slate-700/50" />
            <Link
              href="/account/orders"
              className="flex items-center gap-3 px-5 py-3.5 text-sm font-medium transition-colors border-l-4 border-cyan-500 bg-cyan-500/10 text-cyan-400"
            >
              <Package size={18} />
              Đơn hàng của tôi
            </Link>
            <div className="h-px bg-slate-700/50" />
            <AccountLogoutButton />
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex flex-col w-full">
          <OrdersFilter
            orders={formattedOrders}
            statusCounts={statusCounts}
            statusColors={statusColors}
            statusLabels={statusLabels}
          />
        </div>
      </div>
    </div>
  );
}
