import { useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search, SlidersHorizontal, Store, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/common/EmptyState";
import { RestaurantCard } from "@/components/restaurant/RestaurantCard";
import { FoodCard } from "@/components/food/FoodCard";
import { restaurants } from "@/data/restaurants";
import { foods } from "@/data/foods";
import { cn } from "@/lib/utils";

type RestaurantSearch = { q?: string | undefined; category?: string | undefined };

export const Route = createFileRoute("/restaurants")({
  validateSearch: (search: Record<string, unknown>): RestaurantSearch => ({
    q: typeof search["q"] === "string" && search["q"] ? (search["q"] as string) : undefined,
    category:
      typeof search["category"] === "string" && search["category"]
        ? (search["category"] as string)
        : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Discover Restaurants Near You — FreshBite" },
      {
        name: "description",
        content:
          "Search and filter FreshBite partner restaurants by cuisine, rating, price and delivery time.",
      },
      { property: "og:title", content: "Discover Restaurants Near You — FreshBite" },
      {
        property: "og:description",
        content: "Filter by cuisine, rating, price and delivery time to find your next meal.",
      },
    ],
  }),
  component: RestaurantsPage,
});

const cuisines = ["Indian", "Chinese", "Italian", "Mexican", "Fast Food", "Desserts", "Healthy"];
const sorts = [
  { id: "recommended", label: "Recommended" },
  { id: "rating", label: "Rating" },
  { id: "delivery", label: "Delivery Time" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
] as const;

function RestaurantsPage() {
  const { q, category } = Route.useSearch();
  const navigate = useNavigate();
  const [query, setQuery] = useState(q ?? "");
  const [cuisine, setCuisine] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [priceLevels, setPriceLevels] = useState<number[]>([]);
  const [maxDelivery, setMaxDelivery] = useState<number | null>(null);
  const [vegOnly, setVegOnly] = useState(false);
  const [sort, setSort] = useState<(typeof sorts)[number]["id"]>("recommended");
  const [showFilters, setShowFilters] = useState(false);

  const term = (query || q || "").trim().toLowerCase();

  const list = useMemo(() => {
    let result = restaurants.filter((r) => {
      if (category && !r.categories.includes(category)) return false;
      if (cuisine.length && !r.cuisine.some((c) => cuisine.includes(c))) return false;
      if (minRating && r.rating < minRating) return false;
      if (priceLevels.length && !priceLevels.includes(r.priceLevel)) return false;
      if (maxDelivery && r.deliveryMinutes > maxDelivery) return false;
      if (vegOnly && !r.pureVeg) return false;
      if (term) {
        const inRestaurant =
          r.name.toLowerCase().includes(term) ||
          r.cuisine.some((c) => c.toLowerCase().includes(term)) ||
          r.categories.some((c) => c.includes(term));
        const inMenu = foods.some(
          (f) => f.restaurantId === r.id && f.name.toLowerCase().includes(term),
        );
        if (!inRestaurant && !inMenu) return false;
      }
      return true;
    });

    result = [...result].sort((a, b) => {
      switch (sort) {
        case "rating":
          return b.rating - a.rating;
        case "delivery":
          return a.deliveryMinutes - b.deliveryMinutes;
        case "price-asc":
          return a.priceForTwo - b.priceForTwo;
        case "price-desc":
          return b.priceForTwo - a.priceForTwo;
        default:
          return b.rating * 100 + b.reviews / 1000 - (a.rating * 100 + a.reviews / 1000);
      }
    });

    return result;
  }, [category, cuisine, minRating, priceLevels, maxDelivery, vegOnly, term, sort]);

  const matchingDishes = useMemo(
    () =>
      term
        ? foods.filter(
            (f) =>
              f.name.toLowerCase().includes(term) ||
              f.category.includes(term) ||
              f.description.toLowerCase().includes(term),
          )
        : [],
    [term],
  );

  const activeFilters =
    cuisine.length + priceLevels.length + (minRating ? 1 : 0) + (maxDelivery ? 1 : 0) + (vegOnly ? 1 : 0);

  const clearAll = () => {
    setCuisine([]);
    setMinRating(null);
    setPriceLevels([]);
    setMaxDelivery(null);
    setVegOnly(false);
    setQuery("");
    navigate({ to: "/restaurants", search: {} });
  };

  const toggle = <T,>(list: T[], item: T, setter: (v: T[]) => void) =>
    setter(list.includes(item) ? list.filter((x) => x !== item) : [...list, item]);

  return (
    <div className="container-page py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-black sm:text-4xl">Discover Restaurants Near You</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          {restaurants.length} partner kitchens delivering to your area right now.
        </p>
      </header>

      <div className="mb-8 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
        <div className="relative">
          <label htmlFor="restaurant-search" className="sr-only">
            Search restaurants, dishes or cuisines
          </label>
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            id="restaurant-search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              navigate({ to: "/restaurants", search: { q: e.target.value || undefined, category } });
            }}
            placeholder="Search by restaurant, dish or cuisine"
            className="h-12 rounded-full bg-card pl-11"
          />
        </div>
        <div>
          <label htmlFor="sort" className="sr-only">
            Sort restaurants
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="h-12 w-full rounded-full border border-border bg-card px-5 text-sm font-semibold"
          >
            {sorts.map((s) => (
              <option key={s.id} value={s.id}>
                Sort: {s.label}
              </option>
            ))}
          </select>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowFilters((v) => !v)}
          className="h-12 rounded-full border-primary/40 text-primary lg:hidden"
        >
          <SlidersHorizontal className="size-4" aria-hidden="true" /> Filters
          {activeFilters ? ` (${activeFilters})` : ""}
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className={cn("lg:block", showFilters ? "block" : "hidden")} aria-label="Filters">
          <div className="sticky top-24 space-y-6 rounded-3xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Filters</h2>
              {activeFilters || category || term ? (
                <button type="button" onClick={clearAll} className="text-xs font-semibold text-primary hover:underline">
                  Clear all
                </button>
              ) : null}
            </div>

            {category ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold capitalize text-primary">
                {category}
                <button
                  type="button"
                  aria-label="Remove category filter"
                  onClick={() => navigate({ to: "/restaurants", search: { q: term || undefined } })}
                >
                  <X className="size-3" aria-hidden="true" />
                </button>
              </span>
            ) : null}

            <fieldset>
              <legend className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">Cuisine</legend>
              <div className="space-y-2">
                {cuisines.map((c) => (
                  <label key={c} className="flex cursor-pointer items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={cuisine.includes(c)}
                      onChange={() => toggle(cuisine, c, setCuisine)}
                      className="size-4 accent-[oklch(0.694_0.187_39.2)]"
                    />
                    {c}
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">Rating</legend>
              <div className="flex flex-wrap gap-2">
                {[4.5, 4, 3.5].map((r) => (
                  <button
                    key={r}
                    type="button"
                    aria-pressed={minRating === r}
                    onClick={() => setMinRating(minRating === r ? null : r)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                      minRating === r ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary",
                    )}
                  >
                    {r}+
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">Price</legend>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3].map((p) => (
                  <button
                    key={p}
                    type="button"
                    aria-pressed={priceLevels.includes(p)}
                    onClick={() => toggle(priceLevels, p, setPriceLevels)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                      priceLevels.includes(p) ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary",
                    )}
                  >
                    {"₹".repeat(p)}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">Delivery time</legend>
              <div className="flex flex-wrap gap-2">
                {[25, 35, 45].map((m) => (
                  <button
                    key={m}
                    type="button"
                    aria-pressed={maxDelivery === m}
                    onClick={() => setMaxDelivery(maxDelivery === m ? null : m)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                      maxDelivery === m ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary",
                    )}
                  >
                    Under {m} min
                  </button>
                ))}
              </div>
            </fieldset>

            <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold">
              <input
                type="checkbox"
                checked={vegOnly}
                onChange={(e) => setVegOnly(e.target.checked)}
                className="size-4 accent-[oklch(0.6_0.12_148)]"
              />
              Pure vegetarian only
            </label>
          </div>
        </aside>

        <div>
          <p className="mb-5 text-sm text-muted-foreground" aria-live="polite">
            Showing <strong className="text-foreground">{list.length}</strong> restaurant
            {list.length === 1 ? "" : "s"}
            {term ? ` for “${term}”` : ""}
          </p>

          {list.length ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {list.map((r) => (
                <RestaurantCard key={r.id} restaurant={r} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Store}
              title="No results found"
              description="We couldn't find restaurants matching your search and filters. Try removing a filter or searching for something else."
              action={
                <Button onClick={clearAll} className="rounded-full">
                  Clear filters
                </Button>
              }
            />
          )}

          {term && matchingDishes.length ? (
            <section className="mt-14" aria-labelledby="dish-results">
              <h2 id="dish-results" className="mb-6 text-2xl font-bold">
                Dishes matching “{term}”
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {matchingDishes.slice(0, 6).map((f) => (
                  <FoodCard key={f.id} food={f} />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}