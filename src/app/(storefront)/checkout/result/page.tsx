"use client";

import React, { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Container, Typography, Card, Box, Button, CircularProgress } from "@mui/material";
import { CheckCircle, XCircle, AlertCircle, ShoppingBag, History, Loader2 } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import Link from "next/link";

function ResultContent() {
    const searchParams = useSearchParams();
    const status = searchParams.get("status");
    const orderCode = searchParams.get("orderCode");
    const message = searchParams.get("message");
    const clearCart = useCartStore(state => state.clearCart);

    useEffect(() => {
        if (status === "success") {
            clearCart();
        }
    }, [status, clearCart]);

    const renderIcon = () => {
        switch (status) {
            case "success":
                return (
                    <Box sx={{ position: "relative", display: "inline-flex", mb: 4 }}>
                        <CheckCircle size={100} className="text-emerald-400" strokeWidth={1.5} />
                    </Box>
                );
            case "failed":
                return <XCircle size={100} className="text-rose-500 mb-8" strokeWidth={1.5} />;
            default:
                return <AlertCircle size={100} className="text-amber-500 mb-8" strokeWidth={1.5} />;
        }
    };

    const renderTitle = () => {
        switch (status) {
            case "success": return "Thanh toán thành công!";
            case "failed": return "Thanh toán thất bại";
            default: return "Có lỗi xảy ra";
        }
    };

    return (
        <Card className="bg-slate-800/80 backdrop-blur-md border border-slate-700/50 rounded-[2.5rem] p-10 md:p-16 text-center shadow-2xl overflow-hidden relative">
            {/* Background glowing effects */}
            <div className={`absolute -top-24 -left-24 w-64 h-64 rounded-full blur-[100px] opacity-20 ${status === 'success' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
            <div className={`absolute -bottom-24 -right-24 w-64 h-64 rounded-full blur-[100px] opacity-10 ${status === 'success' ? 'bg-blue-500' : 'bg-amber-500'}`} />

            <Box className="relative z-10 flex flex-col items-center">
                {renderIcon()}
                
                <Typography variant="h3" component="h1" className="font-black text-white mb-4 tracking-tight">
                    {renderTitle()}
                </Typography>

                <Typography className="text-slate-400 text-lg md:text-xl max-w-2xl mb-12 leading-relaxed">
                    {status === "success" 
                        ? (
                           <>
                              Chúc mừng! Đơn hàng <span className="text-pink-400 font-bold">#{orderCode}</span> của bạn đã được thanh toán thành công. 
                              Chúng tôi sẽ sớm liên hệ để giao hàng cho bạn.
                           </>
                        )
                        : (message || "Giao dịch không thể hoàn tất do lỗi hệ thống hoặc bị hủy bỏ. Vui lòng kiểm tra lại phương thức thanh toán của bạn.")
                    }
                </Typography>

                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                    <Button 
                        variant="contained" 
                        component={Link}
                        href="/" 
                        className="bg-gradient-to-r from-pink-500 to-indigo-500 rounded-2xl py-4 px-8 text-white font-bold text-lg shadow-lg hover:-translate-y-1 transition-all normal-case"
                        startIcon={<ShoppingBag size={20} />}
                    >
                        Tiếp tục mua hàng
                    </Button>
                    <Button 
                        variant="outlined" 
                        component={Link}
                        href="/account/orders" 
                        className="border-2 border-slate-700 rounded-2xl py-4 px-8 text-slate-300 font-bold text-lg hover:bg-slate-700/30 transition-all normal-case"
                        startIcon={<History size={20} />}
                    >
                        Lịch sử đơn hàng
                    </Button>
                </div>
            </Box>
        </Card>
    );
}

export default function CheckoutResultPage() {
    return (
        <Container maxWidth="md" className="py-24 md:py-32 min-h-screen">
            <Suspense fallback={
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="animate-spin text-pink-500" size={48} />
                    <Typography className="text-slate-400 font-medium">Đang xử lý kết quả...</Typography>
                </div>
            }>
                <ResultContent />
            </Suspense>
        </Container>
    );
}
