import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, CartItem, Cart } from '@/types';

interface CartState {
  cart: Cart;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

import { MOCK_PRODUCTS } from '@/data/products';

const DUMMY_ITEM_1 = MOCK_PRODUCTS[0]; // RTX 4090
const DUMMY_ITEM_2 = MOCK_PRODUCTS[2]; // Lian Li Case

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: {
        items: [
          {
            id: `${DUMMY_ITEM_1.id}-initial`,
            product: DUMMY_ITEM_1,
            quantity: 1,
            priceAtAddition: DUMMY_ITEM_1.priceSale ?? DUMMY_ITEM_1.priceRegular,
          },
          {
            id: `${DUMMY_ITEM_2.id}-initial`,
            product: DUMMY_ITEM_2,
            quantity: 2,
            priceAtAddition: DUMMY_ITEM_2.priceSale ?? DUMMY_ITEM_2.priceRegular,
          }
        ],
        subtotal: (DUMMY_ITEM_1.priceSale ?? DUMMY_ITEM_1.priceRegular) * 1 + (DUMMY_ITEM_2.priceSale ?? DUMMY_ITEM_2.priceRegular) * 2,
        itemCount: 3,
      },
      isOpen: false,
      setIsOpen: (isOpen) => set({ isOpen }),
      addToCart: (product, quantity = 1) => {
        const { cart } = get();
        const existingItem = cart.items.find(item => item.product.id === product.id);

        let newItems: CartItem[];
        if (existingItem) {
          newItems = cart.items.map(item =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          newItems = [
            ...cart.items,
            {
              id: `${product.id}-${Date.now()}`,
              product,
              quantity,
              priceAtAddition: product.priceSale ?? product.priceRegular,
            },
          ];
        }

        const subtotal = newItems.reduce((acc, item) => acc + (item.priceAtAddition * item.quantity), 0);
        const itemCount = newItems.reduce((acc, item) => acc + item.quantity, 0);

        set({ cart: { items: newItems, subtotal, itemCount } });
      },
      removeFromCart: (productId) => {
        const { cart } = get();
        const newItems = cart.items.filter(item => item.product.id !== productId);
        
        const subtotal = newItems.reduce((acc, item) => acc + (item.priceAtAddition * item.quantity), 0);
        const itemCount = newItems.reduce((acc, item) => acc + item.quantity, 0);

        set({ cart: { items: newItems, subtotal, itemCount } });
      },
      updateQuantity: (productId, quantity) => {
        if (quantity < 1) return;
        
        const { cart } = get();
        const newItems = cart.items.map(item =>
          item.product.id === productId
            ? { ...item, quantity }
            : item
        );
        
        const subtotal = newItems.reduce((acc, item) => acc + (item.priceAtAddition * item.quantity), 0);
        const itemCount = newItems.reduce((acc, item) => acc + item.quantity, 0);

        set({ cart: { items: newItems, subtotal, itemCount } });
      },
      clearCart: () => {
        set({ cart: { items: [], subtotal: 0, itemCount: 0 } });
      },
    }),
    {
      name: 'dc-cart-storage-v2',
    }
  )
);
