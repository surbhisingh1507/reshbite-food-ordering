import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import { toast } from "sonner";
import { useLocalStorage } from "@/utils/storage";

export type WishlistItem = { foodId: number };

type WishlistContextValue = {
  items: WishlistItem[];
  hydrated: boolean;
  ids: number[];
  has: (foodId: number) => boolean;
  toggle: (foodId: number) => void;
  addToWishlist: (foodId: number) => void;
  removeFromWishlist: (foodId: number) => void;
  clearWishlist: () => void;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { value: items, setValue: setItems, hydrated } = useLocalStorage<WishlistItem[]>(
    "freshbite.wishlist",
    [],
  );

  const ids = useMemo(() => items.map((i) => i.foodId), [items]);

  const has = useCallback((foodId: number) => ids.includes(foodId), [ids]);

  const addToWishlist = useCallback(
    (foodId: number) => {
      setItems((prev) => (prev.some((i) => i.foodId === foodId) ? prev : [...prev, { foodId }]));
      toast.success("Added to wishlist.");
    },
    [setItems],
  );

  const removeFromWishlist = useCallback(
    (foodId: number) => {
      setItems((prev) => prev.filter((i) => i.foodId !== foodId));
      toast("Removed from wishlist.");
    },
    [setItems],
  );

  const toggle = useCallback(
    (foodId: number) => {
      setItems((prev) => (prev.some((i) => i.foodId === foodId) ? prev.filter((i) => i.foodId !== foodId) : [...prev, { foodId }]));
    },
    [setItems],
  );

  const clearWishlist = useCallback(() => setItems([]), [setItems]);

  return (
    <WishlistContext.Provider value={{ items, hydrated, ids, has, toggle, addToWishlist, removeFromWishlist, clearWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside WishlistProvider");
  return ctx;
}
