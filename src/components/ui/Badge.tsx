import styles from "./Badge.module.css";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger" | "success" | "warning";
  className?: string;
}

export default function Badge({ children, variant = "primary", className = "" }: BadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
}
