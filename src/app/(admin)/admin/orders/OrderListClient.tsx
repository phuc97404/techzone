"use client";

import { useState } from "react";
import DataTable from "@/components/modules/Admin/DataTable";
import Link from "next/link";
import { Eye } from "lucide-react";
import styles from "./Orders.module.css";

type OrderType = {
  id: string;
  shippingName: string;
  total: number;
  status: string;
  createdAt: string;
};

export default function OrderListClient({ initialData }: { initialData: OrderType[] }) {
  const [data, setData] = useState(initialData);

  const handleSearch = (term: string) => {
    if (!term) setData(initialData);
    else setData(initialData.filter(o => 
       o.id.toLowerCase().includes(term.toLowerCase()) || 
       o.shippingName.toLowerCase().includes(term.toLowerCase())
    ));
  };

  const handleFilter = (status: string) => {
    if (!status) setData(initialData);
    else setData(initialData.filter(o => o.status === status));
  };

  const statusColors: Record<string, string> = {
    PENDING: "#f59e0b",
    CONFIRMED: "#3b82f6",
    SHIPPING: "#8b5cf6",
    DELIVERED: "#10b981",
    CANCELLED: "#ef4444"
  };

  const columns = [
    {
      key: "id",
      header: "Mã đơn hàng",
      render: (item: OrderType) => <span className={styles.orderId}>{item.id.slice(-8).toUpperCase()}</span>
    },
    {
      key: "shippingName",
      header: "Khách hàng"
    },
    {
      key: "createdAt",
      header: "Ngày đặt",
      render: (item: OrderType) => new Date(item.createdAt).toLocaleDateString("vi-VN")
    },
    {
      key: "total",
      header: "Tổng tiền",
      render: (item: OrderType) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.total)
    },
    {
      key: "status",
      header: "Trạng thái",
      render: (item: OrderType) => (
        <span 
          className={styles.statusBadge} 
          style={{ backgroundColor: `${statusColors[item.status]}20`, color: statusColors[item.status] }}
        >
          {item.status}
        </span>
      )
    },
    {
      key: "actions",
      header: "",
      render: (item: OrderType) => (
        <Link href={`/admin/orders/${item.id}`} className={styles.actionBtn}>
           <Eye size={18} />
           <span className={styles.srOnly}>Xem chi tiết</span>
        </Link>
      )
    }
  ];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Quản lý đơn hàng</h1>
      </div>

      <DataTable 
        data={data}
        columns={columns}
        searchPlaceholder="Tìm mã đơn hoặc tên KH..."
        onSearch={handleSearch}
        onFilter={handleFilter}
        filterOptions={[
          { label: "Chờ xác nhận (PENDING)", value: "PENDING" },
          { label: "Đã xác nhận (CONFIRMED)", value: "CONFIRMED" },
          { label: "Đang giao (SHIPPING)", value: "SHIPPING" },
          { label: "Đã giao (DELIVERED)", value: "DELIVERED" },
          { label: "Đã huỷ (CANCELLED)", value: "CANCELLED" },
        ]}
      />
    </div>
  );
}
