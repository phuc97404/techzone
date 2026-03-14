"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowLeft, UserPlus, CheckCircle } from "lucide-react";
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

function getPasswordStrength(password: string): { level: number; text: string } {
  if (!password) return { level: 0, text: "" };
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { level: 1, text: "Yếu" };
  if (score <= 3) return { level: 2, text: "Trung bình" };
  return { level: 3, text: "Mạnh" };
}

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        setSuccess(true);
        // Auto sign in after successful registration
        const signInResult = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (signInResult?.ok) {
          router.push("/");
          router.refresh();
        } else {
          router.push("/login");
        }
      } else {
        const data = await res.json();
        setError(data.error || "Có lỗi xảy ra khi đăng ký");
      }
    } catch {
      setError("Lỗi kết nối máy chủ. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box className="min-h-[80vh] flex items-center justify-center p-4 relative">
      <Box className="absolute top-[15%] right-[20%] w-[300px] h-[300px] bg-[radial-gradient(circle,_rgba(6,182,212,0.08)_0%,_transparent_70%)] rounded-full pointer-events-none" />
      <Box className="absolute bottom-[15%] left-[15%] w-[250px] h-[250px] bg-[radial-gradient(circle,_rgba(59,130,246,0.06)_0%,_transparent_70%)] rounded-full pointer-events-none" />

      <Box className="w-full max-w-[440px] relative z-10 animate-fade-in-up">
        <Card className="p-8 md:p-10 shadow-xl relative overflow-hidden bg-slate-800/80 backdrop-blur-md border border-slate-700/50 rounded-2xl">
          <Box className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-cyan-500 to-blue-500" />

          <Box className="text-center mb-8">
            <Typography
              variant="h5"
              className="font-extrabold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent mb-2"
            >
              TechZone
            </Typography>
            <Typography variant="h6" className="font-bold text-slate-100 mt-3 mb-1">
              Tạo tài khoản
            </Typography>
            <Typography variant="body2" className="text-slate-400">
              Đăng ký để mua sắm linh kiện chính hãng giá tốt.
            </Typography>
          </Box>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              id="name"
              type="text"
              placeholder="Nguyễn Văn A"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
              autoFocus
              variant="outlined"
              slotProps={{
                htmlInput: { minLength: 2 },
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <User size={18} className="text-slate-400" />
                    </InputAdornment>
                  ),
                  className: "bg-slate-900/50 rounded-xl",
                },
              }}
              sx={{
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
              }}
            />

            <TextField
              fullWidth
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
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
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
              }}
            />

            <Box>
              <TextField
                fullWidth
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Tối thiểu 6 ký tự"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                slotProps={{
                  htmlInput: { minLength: 6 },
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
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
                }}
              />
              
              {password && (
                <Box className="mt-2">
                  <Box className="flex gap-1 mb-1">
                    {[1, 2, 3].map((seg) => (
                      <Box
                        key={seg}
                        className={`flex-1 h-1 rounded-sm transition-colors duration-200 ${
                          strength.level >= seg
                            ? strength.level === 1
                              ? "bg-red-500"
                              : strength.level === 2
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                            : "bg-slate-700"
                        }`}
                      />
                    ))}
                  </Box>
                  <Typography variant="caption" className="text-slate-400">
                    Độ mạnh: {strength.text}
                  </Typography>
                </Box>
              )}
            </Box>

            {error && (
              <Box className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg animate-fade-in text-sm">
                <AlertCircle size={16} />
                <span>{error}</span>
              </Box>
            )}

            {success && (
              <Box className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg animate-fade-in text-sm">
                <CheckCircle size={16} />
                <span>Tạo tài khoản thành công! Đang đăng nhập...</span>
              </Box>
            )}

            <Button
              type="submit"
              variant="contained"
              disabled={isLoading || success}
              className="mt-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-base shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:shadow-[0_0_30px_rgba(6,182,212,0.25)] hover:-translate-y-px transition-all normal-case disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <CircularProgress size={18} color="inherit" className="mr-2" />
                  Đang tạo tài khoản...
                </>
              ) : (
                <>
                  <UserPlus size={18} className="mr-2" />
                  Đăng ký
                </>
              )}
            </Button>
          </form>

          <Divider className="my-6 text-slate-500 text-xs before:border-slate-700 after:border-slate-700">
            hoặc
          </Divider>

          <Typography className="text-center text-sm text-slate-400">
            Đã có tài khoản?{" "}
            <Link href="/login" className="text-cyan-400 font-semibold hover:text-cyan-300 hover:underline transition-colors">
              Đăng nhập
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
