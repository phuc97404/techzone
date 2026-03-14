import { prisma } from "@/lib/prisma";
import StatsCard from "@/components/modules/Admin/StatsCard";
import RevenueChart from "@/components/modules/Admin/RevenueChart";
import { 
  DollarSign, 
  ShoppingBag, 
  AlertTriangle, 
  Users 
} from "lucide-react";
import styles from "./Dashboard.module.css";
import Link from "next/link";
import { OrderStatus } from "@prisma/client";

export default async function AdminDashboard() {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Fetch data in parallel
  const [
    totalRevenueMonthly,
    newOrdersCount,
    lowStockCount,
    recentOrders,
    chartOrders
  ] = await Promise.all([
    // Total revenue this month -> sum of all valid orders? Or just any that aren't cancelled?
    prisma.order.aggregate({
      where: {
        createdAt: { gte: firstDayOfMonth },
        status: { not: "CANCELLED" }
      },
      _sum: { total: true }
    }),
    
    // New pending orders counts
    prisma.order.count({
      where: { status: "PENDING" }
    }),

    // Low stock count (<= 5)
    prisma.product.count({
      where: { stock: { lte: 5 }, status: "ACTIVE" }
    }),

    // Top 5 recent orders
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } } }
    }),

    // Orders from last 7 days for the chart
    prisma.order.findMany({
      where: {
        createdAt: { gte: sevenDaysAgo },
        status: { not: "CANCELLED" }
      },
      select: { total: true, createdAt: true }
    })
  ]);

  const total = totalRevenueMonthly._sum.total || 0;

  // Process data for the chart
  const dateMap = new Map();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    dateMap.set(d.toLocaleDateString("vi-VN").slice(0, 5), 0);
  }

  chartOrders.forEach((o) => {
    const dStr = o.createdAt.toLocaleDateString("vi-VN").slice(0, 5);
    if (dateMap.has(dStr)) {
      dateMap.set(dStr, dateMap.get(dStr) + o.total);
    }
  });

  const chartData = Array.from(dateMap.entries()).map(([k, v]) => ({ date: k, value: v }));

  const statusColors: Record<string, string> = {
    PENDING: "#f59e0b",
    CONFIRMED: "#3b82f6",
    SHIPPING: "#8b5cf6",
    DELIVERED: "#10b981",
    CANCELLED: "#ef4444"
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Tổng quan Dashbboard</h1>
      
      <div className={styles.gridCards}>
        <StatsCard 
          title="Doanh thu tháng này" 
          value={new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(total)} 
          icon={<DollarSign />} 
          trend={{ value: 12, isUp: true }}
        />
        <StatsCard 
          title="Đơn hàng chờ xử lý" 
          value={newOrdersCount} 
          icon={<ShoppingBag />} 
        />
        <StatsCard 
          title="Sản phẩm sắp hết hàng" 
          value={lowStockCount} 
          icon={<AlertTriangle />} 
        />
        <StatsCard 
          title="Tổng khách truy cập" 
          value="12,543" 
          icon={<Users />} 
        />
      </div>

      <div className={styles.gridMain}>
        <div className={styles.chartPanel}>
          <h2>Doanh thu 7 ngày gần nhất</h2>
          <RevenueChart data={chartData} />
        </div>

        <div className={styles.recentOrdersPanel}>
          <div className={styles.panelHeader}>
            <h2>Đơn hàng gần đây</h2>
            <Link href="/admin/orders" className={styles.link}>Xem tất cả</Link>
          </div>
          
          <div className={styles.orderList}>
            {recentOrders.map((order) => (
              <div key={order.id} className={styles.orderItem}>
                <div className={styles.orderInfo}>
                  <p className={styles.orderName}>{order.shippingName || order.user.name}</p>
                  <p className={styles.orderMeta}>
                    {order.id.slice(-8)} • {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                  </p>
                </div>
                <div className={styles.orderRight}>
                  <p className={styles.orderTotal}>
                     {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(order.total)}
                  </p>
                  <span 
                    className={styles.statusBadge} 
                    style={{ backgroundColor: `${statusColors[order.status]}20`, color: statusColors[order.status] }}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
