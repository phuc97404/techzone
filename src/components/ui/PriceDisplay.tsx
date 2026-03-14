"use client";

import { Box, Typography, TypographyProps } from "@mui/material";

interface PriceDisplayProps {
  price?: number | null;
  salePrice?: number | null;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  sx?: any;
  variant?: TypographyProps["variant"];
}

/**
 * [ATOM] PriceDisplay - Hiển thị giá tiền chuẩn TechZone dùng MUI
 */
export default function PriceDisplay({ price, salePrice, sx, variant = "h6" }: PriceDisplayProps) {
  const formatPrice = (p: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p).replace('₫', 'đ');
  };

  if (!price && !salePrice) {
    return <Typography color="primary" sx={{ fontWeight: 700, ...sx }}>Liên hệ</Typography>;
  }

  const currentPrice = salePrice ?? price;
  const hasDiscount = salePrice && price && salePrice < price;

  return (
    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, ...sx }}>
      <Typography 
        variant={variant} 
        color="primary" 
        sx={{ fontWeight: 800, letterSpacing: -0.5 }}
      >
        {formatPrice(currentPrice!)}
      </Typography>
      {hasDiscount && (
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ textDecoration: 'line-through', opacity: 0.7 }}
        >
          {formatPrice(price)}
        </Typography>
      )}
    </Box>
  );
}
