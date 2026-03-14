import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Email không hợp lệ" }),
  password: z.string().min(6, { message: "Mật khẩu tối thiểu 6 ký tự" }),
});

export const productFilterSchema = z.object({
  category: z.string().optional(),
  brand: z.string().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  search: z.string().optional(),
  sort: z.enum(["newest", "price_asc", "price_desc", "popular"]).optional().default("newest"),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(50).optional().default(12),
});

export const createProductSchema = z.object({
  name: z.string().min(5, { message: "Tên sản phẩm tối thiểu 5 ký tự" }),
  slug: z.string().min(5, { message: "Slug trống hoặc quá ngắn" }),
  description: z.string().min(20, { message: "Mô tả ít nhất 20 ký tự" }),
  price: z.coerce.number().min(1000, { message: "Giá không hợp lệ" }),
  salePrice: z.coerce.number().min(0).optional().nullable(),
  images: z.array(z.string().url()).min(1, { message: "Cần ít nhất 1 hình ảnh" }),
  specs: z.record(z.string(), z.string()).optional().default({}),
  stock: z.coerce.number().min(0).optional().default(0),
  featured: z.boolean().optional().default(false),
  status: z.enum(["ACTIVE", "DRAFT", "OUT_OF_STOCK"]).optional().default("ACTIVE"),
  categoryId: z.string().min(1, { message: "Chưa chọn category" }),
  brandId: z.string().min(1, { message: "Chưa chọn brand" }),
});

export const updateProductSchema = createProductSchema.partial();

export const cartItemSchema = z.object({
  productId: z.string(),
  quantity: z.coerce.number().min(1).default(1),
});

export const createOrderSchema = z.object({
  shippingName: z.string().min(2, { message: "Vui lòng nhập họ tên" }),
  shippingPhone: z.string().regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, { message: "SĐT không hợp lệ" }),
  shippingAddress: z.string().min(10, { message: "Địa chỉ quá ngắn" }),
  note: z.string().optional(),
  promotionCode: z.string().optional(),
});

export const addReviewSchema = z.object({
  rating: z.coerce.number().min(1).max(5),
  comment: z.string().min(10, { message: "Nhận xét quá ngắn (>= 10 ký tự)" }).max(1000),
});

export const createPromotionSchema = z.object({
  name: z.string().min(5),
  code: z.string().min(5).max(20).toUpperCase(),
  discountType: z.enum(["PERCENTAGE", "FIXED"]),
  discountValue: z.coerce.number().min(1),
  minOrderValue: z.coerce.number().min(0).optional(),
  maxDiscount: z.coerce.number().min(0).optional().nullable(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  usageLimit: z.coerce.number().min(1).optional().nullable(),
});
