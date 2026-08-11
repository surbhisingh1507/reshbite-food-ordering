import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DietBadge } from "@/components/common/DietBadge";
import { Rating } from "@/components/common/Rating";
import { QuantitySelector } from "@/components/common/QuantitySelector";
import { FoodCard } from "@/components/food/FoodCard";
import { foods, getFood, type Food } from "@/data/foods";
import { getRestaurant } from "@/data/restaurants";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { inr } from "@/utils/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/food/$foodId")({
  loader: ({ params }) => {
    const food = getFood(Number(params.foodId));
    if (!food) throw notFound();
    return { food };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Dish not found — FreshBite" }, { name: "robots", content: "noindex" }] };
    }
    const { food } = loaderData;
    return {
      meta: [
        { title: `${food.name} — Order online on FreshBite` },
        { name: "description", content: food.description },
        { property: "og:title", content: `${food.name} — FreshBite` },
        { property: "og:description", content: food.description },
      ],
    };
  },
  component: ProductDetail,
  errorComponent: () => (
    <div className="container-page py-24 text-center">
      <h1 className="text-2xl font-bold">We couldn't load this dish</h1>
    </div>
  ),
  notFoundComponent: () => (
    <div className="container-page py-24 text-center">
      <h1 className="text-2xl font-bold">Dish not found</h1>
      <Button asChild className="mt-6 rounded-full">
        <Link to="/restaurants">Browse restaurants</Link>
      </Button>
    </div>
  ),
});

function ProductDetail() {
  const food = Route.useLoaderData().food as Food;
  const restaurant = getRestaurant(food.restaurantId);
  const { addItem } = useCart();
  const wishlist = useWishlist();
  const [qty, setQty] = useState(1);
  const saved = wishlist.has(food.id);

  const related = foods
    .filter((f) => f.id !== food.id && (f.category === food.category || f.restaurantId === food.restaurantId))
    .slice(0, 4);

  return (
    <div className="container-page py-12">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
        <Link to="/restaurants" className="hover:text-primary">
          Restaurants
        </Link>
        {restaurant ? (
          <>
            <span className="px-2">/</span>
            <Link
              to="/restaurant/$restaurantId"
              params={{ restaurantId: String(restaurant.id) }}
              className="hover:text-primary"
            >
              {restaurant.name}
            </Link>
          </>
        ) : null}
        <span className="px-2">/</span>
        <span className="text-foreground">{food.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <img
          src={food.image}
          alt={food.name}
          width={800}
          height={600}
          className="w-full rounded-3xl object-cover shadow-[var(--shadow-card)]"
        />

        <div>
          <div className="flex flex-wrap items-center gap-2">
            {food.tags.map((t) => (
              <DietBadge key={t} tag={t} />
            ))}
          </div>
          <h1 className="mt-4 text-3xl font-black sm:text-4xl">{food.name}</h1>
          {restaurant ? (
            <Link
              to="/restaurant/$restaurantId"
              params={{ restaurantId: String(restaurant.id) }}
              className="mt-2 inline-block text-sm font-semibold text-primary hover:underline"
            >
              {restaurant.name}
            </Link>
          ) : null}

          <div className="mt-4 flex items-center gap-4">
            <span className="text-3xl font-bold">{inr(food.price)}</span>
            <Rating value={food.rating} />
          </div>

          <p className="mt-5 leading-relaxed text-muted-foreground">{food.description}</p>

          <section className="mt-8">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Ingredients</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {food.ingredients.map((i) => (
                <li key={i} className="rounded-full bg-muted px-3 py-1 text-sm">
                  {i}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
              Nutritional information
            </h2>
            <dl className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                ["Calories", `${food.nutrition.calories} kcal`],
                ["Protein", `${food.nutrition.protein} g`],
                ["Carbs", `${food.nutrition.carbs} g`],
                ["Fat", `${food.nutrition.fat} g`],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-border bg-card p-4 text-center">
                  <dt className="text-xs text-muted-foreground">{label}</dt>
                  <dd className="mt-1 font-bold">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <QuantitySelector qty={qty} onChange={setQty} label={food.name} />
            <Button size="lg" className="rounded-full px-7" onClick={() => addItem(food.id, qty)}>
              <ShoppingBag className="size-4" aria-hidden="true" /> Add to Cart · {inr(food.price * qty)}
            </Button>
            <Button
              type="button"
              size="lg"
              variant="outline"
              aria-pressed={saved}
              onClick={() => wishlist.toggle(food.id)}
              className="rounded-full border-primary/40 text-primary hover:bg-primary/10"
            >
              <Heart className={cn("size-4", saved && "fill-primary")} aria-hidden="true" />
              {saved ? "Saved" : "Wishlist"}
            </Button>
          </div>
        </div>
      </div>

      {related.length ? (
        <section className="mt-20" aria-labelledby="related">
          <h2 id="related" className="mb-8 text-2xl font-bold">
            You may also like
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((f) => (
              <FoodCard key={f.id} food={f} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
