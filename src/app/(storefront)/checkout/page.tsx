"use client";

import { useCartStore } from "@/stores/cart-store";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CheckCircle, CreditCard, MapPin, Loader2, Tag, ChevronRight, XCircle } from "lucide-react";
import { Container, Box, Typography, Button, TextField, Card, Divider, Radio, RadioGroup, FormControlLabel, FormControl, Dialog, DialogContent, DialogTitle, IconButton, CircularProgress } from "@mui/material";
import { X, QrCode } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  
  const [formData, setFormData] = useState({
    shippingName: "",
    shippingPhone: "",
    shippingAddress: "",
    note: ""
  });
  
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // VNPay QR state
  const [vnpayInfo, setVnpayInfo] = useState<{ url: string; orderCode: string } | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string>("PENDING");

  // Polling for payment status
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (vnpayInfo && paymentStatus === "PENDING") {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/orders/status/${vnpayInfo.orderCode}`);
          if (res.ok) {
            const data = await res.json();
            if (data.status === "PAID") {
              setPaymentStatus("PAID");
              clearInterval(interval);
              setTimeout(() => {
                clearCart();
                router.push(`/checkout/result?status=success&orderCode=${vnpayInfo.orderCode}`);
              }, 2000);
            } else if (data.status === "FAILED") {
              setPaymentStatus("FAILED");
              clearInterval(interval);
            }
          }
        } catch (e) {
          console.error("Polling error:", e);
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [vnpayInfo, paymentStatus, router, clearCart]);

  useEffect(() => {
    setMounted(true);
    if (useCartStore.getState().items.length === 0) {
      router.push("/cart");
    }
  }, [router]);

  if (!mounted || items.length === 0) {
    return (
      <Container maxWidth="lg" className="py-20 text-center animate-pulse">
        <Typography variant="h5" className="text-slate-400 font-semibold mb-4 text-xl">Đang tải trang thanh toán...</Typography>
      </Container>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleApplyPromo = async () => {
    if (!promoCode) return;
    setPromoError("");
    
    // Call generic API endpoint to validate promo
    try {
       const res = await fetch(`/api/promotions/validate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: promoCode, orderTotal: getTotalPrice() })
       });
       
       if (res.ok) {
          const data = await res.json();
          setDiscount(data.discountAmount);
       } else {
          const err = await res.json();
          setPromoError(err.error || "Mã không hợp lệ");
          setDiscount(0);
       }
    } catch(e) {
       setPromoError("Lỗi kết nối");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const orderData = {
        ...formData,
        items: items.map(i => ({ 
           productId: i.product.actualId || i.product.id, 
           quantity: i.quantity,
           price: i.product.salePrice ?? i.product.price,
           selectedOptions: i.product.selectedOptions || null
        })),
        promoCode: promoCode && discount > 0 ? promoCode : undefined,
      };

      if (paymentMethod === "vnpay") {
        const vnpayRes = await fetch("/api/payment/vnpay/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData)
        });

        if (vnpayRes.ok) {
          const vnpayData = await vnpayRes.json();
          console.log("✅ VNPay create success:", vnpayData);
          if (vnpayData.url) {
            setVnpayInfo({
              url: vnpayData.url,
              orderCode: vnpayData.orderCode
            });
            return;
          }
        }
        
        const vnpayErr = await vnpayRes.json();
        console.error("❌ VNPay create error:", vnpayErr);
        alert(vnpayErr.error || "Có lỗi xảy ra khi tạo thanh toán VNPay.");
        return;
      }

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
      });

      if (res.ok) {
         const data = await res.json();
         clearCart();
         router.push(`/checkout/success?orderId=${data.id}`);
      } else {
         const err = await res.json();
         alert(err.error || "Có lỗi xảy ra khi đặt hàng.");
      }
    } catch (error) {
       alert("Lỗi kết nối máy chủ");
    } finally {
       setIsSubmitting(false);
    }
  };

  const subtotal = getTotalPrice();
  const total = subtotal - discount;

  return (
    <Container maxWidth="xl" className="py-8 md:py-12 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-400">
          <Link href="/cart" className="hover:text-pink-400 transition-colors flex items-center gap-1">
             <ArrowLeft size={16} /> Giỏ hàng
          </Link>
          <ChevronRight size={14} className="text-slate-600" />
          <span className="text-white">Thanh toán</span>
        </div>
        <Typography variant="h4" component="h1" className="text-2xl md:text-3xl font-black text-white">
          Thanh toán an toàn <span className="text-pink-500">🔒</span>
        </Typography>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Column - Form */}
        <div className="w-full lg:w-3/5 flex flex-col gap-6">
           <Card className="bg-slate-800/80 backdrop-blur-md border border-slate-700/50 rounded-3xl p-6 sm:p-8 shadow-lg">
              <Typography variant="h5" className="font-bold text-slate-100 flex items-center gap-3 mb-6">
                <MapPin className="text-pink-500" />
                Thông tin giao hàng
              </Typography>
              
              <div className="flex flex-col gap-5">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                   <TextField
                     fullWidth
                     label="Họ và tên"
                     name="shippingName"
                     value={formData.shippingName}
                     onChange={handleChange}
                     required
                     variant="outlined"
                     placeholder="Nhập họ tên người nhận"
                     sx={{
                        "& .MuiOutlinedInput-root": {
                           "& fieldset": { borderColor: "rgba(148, 163, 184, 0.3)" },
                           "&:hover fieldset": { borderColor: "rgba(148, 163, 184, 0.5)" },
                           "&.Mui-focused fieldset": { borderColor: "#ec4899" }
                        },
                        "& .MuiInputBase-input": { color: "#f1f5f9" },
                        "& .MuiInputLabel-root": { color: "#94a3b8" },
                        "& .MuiInputLabel-root.Mui-focused": { color: "#ec4899" }
                     }}
                   />
                   <TextField
                     fullWidth
                     label="Số điện thoại"
                     name="shippingPhone"
                     type="tel"
                     value={formData.shippingPhone}
                     onChange={handleChange}
                     required
                     variant="outlined"
                     placeholder="Nhập số điện thoại"
                     sx={{
                        "& .MuiOutlinedInput-root": {
                           "& fieldset": { borderColor: "rgba(148, 163, 184, 0.3)" },
                           "&:hover fieldset": { borderColor: "rgba(148, 163, 184, 0.5)" },
                           "&.Mui-focused fieldset": { borderColor: "#ec4899" }
                        },
                        "& .MuiInputBase-input": { color: "#f1f5f9" },
                        "& .MuiInputLabel-root": { color: "#94a3b8" },
                        "& .MuiInputLabel-root.Mui-focused": { color: "#ec4899" }
                     }}
                   />
                 </div>
                 
                 <TextField
                   fullWidth
                   label="Địa chỉ giao hàng"
                   name="shippingAddress"
                   value={formData.shippingAddress}
                   onChange={handleChange}
                   required
                   multiline
                   rows={3}
                   variant="outlined"
                   placeholder="Ví dụ: 123 Đường ABC, Phường X, Quận Y, TP HCM"
                   sx={{
                      "& .MuiOutlinedInput-root": {
                         "& fieldset": { borderColor: "rgba(148, 163, 184, 0.3)" },
                         "&:hover fieldset": { borderColor: "rgba(148, 163, 184, 0.5)" },
                         "&.Mui-focused fieldset": { borderColor: "#ec4899" }
                      },
                      "& .MuiInputBase-input": { color: "#f1f5f9" },
                      "& .MuiInputLabel-root": { color: "#94a3b8" },
                      "& .MuiInputLabel-root.Mui-focused": { color: "#ec4899" }
                   }}
                 />
                 
                 <TextField
                   fullWidth
                   label="Ghi chú đơn hàng (Tùy chọn)"
                   name="note"
                   value={formData.note}
                   onChange={handleChange}
                   multiline
                   rows={2}
                   variant="outlined"
                   placeholder="Thời gian giao nhận mong muốn, chỉ dẫn đường..."
                   sx={{
                      "& .MuiOutlinedInput-root": {
                         "& fieldset": { borderColor: "rgba(148, 163, 184, 0.3)" },
                         "&:hover fieldset": { borderColor: "rgba(148, 163, 184, 0.5)" },
                         "&.Mui-focused fieldset": { borderColor: "#ec4899" }
                      },
                      "& .MuiInputBase-input": { color: "#f1f5f9" },
                      "& .MuiInputLabel-root": { color: "#94a3b8" },
                      "& .MuiInputLabel-root.Mui-focused": { color: "#ec4899" }
                   }}
                 />
              </div>
           </Card>

           <Card className="bg-slate-800/80 backdrop-blur-md border border-slate-700/50 rounded-3xl p-6 sm:p-8 shadow-lg">
              <Typography variant="h5" className="font-bold text-slate-100 flex items-center gap-3 mb-6">
                <CreditCard className="text-indigo-400" />
                Phương thức thanh toán
              </Typography>
              
              <FormControl component="fieldset" className="w-full">
                 <RadioGroup 
                    aria-label="payment method" 
                    name="payment" 
                    value={paymentMethod} 
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="flex flex-col gap-3"
                 >
                    <div className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center ${paymentMethod === 'cod' ? 'border-pink-500 bg-pink-500/5' : 'border-slate-700 bg-slate-800 hover:border-slate-600'}`} onClick={() => setPaymentMethod('cod')}>
                      <FormControlLabel 
                         value="cod" 
                         control={<Radio sx={{ color: 'rgba(255,255,255,0.5)', '&.Mui-checked': { color: '#ec4899' } }} />} 
                         label={<span className="font-semibold text-slate-200 ml-2">Thanh toán khi nhận hàng (COD)</span>}
                         className="m-0 w-full"
                      />
                    </div>
                    {/* Placeholder for future gateways */}
                    <div className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center ${paymentMethod === 'vnpay' ? 'border-pink-500 bg-pink-500/5' : 'border-slate-700 bg-slate-800 hover:border-slate-600'}`} onClick={() => setPaymentMethod('vnpay')}>
                      <FormControlLabel 
                         value="vnpay" 
                         control={<Radio sx={{ color: 'rgba(255,255,255,0.5)', '&.Mui-checked': { color: '#ec4899' } }} />} 
                         label={<span className="font-semibold text-slate-200 ml-2">Thanh toán qua cổng VNPay</span>}
                         className="m-0 w-full"
                      />
                    </div>
                 </RadioGroup>
              </FormControl>
           </Card>
        </div>

        {/* Right Column - Summary */}
        <div className="w-full lg:w-2/5">
           <Card className="sticky top-28 bg-slate-800/80 backdrop-blur-md border border-slate-700/50 rounded-3xl p-6 sm:p-8 shadow-2xl">
              <Typography variant="h5" className="font-black text-slate-100 mb-6 uppercase tracking-wide flex items-center gap-3">
                <span className="w-1 h-6 bg-pink-500 rounded-full inline-block"></span>
                Đơn hàng của bạn
              </Typography>
              
              <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 pr-2 mb-6">
                 {items.map((item) => {
                    const price = item.product.salePrice ?? item.product.price;
                    return (
                       <div key={item.product.id} className="flex gap-4 items-center bg-slate-900/50 p-3 rounded-xl border border-slate-700/30">
                          <div className="relative w-16 h-16 rounded-lg bg-white/5 border border-slate-600/30 overflow-hidden shrink-0 flex items-center justify-center">
                             <Image 
                                src={item.product.image || "/images/placeholder.webp"} 
                                alt={item.product.name} 
                                fill 
                                style={{ objectFit: 'contain' }} 
                                className="p-1"
                             />
                             <span className="absolute -top-1 -right-1 bg-slate-700 text-white w-5 h-5 flex items-center justify-center text-[10px] font-bold rounded-full">
                                {item.quantity}
                             </span>
                          </div>
                          <div className="flex-1 min-w-0">
                             <Typography variant="body2" className="text-slate-200 font-semibold truncate leading-tight">
                                {item.product.name}
                             </Typography>
                             {item.product.selectedOptions && Object.keys(item.product.selectedOptions).length > 0 && (
                                <Typography variant="caption" className="text-slate-400 block truncate mt-0.5">
                                   {Object.entries(item.product.selectedOptions).map(([k, v]) => `${k}: ${v}`).join(' | ')}
                                </Typography>
                             )}
                             <Typography variant="body2" className="text-pink-400 font-bold mt-1">
                                {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price * item.quantity)}
                             </Typography>
                          </div>
                       </div>
                    );
                 })}
              </div>

              <Divider className="bg-slate-700/50 mb-6" />

              {/* Promo Section */}
              <div className="mb-6">
                 <Typography variant="subtitle2" className="text-slate-400 font-semibold mb-3 flex items-center gap-2">
                   <Tag size={16} /> Mã giảm giá
                 </Typography>
                 <div className="flex flex-col sm:flex-row gap-3">
                    <TextField 
                       value={promoCode}
                       onChange={e => setPromoCode(e.target.value)}
                       placeholder="Nhập mã giảm giá"
                       variant="outlined"
                       size="small"
                       fullWidth
                       sx={{
                          "& .MuiOutlinedInput-root": {
                             color: "white",
                             backgroundColor: "rgba(15, 23, 42, 0.5)",
                             "& fieldset": { borderColor: "rgba(148, 163, 184, 0.3)" },
                             "&:hover fieldset": { borderColor: "rgba(148, 163, 184, 0.5)" },
                             "&.Mui-focused fieldset": { borderColor: "#ec4899" }
                          }
                       }}
                    />
                    <Button 
                       type="button" 
                       onClick={handleApplyPromo} 
                       disabled={!promoCode}
                       variant="outlined"
                       className={`shrink-0 whitespace-nowrap normal-case font-bold border-2 ${promoCode ? 'border-pink-500 text-pink-400 hover:bg-pink-500 hover:text-white' : 'border-slate-700 text-slate-500'}`}
                    >
                       Áp dụng
                    </Button>
                 </div>
                 {promoError && <Typography variant="caption" className="text-red-400 mt-2 block">{promoError}</Typography>}
                 {discount > 0 && (
                    <Typography variant="caption" className="text-emerald-400 mt-2 flex items-center gap-1 font-medium">
                       <CheckCircle size={14} /> Tuyệt vời! Bạn được giảm {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(discount)}
                    </Typography>
                 )}
              </div>

              <Divider className="bg-slate-700/50 mb-6" />

              <div className="flex flex-col gap-4 mb-6">
                 <div className="flex justify-between items-center text-slate-300">
                    <span className="font-medium">Tạm tính</span>
                    <span className="font-bold">{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(subtotal)}</span>
                 </div>
                 <div className="flex justify-between items-center text-slate-300">
                    <span className="font-medium">Phí giao hàng</span>
                    <span className="font-bold text-emerald-400">Miễn phí</span>
                 </div>
                 {discount > 0 && (
                    <div className="flex justify-between items-center text-emerald-400">
                       <span className="font-medium">Giảm giá mã ưu đãi</span>
                       <span className="font-bold">-{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(discount)}</span>
                    </div>
                 )}
              </div>
              
              <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 mb-6">
                 <span className="text-lg font-bold text-slate-200">Tổng cộng</span>
                 <span className="text-2xl font-black bg-gradient-to-r from-pink-400 to-indigo-400 bg-clip-text text-transparent">
                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(total)}
                 </span>
              </div>
              
              <Button 
                 type="submit" 
                 fullWidth 
                 variant="contained" 
                 disabled={isSubmitting}
                 className="bg-gradient-to-r from-pink-500 to-indigo-500 rounded-xl py-4 text-white font-bold text-lg shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] transition-all normal-case tracking-wide"
              >
                 {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                       <Loader2 className="animate-spin" size={20} /> Đang xử lý...
                    </span>
                 ) : "🔥 Đặt Hàng Ngay"}
              </Button>
           </Card>
        </div>
      </form>

      {/* VNPay QR Code Modal */}
      <Dialog 
        open={!!vnpayInfo} 
        onClose={() => paymentStatus === "PENDING" && setVnpayInfo(null)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '2.5rem',
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(148, 163, 184, 0.1)',
            overflow: 'visible'
          }
        }}
      >
        <DialogTitle className="text-center pt-8">
          <Typography variant="h5" className="font-black text-white flex items-center justify-center gap-3">
            <QrCode className="text-pink-500" />
            Quét mã thanh toán
          </Typography>
          {paymentStatus === "PENDING" && (
            <IconButton
              onClick={() => setVnpayInfo(null)}
              sx={{ position: 'absolute', right: 16, top: 16, color: '#94a3b8' }}
            >
              <X size={24} />
            </IconButton>
          )}
        </DialogTitle>
        <DialogContent className="flex flex-col items-center pb-10">
          <Box className="relative mb-8 p-4 bg-white rounded-3xl shadow-[0_0_40px_rgba(236,72,153,0.2)]">
            {vnpayInfo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={`https://quickchart.io/qr?text=${encodeURIComponent(vnpayInfo.url)}&size=250&margin=2&ecLevel=M`}
                alt="VNPay QR Code"
                width={256}
                height={256}
                className="w-64 h-64 rounded-xl"
                onLoad={(e) => (e.currentTarget.style.opacity = '1')}
                style={{ opacity: 0, transition: 'opacity 0.3s ease' }}
              />
            )}
            {paymentStatus === "PAID" && (
              <Box className="absolute inset-0 bg-emerald-500/90 rounded-3xl flex flex-col items-center justify-center text-white p-4 text-center">
                <CheckCircle size={64} className="mb-2 animate-bounce" />
                <Typography variant="h6" className="font-bold">Thanh toán thành công!</Typography>
                <Typography variant="caption">Đang chuyển hướng...</Typography>
              </Box>
            )}
            {paymentStatus === "FAILED" && (
              <Box className="absolute inset-0 bg-rose-500/90 rounded-3xl flex flex-col items-center justify-center text-white p-4 text-center">
                <XCircle size={64} className="mb-2" />
                <Typography variant="h6" className="font-bold">Thanh toán thất bại</Typography>
                <Button 
                  size="small" 
                  variant="contained" 
                  onClick={() => setPaymentStatus("PENDING")}
                  className="mt-2 bg-white text-rose-500 font-bold"
                >
                  Thử lại
                </Button>
              </Box>
            )}
          </Box>

          <Typography className="text-slate-300 text-center mb-6 px-4">
            Mở ứng dụng ngân hàng và <span className="text-pink-400 font-bold">quét mã QR</span> để hoàn tất đặt hàng <span className="text-white font-bold">#{vnpayInfo?.orderCode}</span>
          </Typography>

          <div className="flex flex-col gap-3 w-full px-4">
             {paymentStatus === "PENDING" && (
               <div className="flex items-center gap-3 text-slate-400 text-sm mb-2 justify-center">
                  <CircularProgress size={16} sx={{ color: '#ec4899' }} />
                  Đang chờ xác nhận thanh toán...
               </div>
             )}
             <Button 
                variant="contained"
                fullWidth
                onClick={() => { if (vnpayInfo) window.location.href = vnpayInfo.url; }}
                className="bg-gradient-to-r from-pink-500 to-indigo-500 rounded-xl py-3 normal-case font-bold text-white"
             >
                Thanh toán ngay qua VNPay
             </Button>
             <Button 
                variant="text"
                onClick={() => setVnpayInfo(null)}
                className="text-slate-500 text-sm normal-case"
             >
                Huỷ đặt hàng
             </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Container>
  );
}
