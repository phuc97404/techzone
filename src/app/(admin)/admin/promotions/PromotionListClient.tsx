"use client";

import { useState } from "react";
import DataTable from "@/components/modules/Admin/DataTable";
import styles from "./Promotions.module.css";
import { Plus, Trash2 } from "lucide-react";

type PromotionType = {
  id: string;
  name: string;
  code: string;
  discountType: string;
  discountValue: number;
  startDate: string;
  endDate: string;
  active: boolean;
  usedCount: number;
};

export default function PromotionListClient({ initialData }: { initialData: PromotionType[] }) {
  const [data, setData] = useState(initialData);

  const handleSearch = (term: string) => {
    if (!term) setData(initialData);
    else setData(initialData.filter(i => 
       i.name.toLowerCase().includes(term.toLowerCase()) || 
       i.code.toLowerCase().includes(term.toLowerCase())
    ));
  };

  const handleDelete = async (id: string, code: string) => {
     if (!confirm(`Xác nhận xoá mã khuyến mãi: ${code}?`)) return;
     // Basic UI optimistic interaction for Phase 5 demo
     setData(prev => prev.filter(p => p.id !== id));
  };

  const columns = [
    {
      key: "name",
      header: "Tên chương trình",
      render: (item: PromotionType) => (
         <div>
            <span className={styles.promoName}>{item.name}</span>
            <div className={styles.codeBadge}>{item.code}</div>
         </div>
      )
    },
    {
      key: "discount",
      header: "Mức giảm",
      render: (item: PromotionType) => (
         <span className={styles.discountVal}>
            {item.discountType === "PERCENTAGE" 
               ? `${item.discountValue}%` 
               : new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.discountValue)
            }
         </span>
      )
    },
    {
      key: "date",
      header: "Thời gian áp dụng",
      render: (item: PromotionType) => (
         <div className={styles.dateRange}>
            <span>TỪ: {new Date(item.startDate).toLocaleDateString("vi-VN")}</span>
            <span>ĐẾN: {new Date(item.endDate).toLocaleDateString("vi-VN")}</span>
         </div>
      )
    },
    {
      key: "usage",
      header: "Đã dùng",
      render: (item: PromotionType) => <span className={styles.usageCount}>{item.usedCount} lần</span>
    },
    {
      key: "active",
      header: "Trạng thái",
      render: (item: PromotionType) => (
         <span className={`${styles.statusBadge} ${item.active ? styles.active : styles.inactive}`}>
            {item.active ? "Đang chạy" : "Tạm dừng"}
         </span>
      )
    },
    {
       key: "actions",
       header: "",
       render: (item: PromotionType) => (
          <button onClick={() => handleDelete(item.id, item.code)} className={styles.actionBtn}>
             <Trash2 size={16} />
          </button>
       )
    }
  ];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Quản lý khuyến mãi</h1>
      </div>

      <DataTable 
        data={data}
        columns={columns}
        searchPlaceholder="Tìm mã code, tên chương trình..."
        onSearch={handleSearch}
        actions={
          <button className={styles.createBtn} onClick={() => alert("Form thêm mã khuyến mãi (Phase 5 demo)")}>
            <Plus size={18} />
            Tạo mã mới
          </button>
        }
      />
    </div>
  );
}
