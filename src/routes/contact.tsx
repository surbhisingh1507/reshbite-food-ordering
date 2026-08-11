import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact FreshBite — We're here to help" },
      { name: "description", content: "Reach the FreshBite team by phone, email or the contact form. Support available daily." },
      { property: "og:title", content: "Contact FreshBite — We're here to help" },
      { property: "og:description", content: "Questions about an order or partnering with us? Get in touch." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (form.name.trim().length < 2) next["name"] = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next["email"] = "Enter a valid email address.";
    if (form.subject.trim().length < 3) next["subject"] = "Add a short subject.";
    if (form.message.trim().length < 10) next["message"] = "Message must be at least 10 characters.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setForm({ name: "", email: "", subject: "", message: "" });
      toast.success("Message sent! We'll reply within 24 hours.");
    }, 800);
  };

  return (
    <div className="container-page py-12">
      <header className="mb-10 max-w-2xl">
        <h1 className="text-3xl font-black sm:text-4xl">We'd love to hear from you</h1>
        <p className="mt-3 text-muted-foreground">
          Questions about an order, feedback on a restaurant, or interested in partnering with
          FreshBite? Send us a note.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[340px_minmax(0,1fr)]">
        <aside className="space-y-4">
          {[
            { icon: MapPin, title: "Address", value: "21 Basil Street, Sector 44, Bengaluru 560103" },
            { icon: Phone, title: "Phone", value: "+91 80001 23456" },
            { icon: Mail, title: "Email", value: "hello@freshbite.app" },
            { icon: Clock, title: "Opening hours", value: "Every day, 9:00 AM – 11:30 PM" },
          ].map((c) => (
            <div key={c.title} className="flex gap-4 rounded-3xl border border-border bg-card p-5">
              <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
                <c.icon className="size-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <h2 className="text-sm font-bold">{c.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{c.value}</p>
              </div>
            </div>
          ))}

          <div className="overflow-hidden rounded-3xl border border-border bg-card">
            <div
              className="relative h-56 bg-muted"
              role="img"
              aria-label="Illustrated map showing the FreshBite office in Bengaluru"
            >
              <div className="absolute inset-0 opacity-70 [background-image:linear-gradient(oklch(0.9_0.02_70)_1px,transparent_1px),linear-gradient(90deg,oklch(0.9_0.02_70)_1px,transparent_1px)] [background-size:28px_28px]" />
              <div className="absolute left-1/4 top-0 h-full w-6 bg-[oklch(0.94_0.03_76)]" />
              <div className="absolute left-0 top-2/3 h-5 w-full bg-[oklch(0.94_0.03_76)]" />
              <span className="absolute left-1/2 top-1/2 grid size-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full gradient-primary text-primary-foreground shadow-[var(--shadow-card)]">
                <MapPin className="size-5" aria-hidden="true" />
              </span>
            </div>
            <p className="p-4 text-xs text-muted-foreground">
              FreshBite HQ · Sector 44, Bengaluru — visitors welcome on weekdays.
            </p>
          </div>
        </aside>

        <form onSubmit={submit} noValidate className="rounded-3xl border border-border bg-card p-7">
          <h2 className="text-xl font-bold">Send us a message</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {([
              { id: "name", label: "Name", type: "text" },
              { id: "email", label: "Email", type: "email" },
            ] as const).map((f) => (
              <div key={f.id}>
                <Label htmlFor={f.id}>{f.label}</Label>
                <Input
                  id={f.id}
                  type={f.type}
                  value={form[f.id]}
                  onChange={(e) => setForm({ ...form, [f.id]: e.target.value })}
                  aria-invalid={!!errors[f.id]}
                  className="mt-1.5 rounded-xl"
                />
                {errors[f.id] ? <p className="mt-1 text-xs text-destructive">{errors[f.id]}</p> : null}
              </div>
            ))}
            <div className="sm:col-span-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                aria-invalid={!!errors["subject"]}
                className="mt-1.5 rounded-xl"
              />
              {errors["subject"] ? <p className="mt-1 text-xs text-destructive">{errors["subject"]}</p> : null}
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                rows={6}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                aria-invalid={!!errors["message"]}
                className="mt-1.5 rounded-2xl"
              />
              {errors["message"] ? <p className="mt-1 text-xs text-destructive">{errors["message"]}</p> : null}
            </div>
          </div>
          <Button type="submit" size="lg" disabled={sending} className="mt-6 rounded-full px-8">
            {sending ? "Sending…" : "Send Message"}
          </Button>
          {sent ? (
            <p className="mt-4 rounded-2xl bg-veg/10 px-4 py-3 text-sm font-semibold text-veg" role="status">
              Thanks! Your message is on its way — we reply within 24 hours.
            </p>
          ) : null}
        </form>
      </div>
    </div>
  );
}