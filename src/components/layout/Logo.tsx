import { Link } from "@tanstack/react-router";
import { UtensilsCrossed } from "lucide-react";

export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link to="/" className="flex shrink-0 items-center gap-2" aria-label="FreshBite home">
      <span className="grid size-9 place-items-center rounded-xl gradient-primary text-primary-foreground">
        <UtensilsCrossed className="size-5" aria-hidden="true" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-xl font-bold tracking-tight">
          Fresh<span className="text-primary">Bite</span>
        </span>
        <span
          className={
            inverted
              ? "text-[10px] text-primary-foreground/70"
              : "text-[10px] text-muted-foreground"
          }
        >
          Fresh food. Fast delivery.
        </span>
      </span>
    </Link>
  );
}