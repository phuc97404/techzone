"use client";

import { CheckCircle, Circle, AlertCircle } from "lucide-react";
import styles from "./OrderTimeline.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUS_STEPS = [
  { id: "PENDING", label: "Chờ xác nhận" },
  { id: "CONFIRMED", label: "Đã xác nhận" },
  { id: "SHIPPING", label: "Đang giao hàng" },
  { id: "DELIVERED", label: "Giao thành công" }
];

export default function OrderTimeline({ currentStatus, orderId }: { currentStatus: string, orderId: string }) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  const isCancelled = currentStatus === "CANCELLED";
  
  // Find current step index (if cancelled, we just freeze)
  const currentIndex = isCancelled 
    ? -1 
    : STATUS_STEPS.findIndex(s => s.id === currentStatus);

  const handleUpdateStatus = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
         router.refresh();
      } else {
         alert("Lỗi cập nhật trạng thái");
      }
    } catch (e) {
      alert("Lỗi kết nối server");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className={styles.container}>
       {isCancelled ? (
         <div className={styles.cancelledState}>
            <AlertCircle color="#ef4444" size={32} />
            <div>
               <h3 className={styles.cancelledTitle}>Đơn hàng đã huỷ</h3>
               <p className={styles.cancelledDesc}>Khách hàng hoặc quản trị viên đã huỷ đơn hàng này.</p>
            </div>
         </div>
       ) : (
         <div className={styles.timeline}>
           {STATUS_STEPS.map((step, index) => {
             const isCompleted = index <= currentIndex;
             const isCurrent = index === currentIndex;
             
             return (
               <div key={step.id} className={`${styles.step} ${isCompleted ? styles.completed : ""}`}>
                 <div className={styles.iconWrapper}>
                   {isCompleted ? <CheckCircle size={20} /> : <Circle size={20} />}
                 </div>
                 <div className={styles.content}>
                   <div className={styles.label}>{step.label}</div>
                 </div>
                 {index < STATUS_STEPS.length - 1 && <div className={styles.connector} />}
               </div>
             )
           })}
         </div>
       )}

       {/* Actions */}
       <div className={styles.actions}>
         <h4>Cập nhật trạng thái</h4>
         <div className={styles.btnGroup}>
            {!isCancelled && currentIndex < STATUS_STEPS.length - 1 && (
               <button 
                  disabled={isUpdating}
                  onClick={() => handleUpdateStatus(STATUS_STEPS[currentIndex + 1].id)}
                  className={styles.nextBtn}
               >
                  Chuyển sang: {STATUS_STEPS[currentIndex + 1].label}
               </button>
            )}
            
            {currentStatus !== "DELIVERED" && !isCancelled && (
               <button 
                  disabled={isUpdating}
                  onClick={() => {
                     if(confirm("Bạn muốn huỷ đơn này?")) handleUpdateStatus("CANCELLED");
                  }}
                  className={styles.cancelBtn}
               >
                  Huỷ đơn hàng
               </button>
            )}
         </div>
       </div>
    </div>
  );
}
