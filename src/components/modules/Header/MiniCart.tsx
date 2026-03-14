"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/stores/cart-store";
import { ShoppingCart, X } from "lucide-react";
import { Box, Typography, Button, IconButton } from "@mui/material";

export default function MiniCart() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { items, getTotalItems, getTotalPrice, removeItem } = useCartStore();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!mounted) {
    return (
      <div className="relative inline-flex items-center">
        <div className="flex flex-col items-center justify-center p-2 rounded-xl text-slate-300">
          <ShoppingCart size={22} className="text-indigo-400" />
          <span className="hidden sm:inline text-xs mt-1 font-semibold">Giỏ hàng</span>
          <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-pink-500 text-white text-[10px] font-black rounded-full shadow-lg border border-slate-900 leading-none">
            0
          </span>
        </div>
      </div>
    );
  }

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();
  const displayItems = items.slice(0, 3);

  return (
    <div className="relative inline-block z-50 animate-fade-in" ref={dropdownRef}>
      <button 
        className="relative flex items-center justify-center gap-2 p-2 rounded-xl hover:bg-slate-800/50 text-slate-300 hover:text-white transition-colors outline-none focus:ring-2 focus:ring-pink-500/50 group" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Giỏ hàng"
      >
        <div className="relative">
          <ShoppingCart size={22} className="text-indigo-400 group-hover:text-indigo-300 transition-colors" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 w-[18px] h-[18px] flex items-center justify-center bg-pink-500 text-white text-[10px] font-black rounded-full shadow-[0_2px_8px_rgba(236,72,153,0.5)] border-2 border-slate-900 leading-none scale-100 group-hover:scale-110 transition-transform">
              {totalItems}
            </span>
          )}
        </div>
        <span className="hidden sm:inline text-sm font-semibold tracking-wide">Giỏ hàng</span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-3 w-80 md:w-96 bg-slate-800/95 backdrop-blur-2xl border border-slate-700/50 shadow-2xl rounded-2xl overflow-hidden animate-fade-in-up">
          <div className="px-5 py-4 border-b border-slate-700/50 bg-slate-800/50 flex items-center justify-between">
            <Typography variant="h6" className="text-base font-bold text-slate-100 flex items-center gap-2">
              <ShoppingCart size={18} className="text-indigo-400" />
              Giỏ hàng <span className="text-sm font-medium text-slate-400">({totalItems})</span>
            </Typography>
            <IconButton size="small" onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-pink-400">
              <X size={18} />
            </IconButton>
          </div>

          <div className="max-h-[360px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                <ShoppingCart size={48} className="text-slate-700 mb-4" />
                <Typography variant="body1" className="text-slate-300 font-semibold mb-1">Giỏ hàng trống.</Typography>
                <Typography variant="body2" className="text-slate-500 text-sm">Hãy thêm sản phẩm vào giỏ nhé!</Typography>
              </div>
            ) : (
              <ul className="flex flex-col gap-1 p-3">
                {displayItems.map((item) => (
                  <li key={item.product.id} className="group relative flex gap-3 p-3 bg-slate-800/30 border border-slate-700/30 hover:border-slate-600/50 rounded-xl transition-colors items-start">
                    <div className="w-16 h-16 rounded-lg bg-white/5 border border-slate-700/50 relative overflow-hidden flex-shrink-0 flex items-center justify-center text-slate-500">
                      {item.product.image ? (
                        <Image 
                          src={item.product.image} 
                          alt={item.product.name}
                          fill
                          style={{ objectFit: "contain" }}
                          sizes="64px"
                        />
                      ) : (
                        <ShoppingCart size={20} />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0 pr-6">
                      <Link href={`/products/cat/${item.product.slug}`} className="block text-sm font-semibold text-slate-200 truncate hover:text-pink-400 transition-colors mb-1" onClick={() => setIsOpen(false)}>
                        {item.product.name}
                      </Link>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm font-bold bg-gradient-to-r from-pink-400 to-indigo-400 bg-clip-text text-transparent">
                          {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.product.salePrice ?? item.product.price)}
                        </span>
                        <span className="text-xs font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                          SL: {item.quantity}
                        </span>
                      </div>
                    </div>

                    <button 
                      className="absolute right-3 top-3 w-6 h-6 flex items-center justify-center rounded-full bg-slate-800 border border-slate-700 text-slate-400 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100" 
                      onClick={() => removeItem(item.product.id)}
                      aria-label="Xóa"
                    >
                      <X size={14} />
                    </button>
                  </li>
                ))}
                
                {items.length > 3 && (
                  <li className="py-2 text-center text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-800/50 rounded-lg mt-1 border border-slate-700/50">
                    + {items.length - 3} sản phẩm khác
                  </li>
                )}
              </ul>
            )}
          </div>

          {items.length > 0 && (
            <div className="p-5 border-t border-slate-700/50 bg-slate-900/80 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <Typography variant="body2" className="text-slate-400 font-semibold uppercase tracking-wider text-xs">Tổng tiền tạm tính:</Typography>
                <Typography variant="h6" className="font-black text-white">
                  {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(totalPrice)}
                </Typography>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Link href="/cart" passHref className="w-full">
                  <Button variant="outlined" fullWidth onClick={() => setIsOpen(false)} className="rounded-xl border-slate-600 text-slate-300 hover:border-pink-500 hover:text-pink-400 hover:bg-pink-500/5 transition-colors font-bold normal-case py-2.5">
                    Giỏ hàng
                  </Button>
                </Link>
                <Link href="/checkout" passHref className="w-full">
                  <Button variant="contained" fullWidth onClick={() => setIsOpen(false)} className="rounded-xl bg-gradient-to-r from-pink-500 to-indigo-500 font-bold normal-case py-2.5 shadow-[0_0_15px_rgba(236,72,153,0.3)] hover:shadow-[0_0_25px_rgba(236,72,153,0.4)] hover:-translate-y-px transition-all">
                    Thanh toán
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
