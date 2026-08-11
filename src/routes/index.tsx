import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgePercent, Clock, ShieldCheck, Sparkles, Store } from "lucide-react";
import heroImage from "@/assets/hero.jpg";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Stars } from "@/components/common/Rating";
import { CategoryCard } from "@/components/food/CategoryCard";
import { FoodCard } from "@/components/food/FoodCard";
import { RestaurantCard } from "@/components/restaurant/RestaurantCard";
import { categories } from "@/data/categories";
import { restaurants } from "@/data/restaurants";
import { foods } from "@/data/foods";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FreshBite — Delicious food, delivered to your door" },
      {
        name: "description",
        content:
          "Order from top local restaurants on FreshBite. Fresh food, fast delivery and offers on every first order.",
      },
      { property: "og:title", content: "FreshBite — Delicious food, delivered to your door" },
      {
        property: "og:description",
        content: "Discover restaurants, browse menus and order your favourite meals on FreshBite.",
      },
    ],
  }),
  component: Home,
});

const features = [
  { icon: Sparkles, title: "Fresh & Quality Food", text: "Every partner kitchen is audited for hygiene and ingredient quality." },
  { icon: Clock, title: "Fast Delivery", text: "Average delivery in 28 minutes with live temperature-safe packaging." },
  { icon: Store, title: "Trusted Restaurants", text: "600+ hand-picked local kitchens, rated by real FreshBite diners." },
  { icon: ShieldCheck, title: "Secure Checkout", text: "Encrypted, PCI-compliant payments with easy refunds if things go wrong." },
];

const testimonials = [
  { name: "Ananya Rao", city: "Bengaluru", text: "FreshBite made ordering dinner incredibly easy. The food arrived hot and fresh!" },
  { name: "Rahul Mehta", city: "Pune", text: "The biryani was still steaming when it reached me. Tracking and support are excellent." },
  { name: "Sara Khan", city: "Mumbai", text: "I love the wishlist. I save dishes I want to try and order them on the weekend." },
  { name: "Dev Patel", city: "Ahmedabad", text: "Coupons actually work and the checkout takes under a minute. Best delivery app I use." },
];

function Home() {
  const featured = restaurants.slice(0, 4);
  const popular = foods.filter((f) => f.popular).slice(0, 8);

  return (
    <>
      <section className="gradient-hero overflow-hidden">
        <div className="container-page grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
          <div className="animate-rise">
            <span className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary shadow-[var(--shadow-soft)]">
              <Sparkles className="size-3.5" aria-hidden="true" /> Fresh food. Fast delivery.
            </span>
            <h1 className="mt-6 text-4xl font-black leading-[1.05] sm:text-5xl lg:text-6xl">
              Delicious food, <span className="text-primary">delivered</span> to your door.
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              Discover your favorite meals from the best local restaurants and get them delivered
              fresh and fast.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full px-7">
                <Link to="/restaurants">
                  Explore Restaurants <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full border-primary/40 bg-card px-7 text-primary hover:bg-primary/10">
                <Link to="/restaurant/$restaurantId" params={{ restaurantId: "1" }}>
                  View Menu
                </Link>
              </Button>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4">
              {[
                ["600+", "Restaurants"],
                ["28 min", "Avg delivery"],
                ["4.7★", "Diner rating"],
              ].map(([value, label]) => (
                <div key={label}>
                  <dt className="text-2xl font-bold text-primary">{value}</dt>
                  <dd className="text-xs text-muted-foreground">{label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative animate-rise">
            <div className="absolute -inset-6 -z-10 rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />
            <img
              src={heroImage}
              alt="An overhead spread of pizza, burgers, biryani and noodles ready to be delivered"
              width={1200}
              height={1200}
              className="w-full rounded-[2.5rem] object-cover shadow-[var(--shadow-lift)]"
            />
            <div className="absolute -bottom-5 left-5 hidden items-center gap-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-card)] sm:flex">
              <span className="grid size-10 place-items-center rounded-xl bg-veg/10 text-veg">
                <Clock className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-bold">Arriving in 24 min</p>
                <p className="text-xs text-muted-foreground">Order #FB20260810001</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-16" aria-labelledby="categories-heading">
        <h2 id="categories-heading" className="mb-8 text-2xl font-bold sm:text-3xl">
          What are you craving?
        </h2>
        <div className="-mx-1 flex gap-2 overflow-x-auto pb-2 sm:mx-0 sm:grid sm:grid-cols-4 sm:overflow-visible lg:grid-cols-8">
          {categories.map((c) => (
            <CategoryCard key={c.id} category={c} />
          ))}
        </div>
      </section>

      <section className="container-page py-8" aria-labelledby="featured-heading">
        <SectionHeading
          eyebrow="Handpicked"
          title="Featured restaurants"
          description="Top-rated kitchens near you, chosen by FreshBite's food team."
          action={
            <Button asChild variant="outline" className="rounded-full border-primary/40 text-primary hover:bg-primary/10">
              <Link to="/restaurants">View all restaurants</Link>
            </Button>
          }
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
        </div>
      </section>

      <section className="container-page py-16" aria-labelledby="popular-heading">
        <SectionHeading eyebrow="Trending now" title="Popular dishes" description="The meals FreshBite diners reorder the most this week." />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {popular.map((f) => (
            <FoodCard key={f.id} food={f} />
          ))}
        </div>
      </section>

      <section className="container-page py-8" aria-labelledby="offers-heading">
        <SectionHeading eyebrow="Save more" title="Special offers" description="Use these codes at checkout — they really work." />
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { title: "20% OFF", sub: "On your first order", code: "WELCOME20", tone: "gradient-primary text-primary-foreground" },
            { title: "FREE DELIVERY", sub: "On orders above ₹499", code: "Automatic", tone: "bg-card" },
            { title: "COMBO DEAL", sub: "Save more with selected meals", code: "FRESH50", tone: "bg-card" },
          ].map((offer) => (
            <article
              key={offer.title}
              className={`card-lift flex flex-col gap-3 rounded-3xl border border-border p-7 ${offer.tone}`}
            >
              <BadgePercent className="size-7" aria-hidden="true" />
              <h3 className="text-2xl font-black">{offer.title}</h3>
              <p className="text-sm opacity-85">{offer.sub}</p>
              <p className="mt-2 text-xs font-bold uppercase tracking-widest opacity-75">
                Code: {offer.code}
              </p>
              <Button
                asChild
                variant={offer.tone.includes("gradient") ? "secondary" : "default"}
                className="mt-4 w-fit rounded-full"
              >
                <Link to="/restaurants">Order now</Link>
              </Button>
            </article>
          ))}
        </div>
      </section>

      <section className="container-page py-16" aria-labelledby="why-heading">
        <SectionHeading eyebrow="Why FreshBite?" title="Built around your next great meal" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <article key={f.title} className="card-lift rounded-3xl border border-border bg-card p-7">
              <span className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                <f.icon className="size-6" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-lg font-bold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container-page pb-8" aria-labelledby="reviews-heading">
        <SectionHeading eyebrow="Loved by diners" title="What our customers say" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t) => (
            <blockquote key={t.name} className="card-lift flex h-full flex-col rounded-3xl border border-border bg-card p-7">
              <Stars />
              <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">“{t.text}”</p>
              <footer className="mt-6 flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-full gradient-primary font-bold text-primary-foreground">
                  {t.name.charAt(0)}
                </span>
                <div>
                  <p className="text-sm font-bold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.city}</p>
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>
    </>
  );
}
