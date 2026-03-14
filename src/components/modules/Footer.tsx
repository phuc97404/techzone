import Link from "next/link";
import { Container, Box, Typography } from "@mui/material";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-300 pt-16 pb-8">
      <Container maxWidth="xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            <h3 className="text-3xl font-black tracking-tight bg-gradient-to-r from-pink-500 to-indigo-500 bg-clip-text text-transparent w-max">
              TechZone
            </h3>
            <Typography variant="body1" className="text-slate-400 leading-relaxed max-w-md">
              TechZone chuyên cung cấp linh kiện máy tính, PC Gaming, thiết bị văn phòng và phụ kiện chính hãng với giá tốt nhất thị trường.
            </Typography>
            <div className="flex flex-col gap-4 mt-2">
              <div className="flex items-center gap-3 text-slate-300">
                <MapPin size={20} className="text-pink-500" />
                <span>123 Đường Điện Biên Phủ, Quận 1, TP. HCM</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <Phone size={20} className="text-indigo-400" />
                <span>Tổng đài: 1900 1234</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <Mail size={20} className="text-pink-400" />
                <span>Email: support@techzone.vn</span>
              </div>
            </div>
          </div>

          {/* Links Column */}
          <div className="flex flex-col gap-6 pl-0 lg:pl-8">
            <h4 className="text-lg font-bold text-white relative w-max pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-1 after:bg-pink-500 after:rounded-full">
              Về chúng tôi
            </h4>
            <ul className="flex flex-col gap-4">
              <li>
                <Link href="/about" className="text-slate-400 hover:text-pink-400 transition-colors">Giới thiệu TechZone</Link>
              </li>
              <li>
                <Link href="/tuyen-dung" className="text-slate-400 hover:text-pink-400 transition-colors">Tuyển dụng</Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-400 hover:text-pink-400 transition-colors">Liên hệ</Link>
              </li>
              <li>
                <Link href="/showroom" className="text-slate-400 hover:text-pink-400 transition-colors">Hệ thống Showroom</Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-6">
            <h4 className="text-lg font-bold text-white relative w-max pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-1 after:bg-indigo-500 after:rounded-full">
              Hỗ trợ khách hàng
            </h4>
            <ul className="flex flex-col gap-4">
              <li>
                <Link href="/chinh-sach-bao-hanh" className="text-slate-400 hover:text-pink-400 transition-colors">Chính sách bảo hành</Link>
              </li>
              <li>
                <Link href="/chinh-sach-doi-tra" className="text-slate-400 hover:text-pink-400 transition-colors">Chính sách đổi trả</Link>
              </li>
              <li>
                <Link href="/huong-dan-mua-hang" className="text-slate-400 hover:text-pink-400 transition-colors">Hướng dẫn mua hàng</Link>
              </li>
              <li>
                <Link href="/huong-dan-thanh-toan" className="text-slate-400 hover:text-pink-400 transition-colors">Hướng dẫn thanh toán</Link>
              </li>
            </ul>
          </div>
        </div>
      </Container>
      
      <div className="border-t border-slate-800 bg-slate-900/50 pt-8 mt-12">
        <Container maxWidth="xl">
          <p className="text-center text-slate-500 text-sm">
            © {new Date().getFullYear()} TechZone. All rights reserved.
          </p>
        </Container>
      </div>
    </footer>
  );
}
