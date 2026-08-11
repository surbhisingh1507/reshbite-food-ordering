import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DietBadge, VegDot } from "@/components/common/DietBadge";
import { Rating } from "@/components/common/Rating";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { getRestaurant } from "@/data/restaurants";
import type { Food } from "@/data/foods";
import { inr } from "@/utils/format";
import { cn } from "@/lib/utils";

export function FoodCard({ food, compact = false }: { food: Food; compact?: boolean }) {
  const { addItem } = useCart();
  const wishlist = useWishlist();
  const restaurant = getRestaurant(food.restaurantId);
  const saved = wishlist.has(food.id);

  return (
    <article className="card-lift group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card">
      <div className="relative">
        <Link to="/food/$foodId" params={{ foodId: String(food.id) }} className="block">
          <img
            src={food.image}
            alt={food.name}
            loading="lazy"
            width={800}
            height={600}
            className={cn(
              "w-full object-cover transition-transform duration-500 group-hover:scale-105",
              compact ? "h-36" : "h-48",
            )}
          />
        </Link>
        <button
          type="button"
          onClick={() => wishlist.toggle(food.id)}
          aria-label={saved ? `Remove ${food.name} from wishlist` : `Add ${food.name} to wishlist`}
          aria-pressed={saved}
          className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-card/90 text-foreground shadow-[var(--shadow-soft)] backdrop-blur transition-colors hover:text-primary"
        >
          <Heart className={cn("size-4", saved && "fill-primary text-primary")} aria-hidden="true" />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <VegDot veg={!food.tags.includes("Non-Veg")} />
              <h3 className="truncate text-base font-bold">
                <Link to="/food/$foodId" params={{ foodId: String(food.id) }} className="hover:text-primary">
                  {food.name}
                </Link>
              </h3>
            </div>
            {restaurant ? (
              <Link
                to="/restaurant/$restaurantId"
                params={{ restaurantId: String(restaurant.id) }}
                className="mt-1 block truncate text-xs text-muted-foreground hover:text-primary"
              >
                {restaurant.name}
              </Link>
            ) : null}
          </div>
          <Rating value={food.rating} />
        </div>

        <p className="line-clamp-2 text-sm text-muted-foreground">{food.description}</p>

        <div className="flex flex-wrap gap-1.5">
          {food.tags.map((tag) => (
            <DietBadge key={tag} tag={tag} />
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <span className="text-lg font-bold">{inr(food.price)}</span>
          <Button size="sm" className="rounded-full px-5" onClick={() => addItem(food.id)}>
            Add to Cart
          </Button>
        </div>
      </div>
    </article>
  );
}