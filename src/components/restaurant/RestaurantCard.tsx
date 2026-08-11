import { Link } from "@tanstack/react-router";
import { Clock, Leaf } from "lucide-react";
import { Rating } from "@/components/common/Rating";
import type { Restaurant } from "@/data/restaurants";
import { inr, priceSymbol } from "@/utils/format";

export function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  return (
    <Link
      to="/restaurant/$restaurantId"
      params={{ restaurantId: String(restaurant.id) }}
      className="card-lift group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <div className="relative overflow-hidden">
        <img
          src={restaurant.image}
          alt={`${restaurant.name} signature dish`}
          loading="lazy"
          width={800}
          height={600}
          className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-card/95 px-3 py-1 text-xs font-semibold shadow-[var(--shadow-soft)]">
          <Clock className="size-3 text-primary" aria-hidden="true" />
          {restaurant.deliveryTime}
        </span>
        {restaurant.pureVeg ? (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-veg px-2.5 py-1 text-[11px] font-bold text-primary-foreground">
            <Leaf className="size-3" aria-hidden="true" /> Pure Veg
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="truncate text-lg font-bold group-hover:text-primary">{restaurant.name}</h3>
          <Rating value={restaurant.rating} />
        </div>
        <p className="truncate text-sm text-muted-foreground">{restaurant.cuisine.join(" • ")}</p>
        <p className="mt-auto pt-2 text-sm font-medium text-muted-foreground">
          {inr(restaurant.priceForTwo)} for two
          <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs font-bold text-foreground">
            {priceSymbol(restaurant.priceLevel)}
          </span>
        </p>
      </div>
    </Link>
  );
}