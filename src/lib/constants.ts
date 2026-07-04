export const APP_NAME = 'Hupu';
export const APP_DESCRIPTION = 'Dịch vụ In 3D Custom theo yêu cầu - Máy in 3D, Filament, Mô hình, Phụ kiện & Thiết kế 3D';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const CATEGORIES = [
  { name: 'Máy in 3D', slug: 'may-in-3d', icon: '🖨️', description: 'Máy in 3D FDM & SLA các hãng' },
  { name: 'Filament & Vật liệu', slug: 'filament-vat-lieu', icon: '🧵', description: 'PLA, ABS, PETG, Resin & Vật liệu đặc biệt' },
  { name: 'Mô hình Custom', slug: 'mo-hinh-custom', icon: '🎭', description: 'Figure, Tượng, Prototype theo yêu cầu' },
  { name: 'Phụ kiện & Linh kiện', slug: 'phu-kien-linh-kien', icon: '🔧', description: 'Nozzle, Hotend, Build plate & linh kiện thay thế' },
  { name: 'Dịch vụ In 3D', slug: 'dich-vu-in-3d', icon: '⚙️', description: 'In 3D theo file, theo yêu cầu' },
  { name: 'Thiết kế 3D', slug: 'thiet-ke-3d', icon: '🎨', description: 'File STL, Modeling, Scan 3D' },
  { name: 'Combo & Set', slug: 'combo-set', icon: '📦', description: 'Bộ kit cho người mới & Combo tiết kiệm' },
] as const;

export const BRANDS = {
  'may-in-3d': ['Creality', 'Bambu Lab', 'Prusa', 'Anycubic', 'Elegoo', 'Formlabs'],
  'filament-vat-lieu': ['eSUN', 'Hatchbox', 'Sunlu', 'Polymaker', 'Prusament', 'Overture'],
  'mo-hinh-custom': ['Hupu Studio', 'Custom Order', 'Artisan 3D'],
  'phu-kien-linh-kien': ['E3D', 'Bondtech', 'Slice Engineering', 'Capricorn', 'BLTouch'],
  'dich-vu-in-3d': ['Hupu Print', 'Express 3D'],
  'thiet-ke-3d': ['Hupu Design', 'Freelance 3D'],
  'combo-set': ['Creality', 'Bambu Lab', 'Anycubic', 'Hupu Bundle'],
} as const;

export const ORDER_STATUS = {
  PENDING: { label: 'Chờ xác nhận', color: 'warning' },
  CONFIRMED: { label: 'Đã xác nhận', color: 'primary' },
  SHIPPING: { label: 'Đang giao', color: 'primary' },
  DELIVERED: { label: 'Đã giao', color: 'success' },
  CANCELLED: { label: 'Đã huỷ', color: 'error' },
} as const;

export const ITEMS_PER_PAGE = 12;

export const PRICE_RANGES = [
  { label: 'Dưới 1 triệu', min: 0, max: 1000000 },
  { label: '1 - 3 triệu', min: 1000000, max: 3000000 },
  { label: '3 - 5 triệu', min: 3000000, max: 5000000 },
  { label: '5 - 10 triệu', min: 5000000, max: 10000000 },
  { label: '10 - 20 triệu', min: 10000000, max: 20000000 },
  { label: '20 - 50 triệu', min: 20000000, max: 50000000 },
  { label: 'Trên 50 triệu', min: 50000000, max: Infinity },
] as const;
