import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter, UtensilsCrossed } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 bg-[oklch(0.256_0.036_45)] text-[oklch(0.95_0.01_80)]">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-xl gradient-primary text-primary-foreground">
              <UtensilsCrossed className="size-5" aria-hidden="true" />
            </span>
            <span className="font-display text-xl font-bold">
              Fresh<span className="text-primary">Bite</span>
            </span>
          </div>
          <p className="mt-4 text-sm opacity-80">Fresh food. Fast delivery. Happy bites.</p>
          <div className="mt-5 flex gap-2">
            {[
              { Icon: Instagram, label: "Instagram" },
              { Icon: Facebook, label: "Facebook" },
              { Icon: Twitter, label: "Twitter" },
            ].map(({ Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={`FreshBite on ${label}`}
                className="grid size-9 place-items-center rounded-full bg-white/10 transition-colors hover:bg-primary"
              >
                <Icon className="size-4" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        <nav aria-label="Footer">
          <h2 className="text-sm font-bold uppercase tracking-widest opacity-70">Explore</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              { to: "/", label: "Home" },
              { to: "/restaurants", label: "Restaurants" },
              { to: "/about", label: "About" },
              { to: "/contact", label: "Contact" },
            ].map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="opacity-80 transition-opacity hover:opacity-100 hover:text-primary">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest opacity-70">Legal</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link to="/about" hash="privacy" className="opacity-80 hover:text-primary">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/about" hash="terms" className="opacity-80 hover:text-primary">
                Terms &amp; Conditions
              </Link>
            </li>
            <li>
              <Link to="/contact" className="opacity-80 hover:text-primary">
                Help &amp; Support
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest opacity-70">Contact</h2>
          <ul className="mt-4 space-y-3 text-sm opacity-80">
            <li className="flex gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              21 Basil Street, Sector 44, Bengaluru 560103
            </li>
            <li className="flex gap-2">
              <Phone className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              <a href="tel:+918000123456">+91 80001 23456</a>
            </li>
            <li className="flex gap-2">
              <Mail className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              <a href="mailto:hello@freshbite.app">hello@freshbite.app</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <p className="container-page py-6 text-center text-xs opacity-70">
          © {new Date().getFullYear()} FreshBite. A fictional food ordering platform.
        </p>
      </div>
    </footer>
  );
}