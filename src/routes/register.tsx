import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create your account — FreshBite" },
      { name: "description", content: "Join FreshBite to save addresses, build a wishlist and order in one tap." },
      { property: "og:title", content: "Create your account — FreshBite" },
      { property: "og:description", content: "Join FreshBite in under a minute." },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const set = (key: string, value: string) => setForm({ ...form, [key]: value });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (form.name.trim().length < 2) next["name"] = "Please enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next["email"] = "Enter a valid email address.";
    if (!/^[0-9+\s-]{10,15}$/.test(form.phone)) next["phone"] = "Enter a valid phone number.";
    if (form.password.length < 6) next["password"] = "Password must be at least 6 characters.";
    if (form.password !== form.confirm) next["confirm"] = "Passwords do not match.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setLoading(true);
    setTimeout(() => {
      register({ name: form.name, email: form.email, phone: form.phone, password: form.password });
      setLoading(false);
      navigate({ to: "/account" });
    }, 600);
  };

  const fields = [
    { id: "name", label: "Full Name", type: "text", placeholder: "Ananya Rao" },
    { id: "email", label: "Email", type: "email", placeholder: "you@example.com" },
    { id: "phone", label: "Phone", type: "tel", placeholder: "+91 98765 43210" },
    { id: "password", label: "Password", type: "password", placeholder: "••••••••" },
    { id: "confirm", label: "Confirm Password", type: "password", placeholder: "••••••••" },
  ] as const;

  return (
    <div className="container-page grid place-items-center py-16">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-card)]">
        <h1 className="text-3xl font-black">Create your account</h1>
        <p className="mt-2 text-sm text-muted-foreground">Fresh food. Fast delivery. Happy bites.</p>

        <form onSubmit={submit} className="mt-8 space-y-4" noValidate>
          {fields.map((f) => (
            <div key={f.id}>
              <Label htmlFor={f.id}>{f.label}</Label>
              <Input
                id={f.id}
                type={f.type}
                placeholder={f.placeholder}
                value={form[f.id]}
                onChange={(e) => set(f.id, e.target.value)}
                aria-invalid={!!errors[f.id]}
                className="mt-1.5 rounded-xl"
              />
              {errors[f.id] ? <p className="mt-1 text-xs text-destructive">{errors[f.id]}</p> : null}
            </div>
          ))}
          <Button type="submit" size="lg" disabled={loading} className="w-full rounded-full">
            {loading ? "Creating account…" : "Create account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}