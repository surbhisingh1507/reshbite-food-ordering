import { createFileRoute } from "@tanstack/react-router";
import { Award, Heart, Leaf, Target } from "lucide-react";
import heroImage from "@/assets/hero.jpg";
import { SectionHeading } from "@/components/common/SectionHeading";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About FreshBite — Food brings people together" },
      { name: "description", content: "The story, mission and team behind FreshBite, a modern food ordering platform." },
      { property: "og:title", content: "About FreshBite — Food brings people together" },
      { property: "og:description", content: "Our story, mission, values, team and awards." },
    ],
  }),
  component: AboutPage,
});

const team = [
  { name: "Meera Iyer", role: "Founder & CEO", bio: "Former restaurant operator who wanted ordering to feel as warm as dining in." },
  { name: "Arjun Nair", role: "Head of Product", bio: "Obsessed with shaving seconds off checkout without losing the joy." },
  { name: "Priya Sharma", role: "Head of Partnerships", bio: "Finds the neighbourhood kitchens everyone should know about." },
  { name: "Kabir Shah", role: "Head of Delivery", bio: "Builds routing that keeps food hot and riders treated fairly." },
];

function AboutPage() {
  return (
    <div className="pb-10">
      <section className="gradient-hero">
        <div className="container-page grid items-center gap-10 py-16 lg:grid-cols-2">
          <div>
            <h1 className="text-4xl font-black sm:text-5xl">Food brings people together.</h1>
            <p className="mt-5 text-muted-foreground">
              FreshBite started in 2021 with one small kitchen, one scooter and a stubborn belief:
              ordering food online should feel personal. Today we connect 600+ independent restaurants
              with hungry people across eight cities — without ever losing the neighbourhood feeling
              we started with.
            </p>
            <p className="mt-4 text-muted-foreground">
              We pay partner kitchens fairly, package food to arrive hot, and design every screen so
              that finding dinner takes under a minute.
            </p>
          </div>
          <img
            src={heroImage}
            alt="A shared table of freshly prepared dishes"
            loading="lazy"
            width={1200}
            height={1200}
            className="w-full rounded-[2.5rem] object-cover shadow-[var(--shadow-lift)]"
          />
        </div>
      </section>

      <section className="container-page py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: Target, title: "Our Mission", text: "Make great local food accessible in minutes, at prices that work for diners and kitchens alike." },
            { icon: Leaf, title: "Our Vision", text: "A delivery network where freshness, fairness and sustainability are the default, not the premium." },
            { icon: Heart, title: "Our Values", text: "Honesty in pricing, respect for riders, obsession with quality, and warmth in every interaction." },
          ].map((c) => (
            <article key={c.title} className="card-lift rounded-3xl border border-border bg-card p-7">
              <span className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                <c.icon className="size-6" aria-hidden="true" />
              </span>
              <h2 className="mt-5 text-xl font-bold">{c.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{c.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container-page py-8">
        <SectionHeading eyebrow="The people" title="Meet the FreshBite team" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((m) => (
            <article key={m.name} className="card-lift rounded-3xl border border-border bg-card p-7 text-center">
              <span className="mx-auto grid size-16 place-items-center rounded-full gradient-primary text-xl font-bold text-primary-foreground">
                {m.name.charAt(0)}
              </span>
              <h3 className="mt-4 text-lg font-bold">{m.name}</h3>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">{m.role}</p>
              <p className="mt-3 text-sm text-muted-foreground">{m.bio}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container-page py-16">
        <SectionHeading eyebrow="Recognition" title="Awards & achievements" />
        <div className="grid gap-6 md:grid-cols-3">
          {[
            ["Best Food Delivery Experience", "Indian Digital Commerce Awards, 2025"],
            ["Customer Choice Award", "FoodTech India, 2024"],
            ["Best Local Food Platform", "Urban Dining Guide, 2023"],
          ].map(([title, sub]) => (
            <article key={title} className="rounded-3xl border border-border bg-card p-7">
              <Award className="size-7 text-gold" aria-hidden="true" />
              <h3 className="mt-4 text-lg font-bold">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{sub}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container-page grid gap-8 md:grid-cols-2">
        <article id="privacy" className="rounded-3xl border border-border bg-card p-7">
          <h2 className="text-xl font-bold">Privacy Policy</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            FreshBite is a demonstration project. All account details, addresses and orders you create
            are stored only in your own browser's local storage. Nothing is sent to a server and no
            data is shared with third parties.
          </p>
        </article>
        <article id="terms" className="rounded-3xl border border-border bg-card p-7">
          <h2 className="text-xl font-bold">Terms &amp; Conditions</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Restaurants, dishes, prices and payments shown here are fictional and provided for
            portfolio purposes. Placing an order simulates the experience only — no real food is
            prepared and no payment is ever processed.
          </p>
        </article>
      </section>
    </div>
  );
}