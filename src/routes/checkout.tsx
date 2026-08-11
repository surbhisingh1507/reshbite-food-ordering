import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmptyState } from "@/components/common/EmptyState";
import { OrderSummary } from "@/routes/cart";
import { useCart } from "@/context/CartContext";
import { useAuth, type Address, type Order } from "@/context/AuthContext";
import { getFood } from "@/data/foods";
import { getRestaurant } from "@/data/restaurants";
import { inr } from "@/utils/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — FreshBite" },
      { name: "description", content: "Confirm your delivery address, timing and payment method on FreshBite." },
      { property: "og:title", content: "Checkout — FreshBite" },
      { property: "og:description", content: "Complete your FreshBite order in a few taps." },
    ],
  }),
  component: CheckoutPage,
});

const payments = ["Cash on Delivery", "Credit/Debit Card", "UPI", "Wallet"] as const;

function CheckoutPage() {
  const { items, totals, clearCart } = useCart();
  const { addresses, saveAddress, addOrder } = useAuth();
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    line: "",
    city: "",
    state: "",
    pin: "",
    label: "Home" as Address["label"],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [timing, setTiming] = useState<"asap" | "later">("asap");
  const [slot, setSlot] = useState("");
  const [payment, setPayment] = useState<(typeof payments)[number]>("Cash on Delivery");
  const [placing, setPlacing] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);

  const set = (key: string, value: string) => setForm({ ...form, [key]: value });

  const useSaved = (a: Address) =>
    setForm({
      fullName: a.fullName,
      phone: a.phone,
      line: a.line,
      city: a.city,
      state: a.state,
      pin: a.pin,
      label: a.label,
    });

  const placeOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (form.fullName.trim().length < 2) next["fullName"] = "Enter your full name.";
    if (!/^[0-9+\s-]{10,15}$/.test(form.phone)) next["phone"] = "Enter a valid phone number.";
    if (form.line.trim().length < 6) next["line"] = "Enter your street address.";
    if (!form.city.trim()) next["city"] = "City is required.";
    if (!form.state.trim()) next["state"] = "State is required.";
    if (!/^[0-9]{6}$/.test(form.pin)) next["pin"] = "PIN code must be 6 digits.";
    if (timing === "later" && !slot) next["slot"] = "Choose a delivery slot.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setPlacing(true);
    const address: Address = { id: crypto.randomUUID(), ...form };
    saveAddress(address);

    const first = items[0] ? getFood(items[0].foodId) : undefined;
    const created: Order = {
      id: `FB${new Date().toISOString().slice(0, 10).replace(/-/g, "")}${String(
        Math.floor(Math.random() * 900) + 100,
      )}`,
      date: new Date().toISOString(),
      restaurant: first ? (getRestaurant(first.restaurantId)?.name ?? "FreshBite") : "FreshBite",
      items: items.map((l) => {
        const f = getFood(l.foodId);
        return { name: f?.name ?? "Item", qty: l.qty, price: f?.price ?? 0 };
      }),
      total: totals.total,
      status: "Preparing",
      address: `${form.line}, ${form.city}, ${form.state} ${form.pin}`,
      payment,
      eta: timing === "asap" ? "25-35 min" : slot,
    };

    setTimeout(() => {
      addOrder(created);
      setOrder(created);
      clearCart();
      setPlacing(false);
    }, 900);
  };

  if (order) {
    return (
      <div className="container-page py-16">
        <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-card p-8 text-center shadow-[var(--shadow-card)]">
          <CheckCircle2 className="mx-auto size-14 text-veg" aria-hidden="true" />
          <h1 className="mt-5 text-3xl font-black">Order Confirmed! 🎉</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Order ID <strong className="text-foreground">{order.id}</strong>
          </p>
          <dl className="mt-8 space-y-3 rounded-2xl bg-muted/60 p-6 text-left text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Restaurant</dt>
              <dd className="font-semibold">{order.restaurant}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Items</dt>
              <dd className="text-right font-semibold">
                {order.items.map((i) => `${i.name} × ${i.qty}`).join(", ")}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Total paid</dt>
              <dd className="font-semibold">{inr(order.total)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Delivery address</dt>
              <dd className="text-right font-semibold">{order.address}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Estimated delivery</dt>
              <dd className="font-semibold">{order.eta}</dd>
            </div>
          </dl>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild className="rounded-full">
              <Link to="/account">Track in my orders</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full border-primary/40 text-primary">
              <Link to="/restaurants">Order something else</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-page py-20">
        <EmptyState
          icon={ShoppingBag}
          title="Nothing to check out"
          description="Add a few dishes to your cart before heading to checkout."
          action={
            <Button asChild className="rounded-full">
              <Link to="/restaurants">Browse restaurants</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const fields = [
    { id: "fullName", label: "Full Name", type: "text" },
    { id: "phone", label: "Phone", type: "tel" },
    { id: "line", label: "Address", type: "text" },
    { id: "city", label: "City", type: "text" },
    { id: "state", label: "State", type: "text" },
    { id: "pin", label: "PIN Code", type: "text" },
  ] as const;

  return (
    <div className="container-page py-12">
      <h1 className="mb-8 text-3xl font-black sm:text-4xl">Checkout</h1>
      <form onSubmit={placeOrder} noValidate className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <section className="rounded-3xl border border-border bg-card p-6">
            <h2 className="text-lg font-bold">Delivery address</h2>
            {addresses.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {addresses.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => useSaved(a)}
                    className="rounded-2xl border border-border px-4 py-2 text-left text-xs hover:border-primary"
                  >
                    <strong>{a.label}</strong> · {a.line}, {a.city}
                  </button>
                ))}
              </div>
            ) : null}
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {fields.map((f) => (
                <div key={f.id} className={f.id === "line" ? "sm:col-span-2" : ""}>
                  <Label htmlFor={f.id}>{f.label}</Label>
                  <Input
                    id={f.id}
                    type={f.type}
                    value={form[f.id]}
                    onChange={(e) => set(f.id, e.target.value)}
                    aria-invalid={!!errors[f.id]}
                    className="mt-1.5 rounded-xl"
                  />
                  {errors[f.id] ? <p className="mt-1 text-xs text-destructive">{errors[f.id]}</p> : null}
                </div>
              ))}
            </div>
            <fieldset className="mt-5">
              <legend className="text-sm font-semibold">Address type</legend>
              <div className="mt-2 flex gap-2">
                {(["Home", "Work", "Other"] as const).map((l) => (
                  <button
                    key={l}
                    type="button"
                    aria-pressed={form.label === l}
                    onClick={() => setForm({ ...form, label: l })}
                    className={cn(
                      "rounded-full border px-4 py-1.5 text-sm font-semibold",
                      form.label === l ? "border-primary bg-primary text-primary-foreground" : "border-border",
                    )}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </fieldset>
          </section>

          <section className="rounded-3xl border border-border bg-card p-6">
            <h2 className="text-lg font-bold">Delivery time</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setTiming("asap")}
                aria-pressed={timing === "asap"}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-semibold",
                  timing === "asap" ? "border-primary bg-primary text-primary-foreground" : "border-border",
                )}
              >
                ASAP — 25–35 min
              </button>
              <button
                type="button"
                onClick={() => setTiming("later")}
                aria-pressed={timing === "later"}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-semibold",
                  timing === "later" ? "border-primary bg-primary text-primary-foreground" : "border-border",
                )}
              >
                Schedule for later
              </button>
            </div>
            {timing === "later" ? (
              <div className="mt-4">
                <Label htmlFor="slot">Pick a slot</Label>
                <select
                  id="slot"
                  value={slot}
                  onChange={(e) => setSlot(e.target.value)}
                  className="mt-1.5 h-11 w-full rounded-xl border border-border bg-background px-4 text-sm"
                >
                  <option value="">Select a time slot</option>
                  {["Today, 7:00 PM", "Today, 8:30 PM", "Tomorrow, 12:30 PM", "Tomorrow, 7:00 PM"].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                {errors["slot"] ? <p className="mt-1 text-xs text-destructive">{errors["slot"]}</p> : null}
              </div>
            ) : null}
          </section>

          <section className="rounded-3xl border border-border bg-card p-6">
            <h2 className="text-lg font-bold">Payment method</h2>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {payments.map((p) => (
                <label
                  key={p}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold",
                    payment === p ? "border-primary bg-primary/5" : "border-border",
                  )}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={p}
                    checked={payment === p}
                    onChange={() => setPayment(p)}
                    className="accent-[oklch(0.694_0.187_39.2)]"
                  />
                  {p}
                </label>
              ))}
            </div>
            {payment === "Credit/Debit Card" ? (
              <div className="mt-4 grid gap-3 rounded-2xl bg-muted/60 p-4 sm:grid-cols-3">
                <Input placeholder="Card number (simulated)" className="rounded-xl sm:col-span-3" />
                <Input placeholder="MM/YY" className="rounded-xl" />
                <Input placeholder="CVV" className="rounded-xl" />
                <Input placeholder="Name on card" className="rounded-xl" />
              </div>
            ) : null}
            {payment === "UPI" ? (
              <div className="mt-4 rounded-2xl bg-muted/60 p-4">
                <Input placeholder="yourname@upi (simulated)" className="rounded-xl" />
                <p className="mt-2 text-xs text-muted-foreground">
                  This is a demo checkout — no real payment is processed.
                </p>
              </div>
            ) : null}
          </section>
        </div>

        <aside className="space-y-5 self-start rounded-3xl border border-border bg-card p-6 lg:sticky lg:top-24">
          <h2 className="text-lg font-bold">Order summary</h2>
          <ul className="space-y-2 text-sm">
            {items.map((l) => {
              const f = getFood(l.foodId);
              if (!f) return null;
              return (
                <li key={l.foodId} className="flex justify-between gap-3 text-muted-foreground">
                  <span className="truncate">
                    {f.name} × {l.qty}
                  </span>
                  <span className="font-semibold text-foreground">{inr(f.price * l.qty)}</span>
                </li>
              );
            })}
          </ul>
          <OrderSummary showTitle={false} />
          <Button type="submit" size="lg" disabled={placing} className="w-full rounded-full">
            {placing ? "Placing order…" : `Place Order · ${inr(totals.total)}`}
          </Button>
        </aside>
      </form>
    </div>
  );
}