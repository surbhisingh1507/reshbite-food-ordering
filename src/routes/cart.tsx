import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/common/EmptyState";
import { QuantitySelector } from "@/components/common/QuantitySelector";
import { useCart } from "@/context/CartContext";
import { getFood } from "@/data/foods";
import { getRestaurant } from "@/data/restaurants";
import { inr } from "@/utils/format";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — FreshBite" },
      { name: "description", content: "Review your FreshBite order, apply a coupon and checkout." },
      { property: "og:title", content: "Your Cart — FreshBite" },
      { property: "og:description", content: "Review your order and checkout in minutes." },
    ],
  }),
  component: CartPage,
});

export function OrderSummary({ showTitle = true }: { showTitle?: boolean }) {
  const { totals } = useCart();
  const rows = [
    ["Subtotal", inr(totals.subtotal)],
    ["Delivery Fee", totals.deliveryFee === 0 ? "FREE" : inr(totals.deliveryFee)],
    ["Taxes (5%)", inr(totals.taxes)],
  ] as const;
  return (
    <div className="space-y-3 text-sm">
      {showTitle ? <h2 className="text-lg font-bold">Bill details</h2> : null}
      {rows.map(([label, value]) => (
        <div key={label} className="flex justify-between text-muted-foreground">
          <span>{label}</span>
          <span className="font-semibold text-foreground">{value}</span>
        </div>
      ))}
      {totals.discount > 0 ? (
        <div className="flex justify-between text-veg">
          <span>Discount</span>
          <span className="font-semibold">-{inr(totals.discount)}</span>
        </div>
      ) : null}
      <div className="flex justify-between border-t border-border pt-3 text-lg font-bold">
        <span>Total</span>
        <span>{inr(totals.total)}</span>
      </div>
    </div>
  );
}

function CartPage() {
  const { items, hydrated, setQty, removeItem, coupon, applyCoupon, removeCoupon } = useCart();
  const [code, setCode] = useState("");

  if (hydrated && items.length === 0) {
    return (
      <div className="container-page py-20">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Looks like you haven't added anything yet. Browse restaurants and find something delicious."
          action={
            <Button asChild className="rounded-full">
              <Link to="/restaurants">Explore restaurants</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="container-page py-12">
      <h1 className="mb-8 text-3xl font-black sm:text-4xl">Your cart</h1>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <ul className="space-y-4">
          {items.map((line) => {
            const food = getFood(line.foodId);
            if (!food) return null;
            const restaurant = getRestaurant(food.restaurantId);
            return (
              <li
                key={line.foodId}
                className="grid grid-cols-[80px_minmax(0,1fr)] gap-4 rounded-3xl border border-border bg-card p-4 sm:grid-cols-[96px_minmax(0,1fr)_auto] sm:items-center"
              >
                <img
                  src={food.image}
                  alt={food.name}
                  loading="lazy"
                  width={800}
                  height={600}
                  className="size-20 rounded-2xl object-cover sm:size-24"
                />
                <div className="min-w-0">
                  <h2 className="truncate font-bold">
                    <Link to="/food/$foodId" params={{ foodId: String(food.id) }} className="hover:text-primary">
                      {food.name}
                    </Link>
                  </h2>
                  <p className="truncate text-xs text-muted-foreground">{restaurant?.name}</p>
                  <p className="mt-2 font-semibold">{inr(food.price * line.qty)}</p>
                  <p className="text-xs text-muted-foreground">{inr(food.price)} each</p>
                </div>
                <div className="col-span-2 flex items-center justify-between gap-3 sm:col-span-1 sm:flex-col sm:items-end">
                  <QuantitySelector
                    qty={line.qty}
                    onChange={(q) => setQty(line.foodId, q)}
                    label={food.name}
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(line.foodId)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-destructive hover:underline"
                  >
                    <Trash2 className="size-3.5" aria-hidden="true" /> Remove
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

        <aside className="space-y-5 self-start rounded-3xl border border-border bg-card p-6 lg:sticky lg:top-24">
          <div>
            <label htmlFor="coupon" className="text-sm font-bold">
              Apply coupon
            </label>
            <p className="mb-2 text-xs text-muted-foreground">Try WELCOME20 or FRESH50</p>
            <div className="flex gap-2">
              <Input
                id="coupon"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Coupon code"
                className="rounded-full"
              />
              <Button type="button" disabled={!code.trim()} onClick={() => applyCoupon(code)} className="rounded-full">
                Apply
              </Button>
            </div>
            {coupon ? (
              <p className="mt-3 flex items-center justify-between rounded-xl bg-veg/10 px-3 py-2 text-xs font-semibold text-veg">
                {coupon} applied
                <button type="button" onClick={removeCoupon} className="underline">
                  Remove
                </button>
              </p>
            ) : null}
          </div>

          <OrderSummary />

          <Button asChild size="lg" className="w-full rounded-full">
            <Link to="/checkout">Proceed to checkout</Link>
          </Button>
        </aside>
      </div>
    </div>
  );
}