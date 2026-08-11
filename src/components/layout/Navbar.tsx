import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Heart, LogOut, Menu, Search, ShoppingBag, User as UserIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/layout/Logo";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";

const links = [
  { to: "/", label: "Home" },
  { to: "/restaurants", label: "Restaurants" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { count } = useCart();
  const { ids } = useWishlist();
  const { user, logout } = useAuth();

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setOpen(false);
    navigate({ to: "/restaurants", search: { q: query || undefined, category: undefined } });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur">
      <nav className="container-page flex h-18 items-center gap-4 py-3" aria-label="Main">
        <Logo />

        <ul className="ml-6 hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                activeOptions={{ exact: l.to === "/" }}
                activeProps={{ className: "bg-primary/10 text-primary" }}
                className="rounded-full px-4 py-2 text-sm font-semibold text-foreground/80 transition-colors hover:text-primary"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <form onSubmit={submitSearch} className="ml-auto hidden max-w-xs flex-1 md:block" role="search">
          <label htmlFor="nav-search" className="sr-only">
            Search restaurants and dishes
          </label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              id="nav-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search food or restaurants"
              className="rounded-full bg-card pl-9"
            />
          </div>
        </form>

        <div className="ml-auto flex items-center gap-1 md:ml-2">
          <Link
            to="/wishlist"
            aria-label={`Wishlist, ${ids.length} items`}
            className="relative grid size-10 place-items-center rounded-full transition-colors hover:bg-primary/10 hover:text-primary"
          >
            <Heart className="size-5" aria-hidden="true" />
            {ids.length > 0 ? <Badge value={ids.length} /> : null}
          </Link>
          <Link
            to="/cart"
            aria-label={`Cart, ${count} items`}
            className="relative grid size-10 place-items-center rounded-full transition-colors hover:bg-primary/10 hover:text-primary"
          >
            <ShoppingBag className="size-5" aria-hidden="true" />
            {count > 0 ? <Badge value={count} /> : null}
          </Link>

          {user ? (
            <div className="hidden items-center gap-1 sm:flex">
              <Link
                to="/account"
                className="flex items-center gap-2 rounded-full bg-card px-3 py-2 text-sm font-semibold transition-colors hover:text-primary"
              >
                <span className="grid size-6 place-items-center rounded-full gradient-primary text-xs text-primary-foreground">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className="max-w-24 truncate">{user.name}</span>
              </Link>
              <button
                type="button"
                onClick={logout}
                aria-label="Log out"
                className="grid size-10 place-items-center rounded-full transition-colors hover:bg-primary/10 hover:text-primary"
              >
                <LogOut className="size-4" aria-hidden="true" />
              </button>
            </div>
          ) : (
            <Button asChild size="sm" className="ml-1 hidden rounded-full sm:inline-flex">
              <Link to="/login">
                <UserIcon className="size-4" aria-hidden="true" /> Login
              </Link>
            </Button>
          )}

          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid size-10 place-items-center rounded-full transition-colors hover:bg-primary/10 hover:text-primary lg:hidden"
          >
            {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          </button>
        </div>
      </nav>

      {open ? (
        <div id="mobile-nav" className="border-t border-border bg-background lg:hidden">
          <div className="container-page space-y-3 py-4">
            <form onSubmit={submitSearch} role="search" className="md:hidden">
              <label htmlFor="mobile-search" className="sr-only">
                Search restaurants and dishes
              </label>
              <Input
                id="mobile-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search food or restaurants"
                className="rounded-full bg-card"
              />
            </form>
            <ul className="grid gap-1">
              {links.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    onClick={() => setOpen(false)}
                    activeOptions={{ exact: l.to === "/" }}
                    activeProps={{ className: "bg-primary/10 text-primary" }}
                    className="block rounded-xl px-4 py-3 text-sm font-semibold"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to={user ? "/account" : "/login"}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-3 text-sm font-semibold"
                >
                  {user ? "My Account" : "Login / Register"}
                </Link>
              </li>
              {user ? (
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setOpen(false);
                    }}
                    className="block w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-primary"
                  >
                    Log out
                  </button>
                </li>
              ) : null}
            </ul>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function Badge({ value }: { value: number }) {
  return (
    <span className="absolute -right-0.5 -top-0.5 grid min-w-5 place-items-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground">
      {value}
    </span>
  );
}