import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import AccountClient from "./AccountClient";
import AccountLogoutButton from "./AccountLogoutButton";
import { User, Package, ShoppingBag, CheckCircle, Clock, ChevronRight } from "lucide-react";

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

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/account");
  }

  const [user, recentOrders, orderStats] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        createdAt: true,
      },
    }),
    prisma.order.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        total: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.order.groupBy({
      by: ["status"],
      where: { userId: session.user.id },
      _count: true,
    }),
  ]);

  if (!user) {
    redirect("/login");
  }

  const totalOrders = orderStats.reduce((acc, s) => acc + s._count, 0);
  const deliveredOrders = orderStats.find((s) => s.status === "DELIVERED")?._count || 0;
  const pendingOrders = orderStats.filter((s) => s.status === "PENDING" || s.status === "CONFIRMED" || s.status === "SHIPPING")
    .reduce((acc, s) => acc + s._count, 0);

  return (
    <div className="container py-8 min-h-[60vh] animate-fade-in mx-auto px-4 lg:max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100">Tài khoản của tôi</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 items-start">
        {/* Sidebar */}
        <aside className="flex flex-col gap-2">
          <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 text-center shadow-lg">
            <div className="w-[72px] h-[72px] rounded-full bg-gradient-to-tr from-pink-500 to-indigo-500 flex items-center justify-center mx-auto mb-4 text-2xl font-extrabold text-white shadow-[0_0_20px_rgba(236,72,153,0.3)]">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <p className="text-lg font-semibold text-slate-100 mb-1">{user.name}</p>
            <p className="text-sm text-slate-400 break-all">{user.email}</p>
          </div>

          <nav className="bg-slate-800/80 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden shadow-lg flex flex-col">
            <Link
              href="/account"
              className="flex items-center gap-3 px-5 py-3.5 text-sm font-medium transition-colors border-l-4 border-pink-500 bg-pink-500/10 text-pink-400"
            >
              <User size={18} />
              Thông tin cá nhân
            </Link>
            <div className="h-px bg-slate-700/50" />
            <Link
              href="/account/orders"
              className="flex items-center gap-3 px-5 py-3.5 text-sm font-medium text-slate-400 transition-colors border-l-4 border-transparent hover:bg-slate-700/30 hover:text-slate-200"
            >
              <Package size={18} />
              Đơn hàng của tôi
            </Link>
            <div className="h-px bg-slate-700/50" />
            <AccountLogoutButton />
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex flex-col gap-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 flex items-center gap-4 hover:border-slate-600 transition-colors">
              <div className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0 bg-blue-500/10 text-blue-400">
                <ShoppingBag size={22} />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-slate-100">{totalOrders}</span>
                <span className="text-xs text-slate-400">Tổng đơn hàng</span>
              </div>
            </div>
            
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 flex items-center gap-4 hover:border-slate-600 transition-colors">
              <div className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0 bg-emerald-500/10 text-emerald-400">
                <CheckCircle size={22} />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-slate-100">{deliveredOrders}</span>
                <span className="text-xs text-slate-400">Đã hoàn thành</span>
              </div>
            </div>
            
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 flex items-center gap-4 hover:border-slate-600 transition-colors">
              <div className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0 bg-amber-500/10 text-amber-400">
                <Clock size={22} />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-slate-100">{pendingOrders}</span>
                <span className="text-xs text-slate-400">Đang xử lý</span>
              </div>
            </div>
          </div>

          {/* Profile Info - Client Component for edit functionality */}
          <AccountClient user={user} />

          {/* Recent Orders */}
          <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-700/50">
              <h2 className="text-xl font-semibold flex items-center gap-2 text-slate-100">
                <Package size={20} className="text-indigo-400" />
                Đơn hàng gần đây
              </h2>
              <Link href="/account/orders" className="inline-flex items-center gap-1 text-sm font-semibold text-pink-400 hover:text-pink-300 transition-colors">
                Xem tất cả <ChevronRight size={14} />
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm">
                <p>Bạn chưa có đơn hàng nào.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {recentOrders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/account/orders`}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-800/40 border border-slate-700/40 rounded-xl transition-colors hover:border-slate-600 hover:bg-slate-700/20 text-inherit no-underline gap-3 sm:gap-0"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-sm text-slate-200">
                        #{order.id.slice(-8).toUpperCase()}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                      <span className="font-semibold text-sm text-slate-200">
                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(order.total)}
                      </span>
                      <span
                        className="px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
                        style={{
                          backgroundColor: `${statusColors[order.status]}20`,
                          color: statusColors[order.status],
                        }}
                      >
                        {statusLabels[order.status]}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
