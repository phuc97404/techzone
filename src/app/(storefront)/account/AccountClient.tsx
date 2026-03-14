"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, AlertCircle, CheckCircle } from "lucide-react";
import { Box, Card, Typography, TextField, Button, CircularProgress } from "@mui/material";

interface AccountUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  createdAt: Date;
}

export default function AccountClient({ user }: { user: AccountUser }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [formData, setFormData] = useState({
    name: user.name,
    phone: user.phone || "",
    address: user.address || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    setToast(null);

    try {
      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setToast({ type: "success", message: "Cập nhật thông tin thành công!" });
        setIsEditing(false);
        router.refresh();
      } else {
        const data = await res.json();
        setToast({ type: "error", message: data.error || "Có lỗi xảy ra" });
      }
    } catch {
      setToast({ type: "error", message: "Lỗi kết nối. Vui lòng thử lại." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      phone: user.phone || "",
      address: user.address || "",
    });
    setIsEditing(false);
    setToast(null);
  };

  return (
    <Card className="bg-slate-800/80 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-lg">
      <Box className="flex items-center justify-between mb-6 pb-4 border-b border-slate-700/50">
        <Typography variant="h6" className="font-semibold flex items-center gap-2 text-slate-100">
          <User size={20} className="text-pink-400" />
          Thông tin cá nhân
        </Typography>
        {!isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            variant="outlined"
            size="small"
            className="text-xs font-semibold py-1.5 px-4 text-pink-400 border-pink-500/30 bg-pink-500/10 hover:bg-pink-500/20 rounded-lg normal-case transition-colors"
          >
            Chỉnh sửa
          </Button>
        )}
      </Box>

      {toast && (
        <Box
          className={`flex items-center gap-2 p-3 mb-6 rounded-lg text-sm animate-fade-in ${
            toast.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
              : "bg-red-500/10 border border-red-500/20 text-red-400"
          }`}
        >
          {toast.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          <span>{toast.message}</span>
        </Box>
      )}

      {isEditing ? (
        <Box className="flex flex-col gap-5">
          <Box className="flex flex-col gap-2">
            <Typography variant="body2" className="text-sm font-medium text-slate-400">Họ và tên</Typography>
            <TextField
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nhập họ tên"
              required
              fullWidth
              size="small"
              variant="outlined"
              slotProps={{ input: { className: "bg-slate-900/50 rounded-lg text-sm text-slate-200" } }}
              sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' } }}
            />
          </Box>
          <Box className="flex flex-col gap-2">
            <Typography variant="body2" className="text-sm font-medium text-slate-400">Email</Typography>
            <TextField
              value={user.email}
              disabled
              fullWidth
              size="small"
              variant="outlined"
              slotProps={{ input: { className: "bg-slate-800 rounded-lg text-sm text-slate-500" } }}
              sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.05)' } }}
            />
          </Box>
          <Box className="flex flex-col gap-2">
            <Typography variant="body2" className="text-sm font-medium text-slate-400">Số điện thoại</Typography>
            <TextField
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Nhập số điện thoại"
              type="tel"
              fullWidth
              size="small"
              variant="outlined"
              slotProps={{ input: { className: "bg-slate-900/50 rounded-lg text-sm text-slate-200" } }}
              sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' } }}
            />
          </Box>
          <Box className="flex flex-col gap-2">
            <Typography variant="body2" className="text-sm font-medium text-slate-400">Địa chỉ</Typography>
            <TextField
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Nhập địa chỉ"
              fullWidth
              size="small"
              variant="outlined"
              slotProps={{ input: { className: "bg-slate-900/50 rounded-lg text-sm text-slate-200" } }}
              sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' } }}
            />
          </Box>
          <Box className="flex gap-3 justify-end mt-2">
            <Button
              onClick={handleCancel}
              disabled={isLoading}
              variant="outlined"
              className="py-2 px-6 rounded-lg text-slate-300 border-slate-600 hover:bg-slate-700/50 hover:border-slate-500 normal-case font-semibold text-sm"
            >
              Hủy
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading}
              variant="contained"
              className="py-2 px-6 rounded-lg bg-gradient-to-r from-pink-500 to-indigo-500 text-white hover:shadow-[0_0_15px_rgba(236,72,153,0.3)] normal-case font-semibold text-sm"
            >
              {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </Box>
        </Box>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Họ và tên</span>
            <span className="text-sm text-slate-200 font-medium">{user.name}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Email</span>
            <span className="text-sm text-slate-200 font-medium">{user.email}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Số điện thoại</span>
            <span className="text-sm text-slate-200 font-medium">{user.phone || "Chưa cập nhật"}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Địa chỉ</span>
            <span className="text-sm text-slate-200 font-medium">{user.address || "Chưa cập nhật"}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Ngày tham gia</span>
            <span className="text-sm text-slate-200 font-medium">
              {new Date(user.createdAt).toLocaleDateString("vi-VN")}
            </span>
          </div>
        </div>
      )}
    </Card>
  );
}
