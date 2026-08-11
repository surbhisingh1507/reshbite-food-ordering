import { createContext, useCallback, useContext, type ReactNode } from "react";
import { toast } from "sonner";
import { useLocalStorage } from "@/utils/storage";

export type User = { name: string; email: string; phone: string; guest?: boolean };

export type Address = {
  id: string;
  label: "Home" | "Work" | "Other";
  fullName: string;
  phone: string;
  line: string;
  city: string;
  state: string;
  pin: string;
};

export type OrderStatus = "Preparing" | "Out for Delivery" | "Delivered" | "Cancelled";

export type Order = {
  id: string;
  date: string;
  restaurant: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
  status: OrderStatus;
  address: string;
  payment: string;
  eta: string;
};

const seedOrders: Order[] = [
  {
    id: "FB20260721004",
    date: "2026-07-21T19:20:00.000Z",
    restaurant: "Biryani House",
    items: [
      { name: "Hyderabadi Chicken Biryani", qty: 2, price: 340 },
      { name: "Double Ka Meetha", qty: 1, price: 160 },
    ],
    total: 882,
    status: "Delivered",
    address: "12 Marigold Lane, Green Park",
    payment: "UPI",
    eta: "Delivered in 32 min",
  },
  {
    id: "FB20260803011",
    date: "2026-08-03T13:05:00.000Z",
    restaurant: "Napoli Woodfire",
    items: [{ name: "Margherita Woodfire", qty: 1, price: 420 }],
    total: 481,
    status: "Cancelled",
    address: "12 Marigold Lane, Green Park",
    payment: "Cash on Delivery",
    eta: "—",
  },
];

type AuthContextValue = {
  user: User | null;
  hydrated: boolean;
  addresses: Address[];
  orders: Order[];
  login: (email: string, password: string) => boolean;
  register: (user: User & { password: string }) => boolean;
  continueAsGuest: () => void;
  logout: () => void;
  updateProfile: (patch: Partial<User>) => void;
  saveAddress: (address: Address) => void;
  deleteAddress: (id: string) => void;
  addOrder: (order: Order) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { value: user, setValue: setUser, hydrated } = useLocalStorage<User | null>(
    "freshbite.user",
    null,
  );
  const { value: addresses, setValue: setAddresses } = useLocalStorage<Address[]>(
    "freshbite.addresses",
    [],
  );
  const { value: orders, setValue: setOrders } = useLocalStorage<Order[]>(
    "freshbite.orders",
    seedOrders,
  );

  const login = useCallback(
    (email: string, _password: string) => {
      const name = (email.split("@")[0] ?? "friend").replace(/[._-]/g, " ");
      setUser({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        email,
        phone: "+91 98765 43210",
      });
      toast.success("Welcome back to FreshBite!");
      return true;
    },
    [setUser],
  );

  const register = useCallback(
    (data: User & { password: string }) => {
      setUser({ name: data.name, email: data.email, phone: data.phone });
      toast.success("Account created. Happy bites!");
      return true;
    },
    [setUser],
  );

  const continueAsGuest = useCallback(() => {
    setUser({ name: "Guest", email: "guest@freshbite.app", phone: "", guest: true });
    toast("Browsing as a guest.");
  }, [setUser]);

  const logout = useCallback(() => {
    setUser(null);
    toast("You have been logged out.");
  }, [setUser]);

  const updateProfile = useCallback(
    (patch: Partial<User>) => {
      setUser((prev) => (prev ? { ...prev, ...patch } : prev));
      toast.success("Profile updated.");
    },
    [setUser],
  );

  const saveAddress = useCallback(
    (address: Address) => {
      setAddresses((prev) => {
        const exists = prev.some((a) => a.id === address.id);
        return exists ? prev.map((a) => (a.id === address.id ? address : a)) : [...prev, address];
      });
    },
    [setAddresses],
  );

  const deleteAddress = useCallback(
    (id: string) => {
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      toast("Address deleted.");
    },
    [setAddresses],
  );

  const addOrder = useCallback(
    (order: Order) => setOrders((prev) => [order, ...prev]),
    [setOrders],
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        hydrated,
        addresses,
        orders,
        login,
        register,
        continueAsGuest,
        logout,
        updateProfile,
        saveAddress,
        deleteAddress,
        addOrder,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
