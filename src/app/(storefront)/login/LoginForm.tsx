"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowLeft, LogIn } from "lucide-react";
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Divider,
  CircularProgress,
} from "@mui/material";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Email hoặc mật khẩu không đúng. Vui lòng thử lại.");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("Có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box className="min-h-[80vh] flex items-center justify-center p-4 relative">
      {/* Decorative gradient blobs */}
      <Box className="absolute top-[15%] left-[20%] w-[300px] h-[300px] bg-[radial-gradient(circle,_rgba(236,72,153,0.08)_0%,_transparent_70%)] rounded-full pointer-events-none" />
      <Box className="absolute bottom-[15%] right-[15%] w-[250px] h-[250px] bg-[radial-gradient(circle,_rgba(99,102,241,0.06)_0%,_transparent_70%)] rounded-full pointer-events-none" />

      <Box className="w-full max-w-[440px] relative z-10 animate-fade-in-up">
        <Card className="p-8 md:p-10 shadow-xl relative overflow-hidden bg-slate-800/80 backdrop-blur-md border border-slate-700/50 rounded-2xl">
          {/* Top border accent */}
          <Box className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-pink-500 to-indigo-500" />

          <Box className="text-center mb-8">
            <Typography
              variant="h5"
              className="font-extrabold bg-gradient-to-r from-pink-500 to-indigo-500 bg-clip-text text-transparent mb-2"
            >
              TechZone
            </Typography>
            <Typography variant="h6" className="font-bold text-slate-100 mt-3 mb-1">
              Đăng nhập
            </Typography>
            <Typography variant="body2" className="text-slate-400">
              Chào mừng trở lại! Đăng nhập để tiếp tục mua sắm.
            </Typography>
          </Box>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              autoFocus
              variant="outlined"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Mail size={18} className="text-slate-400" />
                    </InputAdornment>
                  ),
                  className: "bg-slate-900/50 rounded-xl",
                },
              }}
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255,255,255,0.1)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255,255,255,0.2)',
                },
              }}
            />

            <TextField
              fullWidth
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock size={18} className="text-slate-400" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="small"
                        className="text-slate-400"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  className: "bg-slate-900/50 rounded-xl",
                },
              }}
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255,255,255,0.1)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255,255,255,0.2)',
                },
              }}
            />

            {error && (
              <Box className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg animate-fade-in text-sm">
                <AlertCircle size={16} />
                <span>{error}</span>
              </Box>
            )}

            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              className="mt-2 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-indigo-500 text-white font-bold text-base shadow-[0_0_20px_rgba(236,72,153,0.15)] hover:shadow-[0_0_30px_rgba(236,72,153,0.25)] hover:-translate-y-px transition-all normal-case"
            >
              {isLoading ? (
                <>
                  <CircularProgress size={18} color="inherit" className="mr-2" />
                  Đang đăng nhập...
                </>
              ) : (
                <>
                  <LogIn size={18} className="mr-2" />
                  Đăng nhập
                </>
              )}
            </Button>
          </form>

          <Divider className="my-6 text-slate-500 text-xs before:border-slate-700 after:border-slate-700">
            hoặc
          </Divider>

          <Typography className="text-center text-sm text-slate-400">
            Chưa có tài khoản?{" "}
            <Link href="/register" className="text-pink-400 font-semibold hover:text-pink-300 hover:underline transition-colors">
              Đăng ký ngay
            </Link>
          </Typography>
        </Card>

        <Link href="/" className="flex items-center justify-center gap-2 mt-6 text-sm text-slate-400 hover:text-slate-300 transition-colors">
          <ArrowLeft size={16} />
          Quay lại trang chủ
        </Link>
      </Box>
    </Box>
  );
}
