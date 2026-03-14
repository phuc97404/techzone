"use client";

import { useState } from "react";
import DataTable from "@/components/modules/Admin/DataTable";
import { Plus, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import styles from "./Products.module.css";
import Image from "next/image";

type ProductType = {
  id: string;
  name: string;
  price: number;
  stock: number;
  status: string;
  category: { name: string };
  image: string;
};

export default function ProductListClient({ initialData }: { initialData: ProductType[] }) {
  const [data, setData] = useState(initialData);

  const handleSearch = (term: string) => {
    if (!term) setData(initialData);
    else setData(initialData.filter(p => p.name.toLowerCase().includes(term.toLowerCase())));
  };

  const handleFilter = (status: string) => {
    if (!status) setData(initialData);
    else setData(initialData.filter(p => p.status === status));
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xoá sản phẩm "${name}"? Thao tác này có thể không hoàn tác được.`)) return;
    
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (res.ok) {
         setData(prev => prev.filter(p => p.id !== id));
      } else {
         alert("Xoá thất bại!");
      }
    } catch (err) {
      alert("Lỗi kết nối");
    }
  };

  const columns = [
    {
      key: "name",
      header: "Sản phẩm",
      render: (item: ProductType) => (
        <div className={styles.productCell}>
          <div className={styles.imagePlaceholder}>
             {item.image ? (
                <Image src={item.image} alt={item.name} width={40} height={40} className={styles.productImg} />
             ) : (
                <span className={styles.imgFallback}>{item.name.charAt(0)}</span>
             )}
          </div>
          <span className={styles.productName}>{item.name}</span>
        </div>
      )
    },
    {
      key: "category",
      header: "Danh mục",
      render: (item: ProductType) => item.category.name
    },
    {
      key: "price",
      header: "Giá bán",
      render: (item: ProductType) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.price)
    },
    {
      key: "stock",
      header: "Tồn kho",
      render: (item: ProductType) => (
        <span className={item.stock <= 5 ? styles.stockWarning : ""}>
          {item.stock}
        </span>
      )
    },
    {
      key: "status",
      header: "Trạng thái",
      render: (item: ProductType) => (
        <span className={`${styles.statusBadge} ${styles[item.status.toLowerCase()]}`}>
          {item.status}
        </span>
      )
    },
    {
      key: "actions",
      header: "",
      render: (item: ProductType) => (
        <div className={styles.actions}>
          <Link href={`/admin/products/${item.id}/edit`} className={styles.actionBtn}>
            <Edit size={16} />
          </Link>
          <button onClick={() => handleDelete(item.id, item.name)} className={`${styles.actionBtn} ${styles.danger}`}>
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Quản lý sản phẩm</h1>
      </div>

      <DataTable 
        data={data}
        columns={columns}
        searchPlaceholder="Tìm tên sản phẩm..."
        onSearch={handleSearch}
        onFilter={handleFilter}
        filterOptions={[
          { label: "Đang bán (Active)", value: "ACTIVE" },
          { label: "Bản nháp (Draft)", value: "DRAFT" },
          { label: "Hết hàng (Out of stock)", value: "OUT_OF_STOCK" },
        ]}
        actions={
          <Link href="/admin/products/new" className={styles.createBtn}>
            <Plus size={18} />
            Thêm sản phẩm
          </Link>
        }
      />
    </div>
  );
}
