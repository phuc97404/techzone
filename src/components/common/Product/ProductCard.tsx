"use client";

import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import AddToCartButton from "./AddToCartButton";
import Rating from "@/components/ui/Rating";
import PriceDisplay from "@/components/ui/PriceDisplay";
import Badge from "@/components/ui/Badge";
import { CardContent, Box, Typography } from "@mui/material";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface ProductCardProps {
  product: any;
}

/**
 * [MOLECULE] ProductCard - Thẻ sản phẩm kết hợp nhiều Atom
 */
export function ProductCard({ product }: ProductCardProps) {
  const isSale = product.salePrice && product.salePrice < product.price;
  const discount = isSale ? Math.round((1 - product.salePrice / product.price) * 100) : 0;

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }} className="group relative z-0 before:absolute before:inset-0 before:-z-10 before:translate-x-1 before:translate-y-1 before:rounded-3xl before:bg-gradient-to-tr before:from-pink-500/20 before:to-indigo-500/20 before:blur-xl before:transition-all hover:before:bg-gradient-to-tr hover:before:from-pink-500/30 hover:before:to-indigo-500/30">
      <Link href={`/products/${product.category.slug}/${product.slug}`} className="block relative aspect-square overflow-hidden bg-white/5 p-4 rounded-t-2xl">
        <div className="relative w-full h-full transform transition-transform duration-500 group-hover:scale-110">
          <Image
            src={product.images?.[0] || "/images/placeholder.webp"}
            alt={product.name}
            fill
            className="object-contain"
          />
          {isSale && (
            <div className="absolute top-2 right-2">
              <Badge variant="danger">-{discount}%</Badge>
            </div>
          )}
        </div>
      </Link>

      <CardContent sx={{ flexGrow: 1, p: 2.5, display: 'flex', flexDirection: 'column', gap: 1.5, bg: 'slate.900' }}>
        <Typography variant="caption" className="font-bold text-pink-400 tracking-wider uppercase text-[10px]">
          {product.brand?.name || 'Brand'}
        </Typography>
        
        <Link href={`/products/${product.category.slug}/${product.slug}`} className="text-slate-200 hover:text-pink-400 transition-colors">
          <Typography variant="subtitle1" component="h3" sx={{ 
            fontWeight: 800, 
            lineHeight: 1.4,
            height: '2.8em', // Clamp 2 lines
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}>
            {product.name}
          </Typography>
        </Link>
        
        <Box sx={{ mt: 'auto', pt: 1 }}>
          <Rating value={product.rating || 5} count={product.reviewCount || 0} />
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, mt: 1 }}>
            <PriceDisplay price={product.salePrice || product.price} />
            {isSale && (
               <Typography variant="caption" sx={{ textDecoration: 'line-through' }} className="text-slate-500 font-semibold">
                 {product.price.toLocaleString()}đ
               </Typography>
            )}
          </Box>
        </Box>
      </CardContent>

      <Box sx={{ p: 2.5, pt: 0, bg: 'slate.900' }}>
        <AddToCartButton 
          product={{
             id: product.id,
             name: product.name,
             slug: product.slug,
             price: product.price,
             salePrice: product.salePrice,
             image: product.images?.[0] || "/images/placeholder.webp",
             stock: product.stock !== undefined ? product.stock : 100 // fallback
          }}
          variant="contained" 
          fullWidth
          className="!text-sm"
        />
      </Box>
    </Card>
  );
}
