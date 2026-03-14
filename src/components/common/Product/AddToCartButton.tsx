"use client";

import { useCartStore, CartProduct } from "@/stores/cart-store";
import { ShoppingCart, Check } from "lucide-react";
import { useState } from "react";

interface AddToCartButtonProps {
  product: CartProduct;
  quantity?: number;
  className?: string;
  variant?: "primary" | "secondary" | "icon" | "contained";
  fullWidth?: boolean;
}

export default function AddToCartButton({ 
  product, 
  quantity = 1, 
  className = "", 
  variant = "primary",
  fullWidth = false 
}: AddToCartButtonProps) {
  const addItem = useCartStore(state => state.addItem);
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating if wrapped in a link
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000); // Reset after 2s
  };

  let baseStyles = "relative inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all duration-200 overflow-hidden outline-none select-none disabled:opacity-50 disabled:cursor-not-allowed";
  
  // Mapping variants to Tailwind
  switch(variant) {
    case "contained":
    case "primary":
      baseStyles += " bg-gradient-to-r from-pink-500 to-indigo-500 text-white hover:shadow-[0_0_20px_rgba(236,72,153,0.4)] hover:-translate-y-0.5 px-6 py-3 text-base";
      break;
    case "secondary":
      baseStyles += " bg-slate-800 text-white border border-slate-700/50 hover:bg-slate-700/80 px-4 py-2 text-sm";
      break;
    case "icon":
      baseStyles += " bg-pink-500/10 text-pink-500 p-2 hover:bg-pink-500/20";
      break;
  }

  if (fullWidth) baseStyles += " w-full h-[52px]";
  if (added) baseStyles += " !bg-emerald-500 !from-emerald-500 !to-emerald-400 !text-white !shadow-[0_0_20px_rgba(16,185,129,0.4)]";

  const btnClasses = `${baseStyles} ${className}`.trim();

  return (
    <button 
      className={btnClasses} 
      onClick={handleAdd}
      disabled={product.stock <= 0}
      aria-label="Thêm vào giỏ hàng"
    >
      <div className={`absolute inset-0 bg-white/20 translate-y-full transition-transform duration-300 ${added ? 'translate-y-0' : ''}`} />
      <span className="relative flex items-center gap-2 z-10">
        {variant === "icon" ? (
           added ? <Check size={20} /> : <ShoppingCart size={20} />
        ) : (
           added ? (
             <>
               <Check size={18} />
               <span>Đã thêm vào giỏ</span>
             </>
           ) : (
             <>
               <ShoppingCart size={18} />
               {product.stock <= 0 ? <span>Hết hàng</span> : <span>Thêm vào giỏ</span>}
             </>
           )
        )}
      </span>
    </button>
  );
}
