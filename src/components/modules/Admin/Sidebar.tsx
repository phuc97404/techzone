"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Sidebar.module.css";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Archive, 
  Tags,
  Newspaper,
  LogOut
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Tổng quan", href: "/admin", icon: LayoutDashboard },
    { name: "Sản phẩm", href: "/admin/products", icon: Package },
    { name: "Đơn hàng", href: "/admin/orders", icon: ShoppingCart },
    { name: "Tồn kho", href: "/admin/inventory", icon: Archive },
    { name: "Khuyến mãi", href: "/admin/promotions", icon: Tags },
    { name: "Tin tức", href: "/admin/news", icon: Newspaper },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        TechZone <span style={{ color: "var(--color-text-muted)", fontSize: "0.8rem" }}>ADMIN</span>
      </div>
      
      <nav className={styles.nav}>
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`${styles.navItem} ${isActive ? styles.active : ""}`}
            >
              <Icon className={styles.icon} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div style={{ marginTop: "auto", padding: "1rem" }}>
         <Link href="/api/auth/signout" className={styles.navItem} style={{ color: "var(--color-danger)" }}>
             <LogOut className={styles.icon} />
             Đăng xuất
         </Link>
      </div>
    </aside>
  );
}
