import { ReactNode } from "react";
import styles from "./StatsCard.module.css";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isUp: boolean;
  };
}

export default function StatsCard({ title, value, icon, trend }: StatsCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.icon}>{icon}</div>
      </div>
      <div className={styles.content}>
        <div className={styles.value}>{value}</div>
        {trend && (
          <div className={`${styles.trend} ${trend.isUp ? styles.up : styles.down}`}>
            {trend.isUp ? "↑" : "↓"} {Math.abs(trend.value)}% trong tháng
          </div>
        )}
      </div>
    </div>
  );
}
