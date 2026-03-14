"use client";

import { useState } from "react";
import Rating from "@/components/ui/Rating";
import styles from "./ReviewSection.module.css";
// import { useSession } from "next-auth/react"; // Can add later for auth barriers smoothly

interface ReviewItem {
  id: string;
  rating: number;
  comment: string;
  createdAt: Date;
  user: { name: string | null };
}

interface ReviewSectionProps {
  productId: string;
  rating: number;
  reviewCount: number;
  reviews: ReviewItem[];
}

export default function ReviewSection({ productId, rating, reviewCount, reviews }: ReviewSectionProps) {
  const [comment, setComment] = useState("");
  const [selectedRating, setSelectedRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Simulating local state addition just for Phase 4 UI validation without needing mutation refetch immediately
  const [localReviews, setLocalReviews] = useState<ReviewItem[]>(reviews);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: selectedRating, comment })
      });

      if (res.ok) {
         setComment("");
         // Optimistically prepend local review
         const fakeNew: ReviewItem = { id: Date.now().toString(), rating: selectedRating, comment, createdAt: new Date(), user: { name: "Bạn" }};
         setLocalReviews([fakeNew, ...localReviews]);
         alert("Đã gửi đánh giá thành công!");
      } else {
         const data = await res.json();
         alert(data.error || "Có lỗi xảy ra, có thể bạn chưa đăng nhập.");
      }
    } catch (err) {
      alert("Network Error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
       <h2 className={styles.headerTitle}>Đánh giá sản phẩm</h2>

       <div className={styles.summaryBlock}>
          <div className={styles.averageBox}>
             <span className={styles.bigScore}>{rating.toFixed(1)}</span>
             <Rating value={rating} showCount={false} />
             <span className={styles.totalText}>{reviewCount} đánh giá</span>
          </div>

          <div className={styles.writeBox}>
             <h3>Bạn đã dùng sản phẩm này?</h3>
             <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.starSelect}>
                   <span>Chọn mức điểm: </span>
                   <select value={selectedRating} onChange={(e) => setSelectedRating(Number(e.target.value))}>
                      {[5,4,3,2,1].map((n) => (
                         <option key={n} value={n}>{n} Sao</option>
                      ))}
                   </select>
                </div>
                <textarea 
                   className={styles.textarea} 
                   placeholder="Mời bạn chia sẻ thêm cảm nhận..."
                   value={comment}
                   onChange={(e) => setComment(e.target.value)}
                   required
                />
                <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                   {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
                </button>
             </form>
          </div>
       </div>

       <div className={styles.list}>
          {localReviews.length === 0 ? (
             <p className={styles.empty}>Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
          ) : (
             localReviews.map((rev) => (
                <div key={rev.id} className={styles.reviewCard}>
                   <div className={styles.avatar}>{rev.user.name?.charAt(0) || "U"}</div>
                   <div className={styles.revContent}>
                      <div className={styles.revMeta}>
                         <strong>{rev.user.name || "Người dùng"}</strong>
                         <span className={styles.date}>{new Date(rev.createdAt).toLocaleDateString("vi-VN")}</span>
                      </div>
                      <Rating value={rev.rating} showCount={false} />
                      <p className={styles.comment}>{rev.comment}</p>
                   </div>
                </div>
             ))
          )}
       </div>
    </div>
  );
}
