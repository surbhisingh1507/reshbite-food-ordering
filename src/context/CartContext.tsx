import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import { toast } from "sonner";
import { getFood } from "@/data/foods";
import { useLocalStorage } from "@/utils/storage";

export type CartLine = { foodId: number; qty: number };

export const COUPONS: Record<string, { type: "percent" | "flat"; value: number; label: string }> = {
  WELCOME20: { type: "percent", value: 20, label: "20% off your order (max ₹150)" },
  FRESH50: { type: "flat", value: 50, label: "Flat ₹50 off" },
};

type CartContextValue = {
  items: CartLine[];
  hydrated: boolean;
  coupon: string | null;
  count: number;
  addItem: (foodId: number, qty?: number) => void;
  setQty: (foodId: number, qty: number) => void;
  removeItem: (foodId: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  totals: {
    subtotal: number;
    deliveryFee: number;
    taxes: number;
    discount: number;
    total: number;
  };
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { value: items, setValue: setItems, hydrated } = useLocalStorage<CartLine[]>(
    "freshbite.cart",
    [],
  );
  const { value: coupon, setValue: setCoupon } = useLocalStorage<string | null>(
    "freshbite.coupon",
    null,
  );

  const addItem = useCallback(
    (foodId: number, qty = 1) => {
      setItems((prev) => {
        const existing = prev.find((l) => l.foodId === foodId);
        if (existing) {
          return prev.map((l) => (l.foodId === foodId ? { ...l, qty: l.qty + qty } : l));
        }
        return [...prev, { foodId, qty }];
      });
      toast.success(`${getFood(foodId)?.name ?? "Item"} added to cart!`);
    },
    [setItems],
  );

  const setQty = useCallback(
    (foodId: number, qty: number) => {
      setItems((prev) =>
        qty <= 0
          ? prev.filter((l) => l.foodId !== foodId)
          : prev.map((l) => (l.foodId === foodId ? { ...l, qty } : l)),
      );
    },
    [setItems],
  );

  const removeItem = useCallback(
    (foodId: number) => {
      setItems((prev) => prev.filter((l) => l.foodId !== foodId));
      toast("Item removed from cart.");
    },
    [setItems],
  );

  const clearCart = useCallback(() => {
    setItems([]);
    setCoupon(null);
  }, [setItems, setCoupon]);

  const applyCoupon = useCallback(
    (code: string) => {
      const key = code.trim().toUpperCase();
      if (!COUPONS[key]) {
        toast.error("That coupon code isn't valid.");
        return false;
      }
      setCoupon(key);
      toast.success(`Coupon ${key} applied — ${COUPONS[key].label}`);
      return true;
    },
    [setCoupon],
  );

  const removeCoupon = useCallback(() => setCoupon(null), [setCoupon]);

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, line) => {
      const food = getFood(line.foodId);
      return sum + (food ? food.price * line.qty : 0);
    }, 0);
    const deliveryFee = subtotal === 0 ? 0 : subtotal >= 499 ? 0 : 40;
    const taxes = Math.round(subtotal * 0.05);
    let discount = 0;
    if (coupon && COUPONS[coupon] && subtotal > 0) {
      const c = COUPONS[coupon];
      discount = c.type === "flat" ? c.value : Math.min(150, Math.round((subtotal * c.value) / 100));
      discount = Math.min(discount, subtotal);
    }
    return {
      subtotal,
      deliveryFee,
      taxes,
      discount,
      total: Math.max(0, subtotal + deliveryFee + taxes - discount),
    };
  }, [items, coupon]);

  const count = items.reduce((sum, l) => sum + l.qty, 0);

  const value: CartContextValue = {
    items,
    hydrated,
    coupon,
    count,
    addItem,
    setQty,
    removeItem,
    clearCart,
    applyCoupon,
    removeCoupon,
    totals,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
