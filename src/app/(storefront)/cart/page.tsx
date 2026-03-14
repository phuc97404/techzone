"use client";

import { useCartStore } from "@/stores/cart-store";
import Link from "next/link";
import Image from "next/image";
import { Trash2, ArrowLeft, ShoppingBag, Plus, Minus } from "lucide-react";
import { useEffect, useState } from "react";
import { Container, Box, Typography, Button, IconButton, Card, Divider } from "@mui/material";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Container maxWidth="lg" className="py-20 text-center animate-pulse">
        <Typography variant="h5" className="text-slate-400 font-semibold mb-4 text-xl">Đang tải giỏ hàng...</Typography>
      </Container>
    );
  }

  const handleQuantity = (id: string, currentVal: number, change: number, stock: number) => {
    const newVal = currentVal + change;
    if (newVal > 0 && newVal <= stock) {
      updateQuantity(id, newVal);
    }
  };

  if (items.length === 0) {
    return (
      <Container maxWidth="md" className="py-20 md:py-32">
        <Box className="flex flex-col items-center justify-center p-12 bg-slate-800/30 border border-slate-700/50 rounded-3xl shadow-2xl text-center">
          <div className="w-24 h-24 rounded-full bg-slate-800 border border-slate-700/50 flex items-center justify-center mb-6 shadow-inner">
             <ShoppingBag size={48} className="text-slate-500" />
          </div>
          <Typography variant="h4" className="font-black text-slate-100 mb-3 text-2xl md:text-3xl">Giỏ hàng của bạn đang trống</Typography>
          <Typography variant="body1" className="text-slate-400 mb-8 max-w-sm mx-auto text-base">Có vẻ như bạn chưa chọn mua bất kỳ sản phẩm nào. Hãy khám phá các sản phẩm tuyệt vời của TechZone nhé!</Typography>
          <Link href="/" passHref>
             <Button variant="contained" className="bg-gradient-to-r from-pink-500 to-indigo-500 rounded-xl px-10 py-3.5 text-base font-bold shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:-translate-y-1 transition-transform normal-case">
               Tiếp Tục Mua Sắm
             </Button>
          </Link>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" className="py-8 md:py-12 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-pink-400 font-semibold transition-colors">
           <ArrowLeft size={18} /> Mua thêm sản phẩm
        </Link>
        <Typography variant="h4" component="h1" className="text-2xl md:text-3xl font-black text-white">
          Giỏ hàng <span className="text-pink-500">({items.reduce((acc, i) => acc + i.quantity, 0)})</span>
        </Typography>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Cart Items */}
        <div className="w-full lg:w-2/3 flex flex-col gap-4">
          {items.map((item) => {
             const price = item.product.salePrice ?? item.product.price;
             return (
               <Card key={item.product.id} className="bg-slate-800/80 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden shadow-lg p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 animate-fade-in-up">
                 <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl bg-white/5 border border-slate-600/30 flex-shrink-0 relative overflow-hidden flex items-center justify-center">
                   <Image 
                     src={item.product.image || "/images/placeholder.webp"} 
                     alt={item.product.name} 
                     fill 
                     style={{ objectFit: 'contain' }} 
                     className="p-2"
                     sizes="(max-width: 640px) 96px, 128px"
                   />
                 </div>
                 
                 <div className="flex-1 flex flex-col justify-between w-full h-full min-w-0">
                   <div>
                     <Link href={`/products/cat/${item.product.slug}`} className="text-lg font-bold text-slate-200 hover:text-pink-400 transition-colors line-clamp-2 leading-tight mb-2">
                       {item.product.name}
                     </Link>
                     <Typography variant="body2" className="text-slate-400 mb-4 inline-flex px-2 py-0.5 rounded-full bg-slate-700/50 border border-slate-600/50">
                       Còn lại: {item.product.stock}
                     </Typography>
                   </div>
                   
                   <div className="flex items-center justify-between mt-auto">
                      <div className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-400">
                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price)}
                      </div>
                      
                      <div className="flex items-center flex-shrink-0 gap-4">
                        <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-xl overflow-hidden shadow-inner h-10">
                          <button 
                             className="w-10 h-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-slate-400" 
                             onClick={() => handleQuantity(item.product.id, item.quantity, -1, item.product.stock)}
                             disabled={item.quantity <= 1}
                             aria-label="Giảm"
                          ><Minus size={16} /></button>
                          
                          <input 
                             type="number" 
                             className="w-12 h-full bg-transparent text-center text-white font-bold text-sm outline-none border-x border-slate-700/80 appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                             value={item.quantity} 
                             onChange={(e) => updateQuantity(item.product.id, Number(e.target.value))} 
                             min={1} 
                             max={item.product.stock}
                          />
                          
                          <button 
                             className="w-10 h-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-slate-400" 
                             onClick={() => handleQuantity(item.product.id, item.quantity, 1, item.product.stock)}
                             disabled={item.quantity >= item.product.stock}
                             aria-label="Tăng"
                          ><Plus size={16} /></button>
                        </div>
                        
                        <IconButton 
                          onClick={() => removeItem(item.product.id)} 
                          className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-400 transition-colors"
                          aria-label="Xóa"
                        >
                           <Trash2 size={18} />
                        </IconButton>
                      </div>
                   </div>
                 </div>
               </Card>
             );
          })}
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-1/3">
          <Card className="sticky top-28 bg-slate-800/80 backdrop-blur-md border border-slate-700/50 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <Typography variant="h5" className="font-black text-slate-100 mb-6 uppercase tracking-wide flex items-center gap-3">
              <span className="w-1 h-6 bg-pink-500 rounded-full inline-block"></span>
              Tổng đơn hàng
            </Typography>
            
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex justify-between items-center text-slate-300">
                <span className="font-medium text-[15px]">Tạm tính</span>
                <span className="font-bold text-[15px]">{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(getTotalPrice())}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span className="font-medium text-[15px]">Phí vận chuyển</span>
                <span className="text-sm italic">Tính lúc thanh toán</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span className="font-medium text-[15px]">Giảm giá</span>
                <span className="font-bold text-[15px]">0 ₫</span>
              </div>
            </div>
            
            <Divider className="bg-slate-700/50 mb-6" />
            
            <div className="flex justify-between items-center mb-8">
              <span className="text-lg font-bold text-slate-200">Tổng cộng</span>
              <span className="text-2xl font-black bg-gradient-to-r from-pink-400 to-indigo-400 bg-clip-text text-transparent">
                 {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(getTotalPrice())}
              </span>
            </div>
            
            <Link href="/checkout" passHref>
              <Button fullWidth variant="contained" className="bg-gradient-to-r from-pink-500 to-indigo-500 rounded-xl py-4 text-white font-bold text-base shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] transition-all normal-case uppercase tracking-wide">
                Tiến Hành Thanh Toán
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </Container>
  );
}
