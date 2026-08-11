import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — FreshBite" },
      { name: "description", content: "Sign in to FreshBite to track orders, save addresses and reorder favourites." },
      { property: "og:title", content: "Login — FreshBite" },
      { property: "og:description", content: "Sign in to your FreshBite account." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login, continueAsGuest } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next["email"] = "Enter a valid email address.";
    if (form.password.length < 6) next["password"] = "Password must be at least 6 characters.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setLoading(true);
    setTimeout(() => {
      login(form.email, form.password);
      setLoading(false);
      navigate({ to: "/account" });
    }, 600);
  };

  return (
    <div className="container-page grid place-items-center py-16">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-card)]">
        <h1 className="text-3xl font-black">Welcome back</h1>
        <p className="mt-2 text-sm text-muted-foreground">Log in to order faster and track deliveries.</p>

        <form onSubmit={submit} className="mt-8 space-y-5" noValidate>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              aria-invalid={!!errors["email"]}
              className="mt-1.5 rounded-xl"
              placeholder="you@example.com"
            />
            {errors["email"] ? <p className="mt-1 text-xs text-destructive">{errors["email"]}</p> : null}
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              aria-invalid={!!errors["password"]}
              className="mt-1.5 rounded-xl"
              placeholder="••••••••"
            />
            {errors["password"] ? <p className="mt-1 text-xs text-destructive">{errors["password"]}</p> : null}
          </div>
          <Button type="submit" size="lg" disabled={loading} className="w-full rounded-full">
            {loading ? "Signing in…" : "Login"}
          </Button>
          <Button
            type="button"
            size="lg"
            variant="outline"
            className="w-full rounded-full border-primary/40 text-primary hover:bg-primary/10"
            onClick={() => {
              continueAsGuest();
              navigate({ to: "/restaurants" });
            }}
          >
            Continue as Guest
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          New to FreshBite?{" "}
          <Link to="/register" className="font-semibold text-primary hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}