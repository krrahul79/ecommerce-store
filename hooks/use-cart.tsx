import { create } from "zustand";
import { toast } from "react-hot-toast";
import { persist, createJSONStorage } from "zustand/middleware";

import { Cart, CartProduct, Product } from "@/types";
import { AlertTriangle } from "lucide-react";

interface CartStore {
  items: Cart[];
  addItem: (data: Cart) => void;
  removeItem: (id: string) => void;
  reduceItem: (id: string) => void;
  increaseItem: (id: string) => void;
  removeAll: () => void;
}

const useCart = create(
  persist<CartStore>(
    (set, get) => ({
      items: [],
      addItem: (data: Cart) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(
          (item) => item.cartProduct._id === data.cartProduct._id
        );

        if (existingItem) {
          return toast("Item already in cart.");
        }

        set({ items: [...get().items, data] });
        toast.success("Item added to cart.");
      },
      removeItem: (id: string) => {
        set({
          items: [...get().items.filter((item) => item.cartProduct._id !== id)],
        });
        toast.success("Item removed from cart.");
      },
      reduceItem: (id: string) => {
        const { items } = get();

        // Find the index of the item with the specified id
        const index = items.findIndex((item) => item.cartProduct._id === id);

        if (index !== -1) {
          const updatedItems = [...items];
          const item = updatedItems[index];

          // Reduce the quantity of the item by 1
          item.quantity--;

          // If quantity becomes zero, remove the item from the cart
          if (item.quantity <= 0) {
            updatedItems.splice(index, 1);
          }

          // Update the state with the modified items
          set({ items: updatedItems });
          toast.success("Item quantity reduced.");
        } else {
          // Item with the specified id not found
          toast.error("Item not found in cart.");
        }
      },
      increaseItem: (id: string) => {
        const { items } = get();

        // Find the index of the item with the specified id
        const index = items.findIndex((item) => item.cartProduct._id === id);

        if (index !== -1) {
          const updatedItems = [...items];
          const item = updatedItems[index];

          // Reduce the quantity of the item by 1
          item.quantity++;
          // Update the state with the modified items
          set({ items: updatedItems });
          toast.success("Item quantity reduced.");
        } else {
          // Item with the specified id not found
          toast.error("Item not found in cart.");
        }
      },
      removeAll: () => set({ items: [] }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useCart;

//localStorage.removeItem("cart-storage");
