import { useMemo, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Clock, IndianRupee, Leaf, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FoodCard } from "@/components/food/FoodCard";
import { getRestaurant } from "@/data/restaurants";
import { foodsByRestaurant, menuSections } from "@/data/foods";
import { inr } from "@/utils/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/restaurant/$restaurantId")({
  loader: ({ params }) => {
    const restaurant = getRestaurant(Number(params.restaurantId));
    if (!restaurant) throw notFound();
    return { restaurant };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Restaurant not found — FreshBite" }, { name: "robots", content: "noindex" }] };
    }
    const { restaurant } = loaderData;
    const description = `${restaurant.name} — ${restaurant.cuisine.join(", ")}. Order online on FreshBite, delivered in ${restaurant.deliveryTime}.`;
    return {
      meta: [
        { title: `${restaurant.name} Menu & Delivery — FreshBite` },
        { name: "description", content: description },
        { property: "og:title", content: `${restaurant.name} — FreshBite` },
        { property: "og:description", content: description },
      ],
    };
  },
  component: RestaurantMenu,
  errorComponent: () => (
    <div className="container-page py-24 text-center">
      <h1 className="text-2xl font-bold">We couldn't load this restaurant</h1>
      <p className="mt-2 text-muted-foreground">Please try again in a moment.</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="container-page py-24 text-center">
      <h1 className="text-2xl font-bold">Restaurant not found</h1>
      <p className="mt-2 text-muted-foreground">This kitchen may no longer deliver in your area.</p>
      <Button asChild className="mt-6 rounded-full">
        <Link to="/restaurants">Browse restaurants</Link>
      </Button>
    </div>
  ),
});

function RestaurantMenu() {
  const { restaurant } = Route.useLoaderData();
  const menu = foodsByRestaurant(restaurant.id);
  const [active, setActive] = useState("Recommended");

  const sections = useMemo(() => {
    const available = menuSections.filter((s) => s === "Recommended" || menu.some((f) => f.section === s));
    return available;
  }, [menu]);

  const visible =
    active === "Recommended"
      ? menu.filter((f) => f.section === "Recommended" || f.popular || f.rating >= 4.5)
      : menu.filter((f) => f.section === active);

  return (
    <div>
      <div className="relative h-64 w-full overflow-hidden sm:h-80">
        <img
          src={restaurant.image}
          alt={`Signature dish at ${restaurant.name}`}
          width={800}
          height={600}
          className="size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.256_0.036_45)]/90 to-transparent" />
      </div>

      <div className="container-page -mt-24 relative pb-10">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)] sm:p-8">
          <div className="grid gap-4 sm:flex sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h1 className="text-3xl font-black sm:text-4xl">{restaurant.name}</h1>
              <p className="mt-2 text-sm text-muted-foreground">{restaurant.cuisine.join(" • ")}</p>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">{restaurant.description}</p>
              <p className="mt-3 text-xs text-muted-foreground">{restaurant.address}</p>
            </div>
            {restaurant.pureVeg ? (
              <span className="inline-flex h-fit items-center gap-1 rounded-full bg-veg/10 px-3 py-1.5 text-xs font-bold text-veg">
                <Leaf className="size-3.5" aria-hidden="true" /> Pure Veg
              </span>
            ) : null}
          </div>

          <dl className="mt-6 grid grid-cols-3 divide-x divide-border rounded-2xl bg-muted/60 p-4 text-center">
            <div>
              <dt className="text-xs text-muted-foreground">Rating</dt>
              <dd className="mt-1 flex items-center justify-center gap-1 font-bold">
                <Star className="size-4 fill-veg text-veg" aria-hidden="true" />
                {restaurant.rating}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Delivery</dt>
              <dd className="mt-1 flex items-center justify-center gap-1 font-bold">
                <Clock className="size-4 text-primary" aria-hidden="true" />
                {restaurant.deliveryTime}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">For two</dt>
              <dd className="mt-1 flex items-center justify-center gap-1 font-bold">
                <IndianRupee className="size-4 text-primary" aria-hidden="true" />
                {inr(restaurant.priceForTwo).replace("₹", "")}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="container-page pb-20">
        <nav aria-label="Menu categories" className="mb-8 flex gap-2 overflow-x-auto pb-2">
          {sections.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setActive(s)}
              aria-current={active === s}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                active === s
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card hover:border-primary hover:text-primary",
              )}
            >
              {s}
            </button>
          ))}
        </nav>

        <h2 className="mb-6 text-2xl font-bold">{active}</h2>
        {visible.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((f) => (
              <FoodCard key={f.id} food={f} />
            ))}
          </div>
        ) : (
          <p className="rounded-3xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
            Nothing in this section yet — try another category.
          </p>
        )}
      </div>
    </div>
  );
}
