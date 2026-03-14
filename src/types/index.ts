/* ============================================
   TechZone Type Definitions
   ============================================ */

export type UserRole = 'ADMIN' | 'CUSTOMER';

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPING' | 'DELIVERED' | 'CANCELLED';

export type ProductStatus = 'ACTIVE' | 'DRAFT' | 'OUT_OF_STOCK';

export type DiscountType = 'PERCENTAGE' | 'FIXED';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  description?: string;
  parentId?: string;
  _count?: {
    products: number;
  };
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  _count?: {
    products: number;
  };
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice?: number;
  images: string[];
  specs: Record<string, string>;
  categoryId: string;
  category?: Category;
  brandId: string;
  brand?: Brand;
  stock: number;
  featured: boolean;
  status: ProductStatus;
  rating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductSpec {
  id: string;
  productId: string;
  key: string;
  value: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  user?: Pick<User, 'id' | 'name'>;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface CartItem {
  id: string;
  productId: string;
  product?: Product;
  quantity: number;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product?: Product;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  user?: User;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  note?: string;
  promotionCode?: string;
  discountAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Promotion {
  id: string;
  name: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderValue?: number;
  maxDiscount?: number;
  startDate: Date;
  endDate: Date;
  active: boolean;
  usageLimit?: number;
  usedCount: number;
  createdAt: Date;
}

/* ============================================
   API Response Types
   ============================================ */

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductFilters {
  category?: string;
  brand?: string[];
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'popular' | 'rating';
  page?: number;
  limit?: number;
}
