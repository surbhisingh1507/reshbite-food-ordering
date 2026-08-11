import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, MapPin, Package, Trash2, UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmptyState } from "@/components/common/EmptyState";
import { FoodCard } from "@/components/food/FoodCard";
import { useAuth, type Address } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { getFood } from "@/data/foods";
import { formatDate, inr } from "@/utils/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "My Account — FreshBite" },
      { name: "description", content: "Manage your FreshBite profile, order history, saved addresses and wishlist." },
      { property: "og:title", content: "My Account — FreshBite" },
      { property: "og:description", content: "Profile, orders, addresses and saved dishes in one dashboard." },
    ],
  }),
  component: AccountPage,
});

const emptyAddress = (): Address => ({
  id: "",
  label: "Home",
  fullName: "",
  phone: "",
  line: "",
  city: "",
  state: "",
  pin: "",
});

const tabs = [
  { id: "profile", label: "Profile", icon: UserIcon },
  { id: "orders", label: "Order History", icon: Package },
  { id: "addresses", label: "Saved Addresses", icon: MapPin },
  { id: "wishlist", label: "Wishlist", icon: Heart },
] as const;

const statusStyles: Record<string, string> = {
  Preparing: "bg-gold/20 text-foreground",
  "Out for Delivery": "bg-primary/15 text-primary",
  Delivered: "bg-veg/15 text-veg",
  Cancelled: "bg-destructive/10 text-destructive",
};

function AccountPage() {
  const { user, hydrated, orders, addresses, updateProfile, saveAddress, deleteAddress, logout } = useAuth();
  const { ids } = useWishlist();
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("profile");
  const [profile, setProfile] = useState({ name: "", email: "", phone: "" });
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Address | null>(null);

  if (hydrated && !user) {
    return (
      <div className="container-page py-20">
        <EmptyState
          icon={UserIcon}
          title="You're not logged in"
          description="Log in or create an account to see your orders, addresses and saved dishes."
          action={
            <Button asChild className="rounded-full">
              <Link to="/login">Login to FreshBite</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const startEdit = () => {
    setProfile({ name: user?.name ?? "", email: user?.email ?? "", phone: user?.phone ?? "" });
    setEditing(true);
  };

  return (
    <div className="container-page py-12">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl gradient-primary text-lg font-bold text-primary-foreground">
            {(user?.name ?? "G").charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-black sm:text-3xl">Hi, {user?.name}</h1>
            <p className="truncate text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>
        <Button variant="outline" onClick={logout} className="rounded-full border-primary/40 text-primary">
          Log out
        </Button>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
        <nav aria-label="Account sections" className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              aria-current={tab === t.id}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition-colors",
                tab === t.id ? "bg-primary text-primary-foreground" : "bg-card hover:text-primary",
              )}
            >
              <t.icon className="size-4" aria-hidden="true" /> {t.label}
            </button>
          ))}
        </nav>

        <div>
          {tab === "profile" ? (
            <section className="rounded-3xl border border-border bg-card p-7">
              <h2 className="text-xl font-bold">Profile</h2>
              {editing ? (
                <form
                  className="mt-6 grid gap-4 sm:grid-cols-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    updateProfile(profile);
                    setEditing(false);
                  }}
                >
                  {(["name", "email", "phone"] as const).map((k) => (
                    <div key={k}>
                      <Label htmlFor={k} className="capitalize">
                        {k}
                      </Label>
                      <Input
                        id={k}
                        value={profile[k]}
                        onChange={(e) => setProfile({ ...profile, [k]: e.target.value })}
                        className="mt-1.5 rounded-xl"
                      />
                    </div>
                  ))}
                  <div className="sm:col-span-2 flex gap-2">
                    <Button type="submit" className="rounded-full">
                      Save changes
                    </Button>
                    <Button type="button" variant="outline" className="rounded-full" onClick={() => setEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <>
                  <dl className="mt-6 grid gap-4 sm:grid-cols-3">
                    {[
                      ["Name", user?.name],
                      ["Email", user?.email],
                      ["Phone", user?.phone || "Not added"],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-2xl bg-muted/60 p-4">
                        <dt className="text-xs text-muted-foreground">{label}</dt>
                        <dd className="mt-1 truncate font-semibold">{value}</dd>
                      </div>
                    ))}
                  </dl>
                  <Button onClick={startEdit} className="mt-6 rounded-full">
                    Edit profile
                  </Button>
                </>
              )}
            </section>
          ) : null}

          {tab === "orders" ? (
            <section className="space-y-4">
              <h2 className="text-xl font-bold">Order history</h2>
              {orders.length ? (
                orders.map((o) => (
                  <article key={o.id} className="rounded-3xl border border-border bg-card p-6">
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate font-bold">{o.restaurant}</h3>
                        <p className="text-xs text-muted-foreground">
                          {o.id} · {formatDate(o.date)}
                        </p>
                      </div>
                      <span className={cn("rounded-full px-3 py-1 text-xs font-bold", statusStyles[o.status])}>
                        {o.status}
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">
                      {o.items.map((i) => `${i.name} × ${i.qty}`).join(", ")}
                    </p>
                    <p className="mt-3 font-bold">{inr(o.total)}</p>
                  </article>
                ))
              ) : (
                <EmptyState
                  icon={Package}
                  title="No orders yet"
                  description="Once you place an order it will show up here with live status."
                  action={
                    <Button asChild className="rounded-full">
                      <Link to="/restaurants">Start ordering</Link>
                    </Button>
                  }
                />
              )}
            </section>
          ) : null}

          {tab === "addresses" ? (
            <section className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-bold">Saved addresses</h2>
                <Button className="rounded-full" onClick={() => setDraft({ ...emptyAddress(), id: crypto.randomUUID() })}>
                  Add address
                </Button>
              </div>

              {draft ? (
                <form
                  className="grid gap-4 rounded-3xl border border-border bg-card p-6 sm:grid-cols-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    saveAddress(draft);
                    setDraft(null);
                  }}
                >
                  {(["fullName", "phone", "line", "city", "state", "pin"] as const).map((k) => (
                    <div key={k} className={k === "line" ? "sm:col-span-2" : ""}>
                      <Label htmlFor={`addr-${k}`} className="capitalize">
                        {k === "line" ? "Address" : k === "fullName" ? "Full name" : k}
                      </Label>
                      <Input
                        id={`addr-${k}`}
                        required
                        value={draft[k]}
                        onChange={(e) => setDraft({ ...draft, [k]: e.target.value })}
                        className="mt-1.5 rounded-xl"
                      />
                    </div>
                  ))}
                  <div className="sm:col-span-2 flex flex-wrap gap-2">
                    {(["Home", "Work", "Other"] as const).map((l) => (
                      <button
                        key={l}
                        type="button"
                        aria-pressed={draft.label === l}
                        onClick={() => setDraft({ ...draft, label: l })}
                        className={cn(
                          "rounded-full border px-4 py-1.5 text-sm font-semibold",
                          draft.label === l ? "border-primary bg-primary text-primary-foreground" : "border-border",
                        )}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                  <div className="sm:col-span-2 flex gap-2">
                    <Button type="submit" className="rounded-full">
                      Save address
                    </Button>
                    <Button type="button" variant="outline" className="rounded-full" onClick={() => setDraft(null)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : null}

              {addresses.length ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {addresses.map((a) => (
                    <article key={a.id} className="rounded-3xl border border-border bg-card p-6">
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">{a.label}</span>
                      <h3 className="mt-3 font-bold">{a.fullName}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {a.line}, {a.city}, {a.state} {a.pin}
                      </p>
                      <p className="text-sm text-muted-foreground">{a.phone}</p>
                      <div className="mt-4 flex gap-3 text-sm font-semibold">
                        <button type="button" onClick={() => setDraft(a)} className="text-primary hover:underline">
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteAddress(a.id)}
                          className="inline-flex items-center gap-1 text-destructive hover:underline"
                        >
                          <Trash2 className="size-3.5" aria-hidden="true" /> Delete
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              ) : draft ? null : (
                <EmptyState
                  icon={MapPin}
                  title="No saved addresses"
                  description="Save an address to check out faster next time."
                />
              )}
            </section>
          ) : null}

          {tab === "wishlist" ? (
            <section>
              <h2 className="mb-4 text-xl font-bold">Wishlist</h2>
              {ids.length ? (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {ids.map((id) => {
                    const food = getFood(id);
                    return food ? <FoodCard key={id} food={food} compact /> : null;
                  })}
                </div>
              ) : (
                <EmptyState
                  icon={Heart}
                  title="Nothing saved yet"
                  description="Tap the heart on a dish to keep it here for later."
                  action={
                    <Button asChild className="rounded-full">
                      <Link to="/restaurants">Find dishes</Link>
                    </Button>
                  }
                />
              )}
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}