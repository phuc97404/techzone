"use client";

import { ReactNode, useState } from "react";
import styles from "./DataTable.module.css";
import { Search, ChevronDown, Filter } from "lucide-react";

interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  onFilter?: (value: string) => void;
  filterOptions?: { label: string; value: string }[];
  actions?: ReactNode;
}

export default function DataTable<T extends { id: string | number }>({
  data,
  columns,
  searchPlaceholder = "Tìm kiếm...",
  onSearch,
  onFilter,
  filterOptions,
  actions
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <div className={styles.left}>
          {onSearch && (
            <div className={styles.searchBox}>
              <Search className={styles.searchIcon} />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={handleSearch}
                className={styles.searchInput}
              />
            </div>
          )}
          
          {filterOptions && onFilter && (
            <div className={styles.filterBox}>
              <Filter className={styles.filterIcon} />
              <select 
                className={styles.filterSelect}
                onChange={(e) => onFilter(e.target.value)}
              >
                <option value="">Tất cả</option>
                {filterOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          )}
        </div>
        
        <div className={styles.right}>
           {actions}
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.checkboxCol}>
                <input type="checkbox" />
              </th>
              {columns.map((col, index) => (
                <th key={col.key as string || index}>{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className={styles.empty}>
                  Không tìm thấy dữ liệu
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row.id}>
                  <td className={styles.checkboxCol}>
                    <input type="checkbox" />
                  </td>
                  {columns.map((col, index) => (
                    <td key={col.key as string || index}>
                      {col.render ? col.render(row) : (row[col.key as keyof T] as ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <div className={styles.pagination}>
        <span className={styles.pageInfo}>
          Hiển thị 1 đến {data.length} của {data.length} mục
        </span>
        <div className={styles.pageButtons}>
          <button className={styles.pageBtn} disabled>Trở lại</button>
          <button className={styles.pageBtn} disabled>Tiếp</button>
        </div>
      </div>
    </div>
  );
}
