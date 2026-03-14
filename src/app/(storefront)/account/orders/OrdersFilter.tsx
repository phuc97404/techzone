"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Package } from "lucide-react";
import { Box, Typography, Button, Card } from "@mui/material";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  productName: string;
  productImage: string;
  productSlug: string;
}

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

interface OrdersFilterProps {
  orders: Order[];
  statusCounts: Record<string, number>;
  statusColors: Record<string, string>;
  statusLabels: Record<string, string>;
}

const FILTER_TABS = [
  { key: "ALL", label: "Tất cả" },
  { key: "PENDING", label: "Chờ xử lý" },
  { key: "CONFIRMED", label: "Đã xác nhận" },
  { key: "SHIPPING", label: "Đang giao" },
  { key: "DELIVERED", label: "Đã giao" },
  { key: "CANCELLED", label: "Đã hủy" },
];

export default function OrdersFilter({
  orders,
  statusCounts,
  statusColors,
  statusLabels,
}: OrdersFilterProps) {
  const [activeFilter, setActiveFilter] = useState("ALL");

  const filteredOrders = activeFilter === "ALL"
    ? orders
    : orders.filter((o) => o.status === activeFilter);

  if (orders.length === 0) {
    return (
      <Box className="flex flex-col items-center justify-center py-20 px-4 text-center bg-slate-800/50 border border-slate-700/50 rounded-2xl animate-fade-in">
        <ShoppingBag size={56} className="text-slate-600 mb-6" />
        <Typography variant="h5" className="font-bold text-slate-200 mb-2">Chưa có đơn hàng nào</Typography>
        <Typography variant="body1" className="text-slate-400 mb-8">Hãy khám phá các sản phẩm tuyệt vời của chúng tôi!</Typography>
        <Link href="/" passHref>
          <Button variant="contained" className="bg-gradient-to-r from-pink-500 to-indigo-500 rounded-xl px-8 py-3 text-base font-bold shadow-lg hover:-translate-y-1 transition-transform normal-case">
            Bắt đầu mua sắm
          </Button>
        </Link>
      </Box>
    );
  }

  return (
    <Box className="flex flex-col gap-6">
      {/* Filter Tabs */}
      <Box className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.key}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
              activeFilter === tab.key
                ? "bg-pink-500 text-white shadow-[0_4px_12px_rgba(236,72,153,0.3)]"
                : "bg-slate-800/50 text-slate-400 hover:bg-slate-700 hover:text-slate-200 border border-slate-700/50"
            }`}
            onClick={() => setActiveFilter(tab.key)}
          >
            {tab.label}
            {statusCounts[tab.key] > 0 && (
              <span
                className={`flex items-center justify-center text-[10px] w-5 h-5 rounded-full ${
                  activeFilter === tab.key ? "bg-white/20" : "bg-slate-700"
                }`}
              >
                {statusCounts[tab.key]}
              </span>
            )}
          </button>
        ))}
      </Box>

      {/* Order List */}
      <Box className="flex flex-col gap-5">
        {filteredOrders.length === 0 ? (
          <Box className="flex flex-col items-center justify-center py-16 px-4 text-center bg-slate-800/30 border border-slate-700/30 rounded-2xl">
            <Package size={48} className="text-slate-600 mb-4" />
            <Typography variant="h6" className="text-slate-300 font-semibold mb-1">Không có đơn hàng nào</Typography>
            <Typography variant="body2" className="text-slate-500">Không tìm thấy đơn hàng với trạng thái này.</Typography>
          </Box>
        ) : (
          filteredOrders.map((order) => (
            <Card key={order.id} className="bg-slate-800/80 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden shadow-lg animate-fade-in-up">
              {/* Header */}
              <Box className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 bg-slate-800/50 border-b border-slate-700/50">
                <Box className="flex flex-col">
                  <span className="font-bold text-slate-100 text-base">
                    Đơn hàng #{order.id.slice(-8).toUpperCase()}
                  </span>
                  <span className="text-sm text-slate-400">
                    {new Date(order.createdAt).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </Box>
                <span
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold w-max"
                  style={{
                    backgroundColor: `${statusColors[order.status]}20`,
                    color: statusColors[order.status],
                  }}
                >
                  {statusLabels[order.status]}
                </span>
              </Box>

              {/* Body - Items */}
              <Box className="p-5 flex flex-col gap-4">
                {order.items.map((item) => (
                  <Box key={item.id} className="flex items-center gap-4">
                    <Box className="w-16 h-16 rounded-xl bg-slate-700/40 relative flex items-center justify-center overflow-hidden shrink-0 border border-slate-600/50 shadow-inner">
                      {item.productImage ? (
                        <Image
                          src={item.productImage}
                          alt={item.productName}
                          fill
                          style={{ objectFit: "contain" }}
                          sizes="64px"
                        />
                      ) : (
                        <ShoppingBag size={24} className="text-slate-500" />
                      )}
                    </Box>
                    <Box className="flex-1 min-w-0">
                      <Typography noWrap className="font-medium text-slate-200 text-sm md:text-base">
                        {item.productName}
                      </Typography>
                      <Typography variant="body2" className="text-slate-400 font-medium mt-1">
                        x{item.quantity}
                      </Typography>
                    </Box>
                    <Typography className="font-semibold text-pink-400 shrink-0">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(item.price * item.quantity)}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {/* Footer */}
              <Box className="flex items-center justify-between p-5 bg-slate-800/30 border-t border-slate-700/50">
                <span className="text-sm font-medium text-slate-400">
                  {order.items.length} sản phẩm
                </span>
                <Box className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-400 text-right">Tổng:</span>
                  <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-pink-400 to-indigo-400 bg-clip-text text-transparent">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(order.total)}
                  </span>
                </Box>
              </Box>
            </Card>
          ))
        )}
      </Box>
    </Box>
  );
}
