export const APP_NAME = 'TechZone';
export const APP_DESCRIPTION = 'Linh kiện máy tính chính hãng - CPU, GPU, RAM, SSD, Mainboard, Màn hình & Phụ kiện';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const CATEGORIES = [
  { name: 'CPU', slug: 'cpu', icon: '🔲', description: 'Bộ vi xử lý Intel & AMD' },
  { name: 'Mainboard', slug: 'mainboard', icon: '🟩', description: 'Bo mạch chủ các hãng' },
  { name: 'GPU', slug: 'gpu', icon: '🎮', description: 'Card đồ hoạ NVIDIA & AMD' },
  { name: 'RAM', slug: 'ram', icon: '💾', description: 'Bộ nhớ DDR4 & DDR5' },
  { name: 'SSD', slug: 'ssd', icon: '💿', description: 'Ổ cứng thể rắn NVMe & SATA' },
  { name: 'Phụ kiện', slug: 'phu-kien', icon: '🖱️', description: 'Chuột, bàn phím, tai nghe' },
  { name: 'Màn hình', slug: 'man-hinh', icon: '🖥️', description: 'Màn hình Gaming & Đồ hoạ' },
] as const;

export const BRANDS = {
  cpu: ['Intel', 'AMD'],
  mainboard: ['ASUS', 'MSI', 'Gigabyte', 'ASRock'],
  gpu: ['NVIDIA', 'AMD', 'ASUS', 'MSI', 'Gigabyte', 'EVGA'],
  ram: ['Kingston', 'Corsair', 'G.Skill', 'Crucial', 'ADATA'],
  ssd: ['Samsung', 'WD', 'Crucial', 'Kingston', 'Transcend', 'Kioxia'],
  'phu-kien': ['Logitech', 'Razer', 'Keychron', 'AKKO', 'HyperX', 'SteelSeries'],
  'man-hinh': ['ASUS', 'LG', 'Dell', 'Samsung', 'AOC', 'BenQ', 'ViewSonic'],
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
