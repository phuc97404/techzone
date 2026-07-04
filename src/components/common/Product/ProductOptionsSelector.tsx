"use client";

import { useState } from "react";
import { Button, Typography } from "@mui/material";
import AddToCartButton from "./AddToCartButton";
import Link from "next/link";

interface OptionValue {
  val: string;
  priceOffset: number;
}

interface OptionGroup {
  name: string;
  values: OptionValue[];
}
import PriceDisplay from "@/components/ui/PriceDisplay";
import Badge from "@/components/ui/Badge";

export default function ProductOptionsSelector({ 
  product, 
  options, 
  images 
}: { 
  product: { id: string; name: string; slug: string; price: number; salePrice?: number | null; stock: number }, 
  options: OptionGroup[], 
  images: string[] 
}) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  const handleSelect = (groupName: string, value: string) => {
    setSelectedOptions(prev => ({ ...prev, [groupName]: value }));
  };

  const isAllSelected = options.every(opt => selectedOptions[opt.name]);

  const handleBuyNow = (e: React.MouseEvent) => {
    if (!isAllSelected && options.length > 0) {
      e.preventDefault();
      alert("Vui lòng chọn đầy đủ tuỳ chọn sản phẩm trước khi mua!");
    }
  };

  const currentBasePrice = product.salePrice || product.price;
  const totalPriceOffset = options.reduce((sum, opt) => {
    const selectedVal = selectedOptions[opt.name];
    if (!selectedVal) return sum;
    const found = opt.values.find(v => v.val === selectedVal);
    return sum + (found?.priceOffset || 0);
  }, 0);
  const finalPrice = currentBasePrice + totalPriceOffset;
  const originalFinalPrice = product.price + totalPriceOffset;
  const isSale = product.salePrice && product.salePrice < product.price;

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* Price Display */}
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-6 sm:p-8 w-full shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-2">
            <div className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-400">
              <PriceDisplay price={finalPrice} sx={{ background: 'transparent', WebkitBackgroundClip: 'text', color: 'transparent', backgroundImage: 'linear-gradient(to right, #ec4899, #818cf8)' }} />
            </div>
            {isSale && (
                <Typography variant="h6" className="text-slate-500 line-through font-semibold mb-1">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(originalFinalPrice)}
                </Typography>
            )}
          </div>
          
          {isSale && (
            <div className="inline-block mt-2">
                <Badge variant="danger" className="bg-red-500/10 text-red-400 border border-red-500/30 px-3 py-1 font-bold shadow-none">
                  🔥 Tiết kiệm: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(originalFinalPrice - finalPrice).replace('₫', 'đ')}
                </Badge>
            </div>
          )}
      </div>

      {/* Options */}
      {options.length > 0 && (
        <div className="flex flex-col gap-4 mb-2">
          {options.map(opt => (
            <div key={opt.name} className="flex flex-col gap-2">
              <Typography className="text-sm font-semibold text-slate-300">
                {opt.name}: <span className="text-white ml-1 font-bold">{selectedOptions[opt.name] || ""}</span>
              </Typography>
              <div className="flex flex-wrap gap-2 pt-1">
                {opt.values.map(v => {
                  const val = v.val;
                  const isSelected = selectedOptions[opt.name] === val;
                  return (
                    <button
                      key={val}
                      onClick={() => handleSelect(opt.name, val)}
                      className={`px-4 py-2 border rounded-lg text-sm font-medium transition-all duration-200 
                        ${isSelected 
                          ? 'border-pink-500 bg-pink-500/10 text-pink-400 shadow-[0_0_10px_rgba(236,72,153,0.3)]' 
                          : 'border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-500 hover:bg-slate-700'
                        }`}
                    >
                      {val} {v.priceOffset > 0 ? `(+${new Intl.NumberFormat('vi-VN').format(v.priceOffset)}đ)` : ''}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-10">
        {product.stock > 0 ? (
          <>
            <div 
              className={`${!isAllSelected && options.length > 0 ? 'opacity-50' : ''}`} 
              onClickCapture={(e) => {
                if (!isAllSelected && options.length > 0) {
                  e.preventDefault();
                  e.stopPropagation();
                  alert("Vui lòng chọn đầy đủ tuỳ chọn sản phẩm trước khi thêm vào giỏ!");
                }
              }}
            >
              <AddToCartButton 
                product={{
                  id: Object.keys(selectedOptions).length > 0 ? `${product.id}-${JSON.stringify(selectedOptions)}` : product.id,
                  actualId: product.id,
                  name: product.name,
                  slug: product.slug,
                  price: originalFinalPrice,
                  salePrice: isSale ? finalPrice : undefined,
                  image: images.length > 0 ? images[0] : "/placeholder.png",
                  stock: product.stock,
                  selectedOptions // Phase 4 will handle this
                }} 
                variant="contained" 
                fullWidth={true}
              />
            </div>
            <Link href="/checkout" passHref className="w-full" onClick={handleBuyNow}>
              <Button 
                fullWidth 
                variant="contained" 
                className={`h-[52px] font-bold text-base transition-all rounded-xl normal-case ${!isAllSelected && options.length > 0 ? 'bg-slate-700 text-slate-400 !important' : 'bg-gradient-to-r from-pink-500 to-indigo-500 text-white shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:-translate-y-1'}`}
              >
                 Mua Ngay (Thanh toán)
              </Button>
            </Link>
          </>
        ) : (
          <Button fullWidth disabled variant="contained" className="h-[52px] bg-slate-800 text-slate-500 font-bold rounded-xl normal-case sm:col-span-2">
            TẠM HẾT HÀNG
          </Button>
        )}
      </div>
    </div>
  );
}
