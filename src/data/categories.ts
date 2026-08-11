import { Pizza, Beef, Flame, Soup, CookingPot, IceCream2, Salad, CupSoda } from "lucide-react";

export type Category = {
  id: string;
  name: string;
  icon: typeof Pizza;
  tint: string;
};

export const categories: Category[] = [
  { id: "pizza", name: "Pizza", icon: Pizza, tint: "bg-primary/10" },
  { id: "burgers", name: "Burgers", icon: Beef, tint: "bg-gold/15" },
  { id: "indian", name: "Indian", icon: Flame, tint: "bg-primary/10" },
  { id: "chinese", name: "Chinese", icon: Soup, tint: "bg-veg/10" },
  { id: "biryani", name: "Biryani", icon: CookingPot, tint: "bg-gold/15" },
  { id: "desserts", name: "Desserts", icon: IceCream2, tint: "bg-primary/10" },
  { id: "healthy", name: "Healthy", icon: Salad, tint: "bg-veg/10" },
  { id: "beverages", name: "Beverages", icon: CupSoda, tint: "bg-gold/15" },
];