import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// Use string literals for enum values (Prisma 7 compatibility)

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  console.log('🌱 Seeding database...');

  // ============================================
  // 1. Create Admin User
  // ============================================
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@techzone.vn' },
    update: {},
    create: {
      email: 'admin@techzone.vn',
      password: hashedPassword,
      name: 'Admin TechZone',
      role: 'ADMIN',
      phone: '0901234567',
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create a test customer
  const customerPassword = await bcrypt.hash('customer123', 10);
  await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      password: customerPassword,
      name: 'Nguyễn Văn A',
      role: 'CUSTOMER',
      phone: '0912345678',
      address: '123 Nguyễn Huệ, Q.1, TP.HCM',
    },
  });
  console.log('✅ Test customer created');

  // ============================================
  // 2. Create Categories
  // ============================================
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'cpu' },
      update: {},
      create: { name: 'CPU - Bộ vi xử lý', slug: 'cpu', description: 'Bộ vi xử lý Intel & AMD', image: '/images/categories/cpu.webp' },
    }),
    prisma.category.upsert({
      where: { slug: 'mainboard' },
      update: {},
      create: { name: 'Mainboard - Bo mạch chủ', slug: 'mainboard', description: 'Bo mạch chủ ASUS, MSI, Gigabyte', image: '/images/categories/mainboard.webp' },
    }),
    prisma.category.upsert({
      where: { slug: 'gpu' },
      update: {},
      create: { name: 'GPU - Card đồ họa', slug: 'gpu', description: 'Card đồ họa NVIDIA & AMD', image: '/images/categories/gpu.webp' },
    }),
    prisma.category.upsert({
      where: { slug: 'ram' },
      update: {},
      create: { name: 'RAM - Bộ nhớ', slug: 'ram', description: 'RAM DDR4 & DDR5 cho PC & Laptop', image: '/images/categories/ram.webp' },
    }),
    prisma.category.upsert({
      where: { slug: 'ssd' },
      update: {},
      create: { name: 'SSD - Ổ cứng', slug: 'ssd', description: 'Ổ cứng SSD NVMe & SATA', image: '/images/categories/ssd.webp' },
    }),
    prisma.category.upsert({
      where: { slug: 'phu-kien' },
      update: {},
      create: { name: 'Phụ kiện', slug: 'phu-kien', description: 'Chuột, bàn phím, tai nghe gaming', image: '/images/categories/accessories.webp' },
    }),
    prisma.category.upsert({
      where: { slug: 'man-hinh' },
      update: {},
      create: { name: 'Màn hình', slug: 'man-hinh', description: 'Màn hình Gaming & Đồ họa', image: '/images/categories/monitor.webp' },
    }),
  ]);

  const [catCPU, catMainboard, catGPU, catRAM, catSSD, catAccessory, catMonitor] = categories;
  console.log('✅ 7 categories created');

  // ============================================
  // 3. Create Brands
  // ============================================
  const brands = await Promise.all([
    prisma.brand.upsert({ where: { slug: 'intel' }, update: {}, create: { name: 'Intel', slug: 'intel' } }),
    prisma.brand.upsert({ where: { slug: 'amd' }, update: {}, create: { name: 'AMD', slug: 'amd' } }),
    prisma.brand.upsert({ where: { slug: 'asus' }, update: {}, create: { name: 'ASUS', slug: 'asus' } }),
    prisma.brand.upsert({ where: { slug: 'msi' }, update: {}, create: { name: 'MSI', slug: 'msi' } }),
    prisma.brand.upsert({ where: { slug: 'gigabyte' }, update: {}, create: { name: 'Gigabyte', slug: 'gigabyte' } }),
    prisma.brand.upsert({ where: { slug: 'nvidia' }, update: {}, create: { name: 'NVIDIA', slug: 'nvidia' } }),
    prisma.brand.upsert({ where: { slug: 'kingston' }, update: {}, create: { name: 'Kingston', slug: 'kingston' } }),
    prisma.brand.upsert({ where: { slug: 'corsair' }, update: {}, create: { name: 'Corsair', slug: 'corsair' } }),
    prisma.brand.upsert({ where: { slug: 'gskill' }, update: {}, create: { name: 'G.Skill', slug: 'gskill' } }),
    prisma.brand.upsert({ where: { slug: 'samsung' }, update: {}, create: { name: 'Samsung', slug: 'samsung' } }),
    prisma.brand.upsert({ where: { slug: 'crucial' }, update: {}, create: { name: 'Crucial', slug: 'crucial' } }),
    prisma.brand.upsert({ where: { slug: 'wd' }, update: {}, create: { name: 'Western Digital', slug: 'wd' } }),
    prisma.brand.upsert({ where: { slug: 'logitech' }, update: {}, create: { name: 'Logitech', slug: 'logitech' } }),
    prisma.brand.upsert({ where: { slug: 'razer' }, update: {}, create: { name: 'Razer', slug: 'razer' } }),
    prisma.brand.upsert({ where: { slug: 'keychron' }, update: {}, create: { name: 'Keychron', slug: 'keychron' } }),
    prisma.brand.upsert({ where: { slug: 'lg' }, update: {}, create: { name: 'LG', slug: 'lg' } }),
    prisma.brand.upsert({ where: { slug: 'dell' }, update: {}, create: { name: 'Dell', slug: 'dell' } }),
    prisma.brand.upsert({ where: { slug: 'asrock' }, update: {}, create: { name: 'ASRock', slug: 'asrock' } }),
  ]);

  const [bIntel, bAMD, bASUS, bMSI, bGigabyte, bNVIDIA, bKingston, bCorsair, bGSkill, bSamsung, bCrucial, bWD, bLogitech, bRazer, bKeychron, bLG, bDell, bASRock] = brands;
  console.log('✅ 18 brands created');

  // ============================================
  // 4. Create Products
  // ============================================

  // --- CPU Products ---
  await prisma.product.createMany({
    data: [
      {
        name: 'Intel Core i9-14900K',
        slug: 'intel-core-i9-14900k',
        description: 'Bộ vi xử lý Intel Core i9-14900K thế hệ 14 Raptor Lake Refresh, 24 nhân 32 luồng, xung nhịp lên đến 6.0 GHz. Hiệu năng đa nhiệm mạnh mẽ, lý tưởng cho gaming và sáng tạo nội dung.',
        price: 14490000,
        salePrice: 13290000,
        images: ['/images/products/cpu/i9-14900k-1.webp', '/images/products/cpu/i9-14900k-2.webp'],
        specs: JSON.stringify({ 'Socket': 'LGA 1700', 'Cores': '24 (8P+16E)', 'Threads': '32', 'Base Clock': '3.2 GHz', 'Boost Clock': '6.0 GHz', 'Cache': '36MB L3', 'TDP': '125W / 253W MTP', 'iGPU': 'Intel UHD 770' }),
        stock: 25,
        featured: true,
        status: 'ACTIVE',
        rating: 4.8,
        reviewCount: 45,
        categoryId: catCPU.id,
        brandId: bIntel.id,
      },
      {
        name: 'Intel Core i7-14700K',
        slug: 'intel-core-i7-14700k',
        description: 'Intel Core i7-14700K, 20 nhân 28 luồng, xung nhịp turbo lên đến 5.6 GHz. Lựa chọn tối ưu cho gaming và làm việc chuyên nghiệp.',
        price: 9990000,
        salePrice: 9290000,
        images: ['/images/products/cpu/i7-14700k-1.webp'],
        specs: JSON.stringify({ 'Socket': 'LGA 1700', 'Cores': '20 (8P+12E)', 'Threads': '28', 'Base Clock': '3.4 GHz', 'Boost Clock': '5.6 GHz', 'Cache': '33MB L3', 'TDP': '125W / 253W MTP', 'iGPU': 'Intel UHD 770' }),
        stock: 38,
        featured: true,
        status: 'ACTIVE',
        rating: 4.7,
        reviewCount: 62,
        categoryId: catCPU.id,
        brandId: bIntel.id,
      },
      {
        name: 'Intel Core i5-14400F',
        slug: 'intel-core-i5-14400f',
        description: 'Intel Core i5-14400F, 10 nhân 16 luồng, không iGPU. Lựa chọn giá trị tốt nhất cho gaming phổ thông.',
        price: 4690000,
        salePrice: 4290000,
        images: ['/images/products/cpu/i5-14400f-1.webp'],
        specs: JSON.stringify({ 'Socket': 'LGA 1700', 'Cores': '10 (6P+4E)', 'Threads': '16', 'Base Clock': '2.5 GHz', 'Boost Clock': '4.7 GHz', 'Cache': '20MB L3', 'TDP': '65W / 148W MTP', 'iGPU': 'Không' }),
        stock: 55,
        featured: false,
        status: 'ACTIVE',
        rating: 4.6,
        reviewCount: 89,
        categoryId: catCPU.id,
        brandId: bIntel.id,
      },
      {
        name: 'AMD Ryzen 9 7950X',
        slug: 'amd-ryzen-9-7950x',
        description: 'AMD Ryzen 9 7950X, 16 nhân 32 luồng, kiến trúc Zen 4, xung nhịp boost 5.7 GHz. Vua hiệu năng đa nhiệm.',
        price: 13990000,
        salePrice: 12490000,
        images: ['/images/products/cpu/r9-7950x-1.webp'],
        specs: JSON.stringify({ 'Socket': 'AM5', 'Cores': '16', 'Threads': '32', 'Base Clock': '4.5 GHz', 'Boost Clock': '5.7 GHz', 'Cache': '64MB L3', 'TDP': '170W', 'iGPU': 'Radeon Graphics (2CU)' }),
        stock: 18,
        featured: true,
        status: 'ACTIVE',
        rating: 4.9,
        reviewCount: 37,
        categoryId: catCPU.id,
        brandId: bAMD.id,
      },
      {
        name: 'AMD Ryzen 7 7800X3D',
        slug: 'amd-ryzen-7-7800x3d',
        description: 'AMD Ryzen 7 7800X3D với 3D V-Cache 96MB, 8 nhân 16 luồng. CPU gaming tốt nhất hiện tại.',
        price: 9490000,
        salePrice: 8690000,
        images: ['/images/products/cpu/r7-7800x3d-1.webp'],
        specs: JSON.stringify({ 'Socket': 'AM5', 'Cores': '8', 'Threads': '16', 'Base Clock': '4.2 GHz', 'Boost Clock': '5.0 GHz', 'Cache': '96MB L3 (3D V-Cache)', 'TDP': '120W', 'iGPU': 'Radeon Graphics (2CU)' }),
        stock: 30,
        featured: true,
        status: 'ACTIVE',
        rating: 4.9,
        reviewCount: 128,
        categoryId: catCPU.id,
        brandId: bAMD.id,
      },
    ],
    skipDuplicates: true,
  });
  console.log('✅ 5 CPU products created');

  // --- Mainboard Products ---
  await prisma.product.createMany({
    data: [
      {
        name: 'ASUS ROG STRIX Z790-E Gaming WiFi',
        slug: 'asus-rog-strix-z790-e-gaming-wifi',
        description: 'Bo mạch chủ ASUS ROG STRIX Z790-E Gaming WiFi, chipset Intel Z790, DDR5, WiFi 6E, 2.5G LAN. Thiết kế gaming cao cấp.',
        price: 9990000,
        salePrice: 8990000,
        images: ['/images/products/mainboard/z790-e-1.webp'],
        specs: JSON.stringify({ 'Socket': 'LGA 1700', 'Chipset': 'Intel Z790', 'RAM': '4x DDR5 7800MHz+', 'Form Factor': 'ATX', 'M.2 Slots': '4', 'WiFi': 'WiFi 6E', 'LAN': '2.5G Intel', 'USB': 'USB 3.2 Gen 2x2 Type-C' }),
        stock: 15,
        featured: true,
        status: 'ACTIVE',
        rating: 4.7,
        reviewCount: 23,
        categoryId: catMainboard.id,
        brandId: bASUS.id,
      },
      {
        name: 'MSI MAG B760 Tomahawk WiFi',
        slug: 'msi-mag-b760-tomahawk-wifi',
        description: 'Bo mạch chủ MSI MAG B760 Tomahawk WiFi, chipset Intel B760, DDR5, WiFi 6E. Phân khúc tầm trung đáng mua nhất.',
        price: 5490000,
        salePrice: 4990000,
        images: ['/images/products/mainboard/b760-tomahawk-1.webp'],
        specs: JSON.stringify({ 'Socket': 'LGA 1700', 'Chipset': 'Intel B760', 'RAM': '4x DDR5 7200MHz+', 'Form Factor': 'ATX', 'M.2 Slots': '2', 'WiFi': 'WiFi 6E', 'LAN': '2.5G Realtek', 'USB': 'USB 3.2 Gen 2 Type-C' }),
        stock: 22,
        featured: false,
        status: 'ACTIVE',
        rating: 4.5,
        reviewCount: 41,
        categoryId: catMainboard.id,
        brandId: bMSI.id,
      },
      {
        name: 'Gigabyte B650 AORUS Elite AX V2',
        slug: 'gigabyte-b650-aorus-elite-ax-v2',
        description: 'Bo mạch chủ Gigabyte B650 AORUS Elite AX V2, chipset AMD B650, DDR5, WiFi 6E. Giá trị tốt cho nền tảng AM5.',
        price: 4990000,
        salePrice: 4490000,
        images: ['/images/products/mainboard/b650-aorus-1.webp'],
        specs: JSON.stringify({ 'Socket': 'AM5', 'Chipset': 'AMD B650', 'RAM': '4x DDR5 7600MHz+', 'Form Factor': 'ATX', 'M.2 Slots': '2', 'WiFi': 'WiFi 6E', 'LAN': '2.5G Realtek', 'USB': 'USB 3.2 Gen 1 Type-C' }),
        stock: 19,
        featured: false,
        status: 'ACTIVE',
        rating: 4.4,
        reviewCount: 35,
        categoryId: catMainboard.id,
        brandId: bGigabyte.id,
      },
    ],
    skipDuplicates: true,
  });
  console.log('✅ 3 Mainboard products created');

  // --- GPU Products ---
  await prisma.product.createMany({
    data: [
      {
        name: 'ASUS ROG STRIX GeForce RTX 4090 OC',
        slug: 'asus-rog-strix-rtx-4090-oc',
        description: 'Card đồ họa ASUS ROG STRIX RTX 4090 OC 24GB GDDR6X, quái vật hiệu năng gaming 4K. Triple-fan cooling, RGB Aura Sync.',
        price: 49990000,
        salePrice: 46990000,
        images: ['/images/products/gpu/rtx4090-strix-1.webp'],
        specs: JSON.stringify({ 'GPU': 'NVIDIA GeForce RTX 4090', 'VRAM': '24GB GDDR6X', 'CUDA Cores': '16384', 'Boost Clock': '2610 MHz (OC)', 'Bus': '384-bit', 'TDP': '450W', 'Outputs': '2x HDMI 2.1, 3x DP 1.4a', 'Length': '358mm' }),
        stock: 8,
        featured: true,
        status: 'ACTIVE',
        rating: 4.9,
        reviewCount: 15,
        categoryId: catGPU.id,
        brandId: bASUS.id,
      },
      {
        name: 'MSI GeForce RTX 4070 Ti SUPER Gaming X Slim',
        slug: 'msi-rtx-4070-ti-super-gaming-x-slim',
        description: 'MSI RTX 4070 Ti SUPER 16GB GDDR6X, thiết kế mỏng, quạt TORX 5.0. Lựa chọn tối ưu cho gaming 1440p.',
        price: 21990000,
        salePrice: 19990000,
        images: ['/images/products/gpu/rtx4070ti-super-msi-1.webp'],
        specs: JSON.stringify({ 'GPU': 'NVIDIA GeForce RTX 4070 Ti SUPER', 'VRAM': '16GB GDDR6X', 'CUDA Cores': '8448', 'Boost Clock': '2640 MHz', 'Bus': '256-bit', 'TDP': '285W', 'Outputs': '1x HDMI 2.1, 3x DP 1.4a', 'Length': '307mm' }),
        stock: 14,
        featured: true,
        status: 'ACTIVE',
        rating: 4.7,
        reviewCount: 28,
        categoryId: catGPU.id,
        brandId: bMSI.id,
      },
      {
        name: 'Gigabyte GeForce RTX 4060 Eagle OC 8GB',
        slug: 'gigabyte-rtx-4060-eagle-oc-8gb',
        description: 'Gigabyte RTX 4060 Eagle OC 8GB GDDR6, DLSS 3.0, hiệu năng gaming 1080p tuyệt vời với mức giá phải chăng.',
        price: 8490000,
        salePrice: 7690000,
        images: ['/images/products/gpu/rtx4060-eagle-1.webp'],
        specs: JSON.stringify({ 'GPU': 'NVIDIA GeForce RTX 4060', 'VRAM': '8GB GDDR6', 'CUDA Cores': '3072', 'Boost Clock': '2475 MHz', 'Bus': '128-bit', 'TDP': '115W', 'Outputs': '2x HDMI 2.1, 2x DP 1.4a', 'Length': '261mm' }),
        stock: 32,
        featured: false,
        status: 'ACTIVE',
        rating: 4.5,
        reviewCount: 56,
        categoryId: catGPU.id,
        brandId: bGigabyte.id,
      },
      {
        name: 'MSI GeForce RTX 5070 Gaming X',
        slug: 'msi-rtx-5070-gaming-x',
        description: 'MSI RTX 5070 12GB GDDR7, kiến trúc Blackwell mới nhất. Hiệu năng ngang RTX 4090 ở giá tầm trung.',
        price: 16990000,
        images: ['/images/products/gpu/rtx5070-msi-1.webp'],
        specs: JSON.stringify({ 'GPU': 'NVIDIA GeForce RTX 5070', 'VRAM': '12GB GDDR7', 'CUDA Cores': '6144', 'Boost Clock': '2512 MHz', 'Bus': '192-bit', 'TDP': '250W', 'Outputs': '1x HDMI 2.1, 3x DP 2.1', 'Length': '314mm' }),
        stock: 10,
        featured: true,
        status: 'ACTIVE',
        rating: 4.8,
        reviewCount: 12,
        categoryId: catGPU.id,
        brandId: bMSI.id,
      },
    ],
    skipDuplicates: true,
  });
  console.log('✅ 4 GPU products created');

  // --- RAM Products ---
  await prisma.product.createMany({
    data: [
      {
        name: 'Kingston Fury Beast 16GB DDR5 6000MHz',
        slug: 'kingston-fury-beast-16gb-ddr5-6000',
        description: 'RAM Kingston Fury Beast 16GB (1x16GB) DDR5 6000MHz CL36, Intel XMP 3.0, AMD EXPO. Tản nhiệt nhôm chắc chắn.',
        price: 1290000,
        salePrice: 1090000,
        images: ['/images/products/ram/fury-beast-ddr5-1.webp'],
        specs: JSON.stringify({ 'Dung lượng': '16GB (1x16GB)', 'Loại': 'DDR5', 'Tốc độ': '6000MHz', 'CAS Latency': 'CL36', 'Voltage': '1.35V', 'XMP/EXPO': 'Intel XMP 3.0, AMD EXPO', 'Tản nhiệt': 'Aluminum Heat Spreader' }),
        stock: 80,
        featured: true,
        status: 'ACTIVE',
        rating: 4.6,
        reviewCount: 72,
        categoryId: catRAM.id,
        brandId: bKingston.id,
      },
      {
        name: 'Corsair Vengeance RGB 32GB DDR5 6000MHz',
        slug: 'corsair-vengeance-rgb-32gb-ddr5-6000',
        description: 'RAM Corsair Vengeance RGB 32GB (2x16GB) DDR5 6000MHz CL36, đèn LED RGB 10 zone, Intel XMP 3.0, AMD EXPO.',
        price: 2890000,
        salePrice: 2590000,
        images: ['/images/products/ram/vengeance-rgb-ddr5-1.webp'],
        specs: JSON.stringify({ 'Dung lượng': '32GB (2x16GB)', 'Loại': 'DDR5', 'Tốc độ': '6000MHz', 'CAS Latency': 'CL36', 'Voltage': '1.35V', 'XMP/EXPO': 'Intel XMP 3.0, AMD EXPO', 'RGB': 'Corsair iCUE RGB (10 zone)' }),
        stock: 45,
        featured: true,
        status: 'ACTIVE',
        rating: 4.8,
        reviewCount: 53,
        categoryId: catRAM.id,
        brandId: bCorsair.id,
      },
      {
        name: 'G.Skill Trident Z5 Neo RGB 64GB DDR5 6000MHz',
        slug: 'gskill-trident-z5-neo-rgb-64gb-ddr5-6000',
        description: 'RAM G.Skill Trident Z5 Neo RGB 64GB (2x32GB) DDR5 6000MHz CL30, tối ưu cho AMD AM5. Hiệu năng workstation.',
        price: 5490000,
        salePrice: 4990000,
        images: ['/images/products/ram/trident-z5-neo-1.webp'],
        specs: JSON.stringify({ 'Dung lượng': '64GB (2x32GB)', 'Loại': 'DDR5', 'Tốc độ': '6000MHz', 'CAS Latency': 'CL30', 'Voltage': '1.35V', 'XMP/EXPO': 'AMD EXPO, Intel XMP 3.0', 'RGB': 'RGB LED (Multi-zone)' }),
        stock: 20,
        featured: false,
        status: 'ACTIVE',
        rating: 4.9,
        reviewCount: 18,
        categoryId: catRAM.id,
        brandId: bGSkill.id,
      },
      {
        name: 'Kingston Fury Beast 8GB DDR4 3200MHz',
        slug: 'kingston-fury-beast-8gb-ddr4-3200',
        description: 'RAM Kingston Fury Beast 8GB DDR4 3200MHz CL16. Lựa chọn kinh tế cho nâng cấp hệ thống DDR4.',
        price: 590000,
        salePrice: 490000,
        images: ['/images/products/ram/fury-beast-ddr4-1.webp'],
        specs: JSON.stringify({ 'Dung lượng': '8GB (1x8GB)', 'Loại': 'DDR4', 'Tốc độ': '3200MHz', 'CAS Latency': 'CL16', 'Voltage': '1.35V', 'XMP': 'Intel XMP 2.0', 'Tản nhiệt': 'Aluminum Heat Spreader' }),
        stock: 120,
        featured: false,
        status: 'ACTIVE',
        rating: 4.5,
        reviewCount: 156,
        categoryId: catRAM.id,
        brandId: bKingston.id,
      },
      {
        name: 'Corsair Vengeance LPX 16GB DDR4 3200MHz',
        slug: 'corsair-vengeance-lpx-16gb-ddr4-3200',
        description: 'RAM Corsair Vengeance LPX 16GB (1x16GB) DDR4 3200MHz CL16. Profile thấp, tương thích tốt với mọi tản nhiệt CPU.',
        price: 890000,
        images: ['/images/products/ram/vengeance-lpx-ddr4-1.webp'],
        specs: JSON.stringify({ 'Dung lượng': '16GB (1x16GB)', 'Loại': 'DDR4', 'Tốc độ': '3200MHz', 'CAS Latency': 'CL16', 'Voltage': '1.2V', 'XMP': 'Intel XMP 2.0', 'Form Factor': 'Low Profile' }),
        stock: 95,
        featured: false,
        status: 'ACTIVE',
        rating: 4.6,
        reviewCount: 201,
        categoryId: catRAM.id,
        brandId: bCorsair.id,
      },
    ],
    skipDuplicates: true,
  });
  console.log('✅ 5 RAM products created');

  // --- SSD Products ---
  await prisma.product.createMany({
    data: [
      {
        name: 'Samsung 990 Pro 1TB PCIe Gen4 NVMe',
        slug: 'samsung-990-pro-1tb-pcie-gen4-nvme',
        description: 'SSD Samsung 990 Pro 1TB M.2 PCIe Gen 4.0 x4 NVMe, đọc 7450MB/s, ghi 6900MB/s. SSD Gen4 nhanh nhất của Samsung.',
        price: 2990000,
        salePrice: 2590000,
        images: ['/images/products/ssd/990-pro-1tb-1.webp'],
        specs: JSON.stringify({ 'Dung lượng': '1TB', 'Form Factor': 'M.2 2280', 'Interface': 'PCIe Gen 4.0 x4 NVMe', 'Đọc tuần tự': '7,450 MB/s', 'Ghi tuần tự': '6,900 MB/s', 'NAND': 'Samsung V-NAND TLC', 'TBW': '600 TBW', 'MTBF': '1.5M hours' }),
        stock: 42,
        featured: true,
        status: 'ACTIVE',
        rating: 4.8,
        reviewCount: 87,
        categoryId: catSSD.id,
        brandId: bSamsung.id,
      },
      {
        name: 'Crucial P310 1TB M.2 PCIe Gen4 NVMe',
        slug: 'crucial-p310-1tb-pcie-gen4-nvme',
        description: 'SSD Crucial P310 1TB, PCIe Gen4 NVMe, đọc 7100MB/s. Giá trị tốt nhất phân khúc SSD tầm trung.',
        price: 1890000,
        salePrice: 1590000,
        images: ['/images/products/ssd/crucial-p310-1tb-1.webp'],
        specs: JSON.stringify({ 'Dung lượng': '1TB', 'Form Factor': 'M.2 2280', 'Interface': 'PCIe Gen 4.0 x4 NVMe', 'Đọc tuần tự': '7,100 MB/s', 'Ghi tuần tự': '6,500 MB/s', 'NAND': 'Micron 3D NAND', 'TBW': '440 TBW', 'Bảo hành': '5 năm' }),
        stock: 65,
        featured: false,
        status: 'ACTIVE',
        rating: 4.5,
        reviewCount: 43,
        categoryId: catSSD.id,
        brandId: bCrucial.id,
      },
      {
        name: 'WD Black SN7100 1TB PCIe Gen4 NVMe',
        slug: 'wd-black-sn7100-1tb-pcie-gen4-nvme',
        description: 'SSD WD Black SN7100 1TB, PCIe Gen4 NVMe, đọc 7250MB/s. Dòng SSD gaming nổi tiếng của Western Digital.',
        price: 2490000,
        salePrice: 2190000,
        images: ['/images/products/ssd/wd-sn7100-1tb-1.webp'],
        specs: JSON.stringify({ 'Dung lượng': '1TB', 'Form Factor': 'M.2 2280', 'Interface': 'PCIe Gen 4.0 x4 NVMe', 'Đọc tuần tự': '7,250 MB/s', 'Ghi tuần tự': '6,900 MB/s', 'NAND': 'WD 3D NAND TLC', 'TBW': '600 TBW', 'Dashboard': 'WD Dashboard' }),
        stock: 35,
        featured: true,
        status: 'ACTIVE',
        rating: 4.7,
        reviewCount: 31,
        categoryId: catSSD.id,
        brandId: bWD.id,
      },
      {
        name: 'Samsung 990 Pro 2TB PCIe Gen4 NVMe',
        slug: 'samsung-990-pro-2tb-pcie-gen4-nvme',
        description: 'SSD Samsung 990 Pro 2TB M.2 PCIe Gen 4.0 x4 NVMe. Dung lượng lớn cho game thủ và content creator.',
        price: 4990000,
        salePrice: 4390000,
        images: ['/images/products/ssd/990-pro-2tb-1.webp'],
        specs: JSON.stringify({ 'Dung lượng': '2TB', 'Form Factor': 'M.2 2280', 'Interface': 'PCIe Gen 4.0 x4 NVMe', 'Đọc tuần tự': '7,450 MB/s', 'Ghi tuần tự': '6,900 MB/s', 'NAND': 'Samsung V-NAND TLC', 'TBW': '1,200 TBW', 'Encryption': 'AES 256-bit' }),
        stock: 18,
        featured: false,
        status: 'ACTIVE',
        rating: 4.9,
        reviewCount: 25,
        categoryId: catSSD.id,
        brandId: bSamsung.id,
      },
      {
        name: 'Crucial P310 500GB M.2 PCIe Gen4 NVMe',
        slug: 'crucial-p310-500gb-pcie-gen4-nvme',
        description: 'SSD Crucial P310 500GB, PCIe Gen4, giá rẻ nhất cho ổ boot NVMe tốc độ cao.',
        price: 990000,
        salePrice: 790000,
        images: ['/images/products/ssd/crucial-p310-500gb-1.webp'],
        specs: JSON.stringify({ 'Dung lượng': '500GB', 'Form Factor': 'M.2 2280', 'Interface': 'PCIe Gen 4.0 x4 NVMe', 'Đọc tuần tự': '7,100 MB/s', 'Ghi tuần tự': '2,700 MB/s', 'NAND': 'Micron 3D NAND', 'TBW': '220 TBW', 'Bảo hành': '5 năm' }),
        stock: 78,
        featured: false,
        status: 'ACTIVE',
        rating: 4.3,
        reviewCount: 67,
        categoryId: catSSD.id,
        brandId: bCrucial.id,
      },
    ],
    skipDuplicates: true,
  });
  console.log('✅ 5 SSD products created');

  // --- Phụ kiện Products ---
  await prisma.product.createMany({
    data: [
      {
        name: 'Logitech G Pro X Superlight 2',
        slug: 'logitech-g-pro-x-superlight-2',
        description: 'Chuột gaming không dây Logitech G Pro X Superlight 2, cảm biến HERO 2, 60g siêu nhẹ, pin 95 giờ.',
        price: 3490000,
        salePrice: 2990000,
        images: ['/images/products/accessories/gpro-superlight2-1.webp'],
        specs: JSON.stringify({ 'Cảm biến': 'HERO 2 (32K DPI)', 'Kết nối': 'Wireless LIGHTSPEED', 'Pin': '95 giờ', 'Trọng lượng': '60g', 'Switch': 'LIGHTFORCE Hybrid', 'Polling Rate': '2000Hz (4K optional)', 'Số nút': '5' }),
        stock: 40,
        featured: true,
        status: 'ACTIVE',
        rating: 4.8,
        reviewCount: 96,
        categoryId: catAccessory.id,
        brandId: bLogitech.id,
      },
      {
        name: 'Razer DeathAdder V3 Pro',
        slug: 'razer-deathadder-v3-pro',
        description: 'Chuột gaming không dây Razer DeathAdder V3 Pro, cảm biến Focus Pro 30K, 63g, thiết kế ergonomic huyền thoại.',
        price: 3290000,
        salePrice: 2790000,
        images: ['/images/products/accessories/deathadder-v3-pro-1.webp'],
        specs: JSON.stringify({ 'Cảm biến': 'Focus Pro 30K', 'Kết nối': 'HyperSpeed Wireless', 'Pin': '90 giờ', 'Trọng lượng': '63g', 'Switch': 'Razer Gen3 Optical', 'Polling Rate': '4000Hz', 'Số nút': '5' }),
        stock: 28,
        featured: false,
        status: 'ACTIVE',
        rating: 4.7,
        reviewCount: 64,
        categoryId: catAccessory.id,
        brandId: bRazer.id,
      },
      {
        name: 'Keychron Q1 Max QMK/VIA Wireless',
        slug: 'keychron-q1-max-qmk-via-wireless',
        description: 'Bàn phím cơ Keychron Q1 Max, 75% layout, gasket mount, QMK/VIA, kết nối 3 chế độ. Trải nghiệm gõ cao cấp.',
        price: 4990000,
        salePrice: 4490000,
        images: ['/images/products/accessories/keychron-q1-max-1.webp'],
        specs: JSON.stringify({ 'Layout': '75% (82 phím)', 'Switch': 'Gateron Jupiter Brown', 'Kết nối': 'Bluetooth / 2.4GHz / USB-C', 'Mount': 'Gasket Mount', 'Keycap': 'Double-shot PBT', 'Pin': '4000mAh', 'Firmware': 'QMK/VIA' }),
        stock: 15,
        featured: true,
        status: 'ACTIVE',
        rating: 4.9,
        reviewCount: 42,
        categoryId: catAccessory.id,
        brandId: bKeychron.id,
      },
      {
        name: 'Razer BlackShark V2 Pro (2023)',
        slug: 'razer-blackshark-v2-pro-2023',
        description: 'Tai nghe gaming không dây Razer BlackShark V2 Pro, driver TriForce Titanium 50mm, mic tháo rời, pin 70 giờ.',
        price: 4290000,
        salePrice: 3690000,
        images: ['/images/products/accessories/blackshark-v2-pro-1.webp'],
        specs: JSON.stringify({ 'Driver': '50mm TriForce Titanium', 'Kết nối': 'HyperSpeed Wireless / 3.5mm', 'Pin': '70 giờ', 'Mic': 'Detachable HyperClear Super Wideband', 'Trọng lượng': '320g', 'Frequency': '12Hz - 28kHz', 'THX Spatial Audio': 'Có' }),
        stock: 22,
        featured: false,
        status: 'ACTIVE',
        rating: 4.6,
        reviewCount: 38,
        categoryId: catAccessory.id,
        brandId: bRazer.id,
      },
    ],
    skipDuplicates: true,
  });
  console.log('✅ 4 Accessory products created');

  // --- Màn hình Products ---
  await prisma.product.createMany({
    data: [
      {
        name: 'LG 27GP850-B UltraGear 27" QHD 165Hz',
        slug: 'lg-27gp850-b-ultragear-27-qhd-165hz',
        description: 'Màn hình LG UltraGear 27" QHD 165Hz (OC 180Hz), Nano IPS 1ms, DCI-P3 98%, NVIDIA G-Sync Compatible.',
        price: 8990000,
        salePrice: 7990000,
        images: ['/images/products/monitor/lg-27gp850-1.webp'],
        specs: JSON.stringify({ 'Kích thước': '27 inch', 'Độ phân giải': '2560x1440 (QHD)', 'Tấm nền': 'Nano IPS', 'Tần số quét': '165Hz (OC 180Hz)', 'Thời gian phản hồi': '1ms GtG', 'Màu sắc': 'DCI-P3 98%', 'HDR': 'VESA DisplayHDR 400', 'Sync': 'NVIDIA G-Sync Compatible, AMD FreeSync Premium' }),
        stock: 16,
        featured: true,
        status: 'ACTIVE',
        rating: 4.7,
        reviewCount: 45,
        categoryId: catMonitor.id,
        brandId: bLG.id,
      },
      {
        name: 'Dell S2722DGM 27" QHD 165Hz Curved',
        slug: 'dell-s2722dgm-27-qhd-165hz-curved',
        description: 'Màn hình Dell S2722DGM 27" QHD 165Hz Curved VA, 1ms MPRT. Màn hình cong gaming giá tốt.',
        price: 6490000,
        salePrice: 5490000,
        images: ['/images/products/monitor/dell-s2722dgm-1.webp'],
        specs: JSON.stringify({ 'Kích thước': '27 inch', 'Độ phân giải': '2560x1440 (QHD)', 'Tấm nền': 'VA Curved (1500R)', 'Tần số quét': '165Hz', 'Thời gian phản hồi': '1ms MPRT / 2ms GtG', 'Màu sắc': 'sRGB 99%', 'HDR': 'Không', 'Sync': 'AMD FreeSync Premium' }),
        stock: 20,
        featured: false,
        status: 'ACTIVE',
        rating: 4.5,
        reviewCount: 67,
        categoryId: catMonitor.id,
        brandId: bDell.id,
      },
      {
        name: 'ASUS ROG Swift PG27AQN 27" QHD 360Hz',
        slug: 'asus-rog-swift-pg27aqn-27-qhd-360hz',
        description: 'ASUS ROG Swift PG27AQN, 27" QHD 360Hz, tấm nền IPS, NVIDIA G-Sync. Tần số quét cao nhất cho esport.',
        price: 22990000,
        images: ['/images/products/monitor/rog-pg27aqn-1.webp'],
        specs: JSON.stringify({ 'Kích thước': '27 inch', 'Độ phân giải': '2560x1440 (QHD)', 'Tấm nền': 'IPS', 'Tần số quét': '360Hz', 'Thời gian phản hồi': '1ms GtG', 'Màu sắc': 'DCI-P3 95%', 'HDR': 'VESA DisplayHDR 600', 'Sync': 'NVIDIA G-Sync' }),
        stock: 5,
        featured: true,
        status: 'ACTIVE',
        rating: 4.9,
        reviewCount: 8,
        categoryId: catMonitor.id,
        brandId: bASUS.id,
      },
      {
        name: 'Samsung Odyssey G5 27" QHD 165Hz',
        slug: 'samsung-odyssey-g5-27-qhd-165hz',
        description: 'Samsung Odyssey G5 27" QHD 165Hz Curved VA. Màn hình gaming curved giá tốt nhất phân khúc.',
        price: 5490000,
        salePrice: 4690000,
        images: ['/images/products/monitor/samsung-g5-27-1.webp'],
        specs: JSON.stringify({ 'Kích thước': '27 inch', 'Độ phân giải': '2560x1440 (QHD)', 'Tấm nền': 'VA Curved (1000R)', 'Tần số quét': '165Hz', 'Thời gian phản hồi': '1ms MPRT', 'Màu sắc': 'sRGB 125%', 'HDR': 'HDR10', 'Sync': 'AMD FreeSync Premium' }),
        stock: 25,
        featured: false,
        status: 'ACTIVE',
        rating: 4.4,
        reviewCount: 78,
        categoryId: catMonitor.id,
        brandId: bSamsung.id,
      },
    ],
    skipDuplicates: true,
  });
  console.log('✅ 4 Monitor products created');

  // ============================================
  // 5. Create Promotions
  // ============================================
  await prisma.promotion.createMany({
    data: [
      {
        name: 'Khai trương TechZone',
        code: 'WELCOME10',
        discountType: 'PERCENTAGE',
        discountValue: 10,
        minOrderValue: 1000000,
        maxDiscount: 500000,
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-12-31'),
        active: true,
      },
      {
        name: 'Giảm 200K cho đơn từ 5 triệu',
        code: 'SAVE200K',
        discountType: 'FIXED',
        discountValue: 200000,
        minOrderValue: 5000000,
        startDate: new Date('2026-03-01'),
        endDate: new Date('2026-06-30'),
        active: true,
      },
      {
        name: 'RAM Sale mùa hè',
        code: 'RAMSALE15',
        discountType: 'PERCENTAGE',
        discountValue: 15,
        minOrderValue: 500000,
        maxDiscount: 300000,
        startDate: new Date('2026-06-01'),
        endDate: new Date('2026-08-31'),
        active: true,
      },
    ],
    skipDuplicates: true,
  });
  console.log('✅ 3 promotions created');

  // ============================================
  // 6. Create News Categories
  // ============================================
  const newsCategories = await Promise.all([
    prisma.newsCategory.upsert({
      where: { slug: 'cong-nghe' },
      update: {},
      create: { name: 'Công nghệ', slug: 'cong-nghe' },
    }),
    prisma.newsCategory.upsert({
      where: { slug: 'thu-thuat' },
      update: {},
      create: { name: 'Thủ thuật', slug: 'thu-thuat' },
    }),
    prisma.newsCategory.upsert({
      where: { slug: 'review-danh-gia' },
      update: {},
      create: { name: 'Review & Đánh giá', slug: 'review-danh-gia' },
    }),
    prisma.newsCategory.upsert({
      where: { slug: 'gaming-gear' },
      update: {},
      create: { name: 'Gaming Gear', slug: 'gaming-gear' },
    }),
  ]);
  console.log('✅ 4 news categories created');

  const [nCatTech, nCatTips, nCatReview, nCatGear] = newsCategories;

  // ============================================
  // 7. Create News Posts
  // ============================================
  const newsPosts = [
    {
      title: 'Trên tay Intel Core i9-14900K: Quái vật hiệu năng thế hệ 14',
      slug: 'tren-tay-intel-core-i9-14900k-quai-vat-hieu-nang',
      excerpt: 'Đánh giá chi tiết hiệu năng của i9-14900K trong các tác vụ gaming và đồ họa nặng.',
      content: '<p>Intel Core i9-14900K là vi xử lý mạnh mẽ nhất của Intel hiện nay với 24 nhân 32 luồng...</p>',
      thumbnail: 'https://images.unsplash.com/photo-1591405351990-4726e331f141?q=80&w=1000&auto=format&fit=crop',
      categoryId: nCatReview.id,
      isFeatured: true,
    },
    {
      title: 'Top 5 bàn phím cơ Keychron đáng mua nhất năm 2024',
      slug: 'top-5-ban-phim-co-keychron-dang-mua',
      excerpt: 'Tổng hợp những mẫu bàn phím cơ Keychron từ bình dân đến cao cấp cho người mới chơi.',
      content: '<p>Keychron đã khẳng định được vị thế của mình trên thị trường bàn phím cơ với nhiều mẫu mã đa dạng...</p>',
      thumbnail: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=1000&auto=format&fit=crop',
      categoryId: nCatGear.id,
      isFeatured: true,
    },
    {
      title: 'Cách lắp ráp PC gaming tại nhà cực đơn giản cho người mới',
      slug: 'cach-lap-rap-pc-gaming-tai-nha-don-gian',
      excerpt: 'Hướng dẫn từng bước giúp bạn tự xây dựng dàn máy tính mơ ước mà không cần ra tiệm.',
      content: '<p>Tự lắp ráp PC không chỉ giúp bạn tiết kiệm chi phí mà còn giúp bạn hiểu rõ hơn về thiết bị của mình...</p>',
      thumbnail: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=1000&auto=format&fit=crop',
      categoryId: nCatTips.id,
      isFeatured: false,
    },
    {
      title: 'NVIDIA RTX 50-series: Những rò rỉ mới nhất về kiến trúc Blackwell',
      slug: 'nvidia-rtx-50-series-ro-ri-kien-truc-blackwell',
      excerpt: 'Cập nhật tin tức mới nhất về dòng card đồ họa thế hệ tiếp theo của NVIDIA.',
      content: '<p>Dòng card đồ họa RTX 50-series hứa hẹn sẽ mang lại bước nhảy vọt về hiệu năng so với thế hệ tiền nhiệm...</p>',
      thumbnail: 'https://images.unsplash.com/photo-1587202372634-327a5e314ce0?q=80&w=1000&auto=format&fit=crop',
      categoryId: nCatTech.id,
      isFeatured: true,
    },
    {
      title: 'Đánh giá màn hình LG UltraGear 27GP850: Chiến game tuyệt đỉnh',
      slug: 'danh-gia-man-hinh-lg-ultragear-27gp850',
      excerpt: 'Trải nghiệm thực tế màn hình gaming Nano IPS 165Hz được săn đón nhất hiện nay.',
      content: '<p>LG UltraGear 27GP850 sở hữu tấm nền Nano IPS tuyệt đẹp cùng tần số quét cao...</p>',
      thumbnail: 'https://images.unsplash.com/photo-1547119957-637f8679db1e?q=80&w=1000&auto=format&fit=crop',
      categoryId: nCatReview.id,
      isFeatured: false,
    },
    {
      title: 'DDR5 vs DDR4: Đã đến lúc để bạn nâng cấp?',
      slug: 'ddr5-vs-ddr4-da-den-luc-nang-cap',
      excerpt: 'So sánh chi tiết hiệu năng và giá cả giữa hai thế hệ RAM phổ biến nhất.',
      content: '<p>Sự ra đời của DDR5 mang lại băng thông lớn hơn nhưng liệu nó có thực sự cần thiết cho nhu cầu hàng ngày?...</p>',
      thumbnail: 'https://images.unsplash.com/photo-1562976540-1502c2145186?q=80&w=1000&auto=format&fit=crop',
      categoryId: nCatTech.id,
      isFeatured: false,
    },
    {
      title: 'Mẹo tối ưu hóa Windows 11 để chơi game mượt mà hơn',
      slug: 'meo-toi-uu-hoa-windows-11-choi-game',
      excerpt: 'Chỉ với vài bước đơn giản bạn có thể tăng FPS đáng kể cho các tựa game yêu thích.',
      content: '<p>Windows 11 có nhiều tính năng hỗ trợ gaming nhưng bạn cần biết cách cấu hình để đạt hiệu quả cao nhất...</p>',
      thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop',
      categoryId: nCatTips.id,
      isFeatured: false,
    },
    {
      title: 'Logitech G Pro X Superlight 2 có gì mới?',
      slug: 'logitech-g-pro-x-superlight-2-co-gi-moi',
      excerpt: 'Review chi tiết phiên bản kế nhiệm của mẫu chuột gaming huyền thoại từ Logitech.',
      content: '<p>G Pro X Superlight 2 vẫn giữ form dáng quen thuộc nhưng được nâng cấp mạnh mẽ bên trong...</p>',
      thumbnail: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=1000&auto=format&fit=crop',
      categoryId: nCatGear.id,
      isFeatured: true,
    },
    {
      title: 'Tìm hiểu về SSD NVMe Gen 5: Tốc độ ghi lên tới 10,000 MB/s',
      slug: 'tim-hieu-ssd-nvme-gen-5-toc-do-khung',
      excerpt: 'Công nghệ lưu trữ đột phá mang lại trải nghiệm load game và ứng dụng tức thì.',
      content: '<p>SSD Gen 5 đang dần phổ biến với tốc độ vượt xa những gì chúng ta từng tưởng tượng...</p>',
      thumbnail: 'https://images.unsplash.com/photo-1597733336794-12d05021d510?q=80&w=1000&auto=format&fit=crop',
      categoryId: nCatTech.id,
      isFeatured: false,
    },
    {
      title: 'Cách vệ sinh màn hình máy tính đúng cách không lo trầy xước',
      slug: 'cach-ve-sinh-man-hinh-may-tinh-dung-cach',
      excerpt: 'Những sai lầm chết người khi vệ sinh màn hình mà bạn cần tránh tuyệt đối.',
      content: '<p>Vệ sinh màn hình sai cách có thể làm hỏng lớp phủ chống chói và gây ra những vết xước vĩnh viễn...</p>',
      thumbnail: 'https://images.unsplash.com/photo-1552533231-7bc28751db59?q=80&w=1000&auto=format&fit=crop',
      categoryId: nCatTips.id,
      isFeatured: false,
    },
  ];

  for (const post of newsPosts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    });
  }
  console.log('✅ 10 news posts created');

  // ============================================
  // Summary
  // ============================================
  const counts = {
    users: await prisma.user.count(),
    categories: await prisma.category.count(),
    brands: await prisma.brand.count(),
    products: await prisma.product.count(),
    promotions: await prisma.promotion.count(),
    newsCategories: await prisma.newsCategory.count(),
    posts: await prisma.post.count(),
  };

  console.log('\n🎉 Seed hoàn tất!');
  console.log('━━━━━━━━━━━━━━━━━━━━━');
  console.log(`👤 Users:           ${counts.users}`);
  console.log(`📁 Categories:      ${counts.categories}`);
  console.log(`🏢 Brands:          ${counts.brands}`);
  console.log(`📦 Products:        ${counts.products}`);
  console.log(`🏷️  Promotions:      ${counts.promotions}`);
  console.log(`📰 News Categories: ${counts.newsCategories}`);
  console.log(`📝 News Posts:      ${counts.posts}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n🔑 Admin login: admin@techzone.vn / admin123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
