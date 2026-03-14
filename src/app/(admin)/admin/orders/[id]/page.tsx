import { prisma } from "@/lib/prisma";
import OrderTimeline from "@/components/modules/Admin/OrderTimeline";
import Link from "next/link";
import { ArrowLeft, User, MapPin, Search } from "lucide-react";
import { notFound } from "next/navigation";
import Image from "next/image";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: { select: { email: true, name: true } },
      items: {
         include: {
            product: { select: { name: true, images: true, price: true } }
         }
      }
    }
  });

  if (!order) return notFound();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", maxWidth: "1200px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
         <Link href="/admin/orders" style={{ color: "var(--color-text-muted)", display: "flex", alignItems: "center" }}>
            <ArrowLeft size={20} />
         </Link>
         <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700 }}>
            Chi tiết đơn hàng {order.id.slice(-8).toUpperCase()}
         </h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem" }}>
         {/* Main Column */}
         <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ backgroundColor: "var(--color-background-elevated)", padding: "1.5rem", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)" }}>
               <h2 style={{ fontSize: "1.125rem", margin: "0 0 1.5rem 0", paddingBottom: "1rem", borderBottom: "1px solid var(--color-border)" }}>Trạng thái giao hàng</h2>
               <OrderTimeline currentStatus={order.status} orderId={order.id} />
            </div>

            <div style={{ backgroundColor: "var(--color-background-elevated)", padding: "1.5rem", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)" }}>
               <h2 style={{ fontSize: "1.125rem", margin: "0 0 1rem 0" }}>Sản phẩm ({order.items.length})</h2>
               
               <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {order.items.map(item => (
                     <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "1rem", borderBottom: "1px solid var(--color-border)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                           <div style={{ width: 60, height: 60, backgroundColor: "var(--color-background)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
                              {item.product.images[0] ? (
                                 <Image src={item.product.images[0]} alt={item.product.name} width={60} height={60} />
                              ) : (
                                 <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-muted)" }}>
                                    IMG
                                 </div>
                              )}
                           </div>
                           <div>
                              <p style={{ margin: "0 0 0.25rem 0", fontWeight: 500 }}>{item.product.name}</p>
                              <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--color-text-muted)" }}>Số lượng: x{item.quantity}</p>
                           </div>
                        </div>
                        <div style={{ fontWeight: 600 }}>
                           {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.price * item.quantity)}
                        </div>
                     </div>
                  ))}
               </div>
               
               <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "1.5rem", alignItems: "flex-end" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", width: "250px" }}>
                     <span style={{ color: "var(--color-text-muted)" }}>Giảm giá:</span>
                     <span>-{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(order.discountAmount)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", width: "250px", fontWeight: 700, fontSize: "1.25rem", borderTop: "1px solid var(--color-border)", paddingTop: "0.5rem" }}>
                     <span>Tổng cộng:</span>
                     <span style={{ color: "var(--color-primary)" }}>{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(order.total)}</span>
                  </div>
               </div>
            </div>
         </div>

         {/* Side Column */}
         <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ backgroundColor: "var(--color-background-elevated)", padding: "1.5rem", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)" }}>
               <h3 style={{ fontSize: "1rem", margin: "0 0 1rem 0", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <User size={18} /> Khách hàng
               </h3>
               <p style={{ margin: "0 0 0.25rem 0", fontWeight: 500 }}>{order.user.name}</p>
               <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--color-text-muted)" }}>{order.user.email}</p>
            </div>

            <div style={{ backgroundColor: "var(--color-background-elevated)", padding: "1.5rem", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)" }}>
               <h3 style={{ fontSize: "1rem", margin: "0 0 1rem 0", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <MapPin size={18} /> Giao hàng
               </h3>
               <p style={{ margin: "0 0 0.25rem 0", fontWeight: 500 }}>{order.shippingName}</p>
               <p style={{ margin: "0 0 0.25rem 0", fontSize: "0.875rem", color: "var(--color-text-muted)" }}>{order.shippingPhone}</p>
               <p style={{ margin: 0, fontSize: "0.875rem", lineHeight: 1.5, color: "var(--color-text-muted)" }}>
                  {order.shippingAddress}
               </p>
            </div>
            
            <div style={{ backgroundColor: "var(--color-background-elevated)", padding: "1.5rem", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)" }}>
               <h3 style={{ fontSize: "1rem", margin: "0 0 1rem 0" }}>Ghi chú</h3>
               <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
                  {order.note || "Không có ghi chú từ khách hàng."}
               </p>
            </div>
         </div>
      </div>
    </div>
  );
}
