import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice?: number;
  image: string;
  stock: number;
}

export interface CartItemState {
  product: CartProduct;
  quantity: number;
}

interface CartStore {
  items: CartItemState[];
  
  // Actions
  addItem: (product: CartProduct, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  
  // Computed
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getItemPrice: (item: CartItemState) => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: CartProduct, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product.id === product.id
          );

          if (existingItem) {
            const newQuantity = Math.min(
              existingItem.quantity + quantity,
              product.stock
            );
            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: newQuantity }
                  : item
              ),
            };
          }

          const clampedQuantity = Math.min(quantity, product.stock);
          return {
            items: [...state.items, { product, quantity: clampedQuantity }],
          };
        });
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId: string, quantity: number) => {
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter((item) => item.product.id !== productId),
            };
          }

          return {
            items: state.items.map((item) =>
              item.product.id === productId
                ? {
                    ...item,
                    quantity: Math.min(quantity, item.product.stock),
                  }
                : item
            ),
          };
        });
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const price = item.product.salePrice ?? item.product.price;
          return total + price * item.quantity;
        }, 0);
      },

      getItemPrice: (item: CartItemState) => {
        const price = item.product.salePrice ?? item.product.price;
        return price * item.quantity;
      },
    }),
    {
      name: 'techzone-cart',
    }
  )
);
