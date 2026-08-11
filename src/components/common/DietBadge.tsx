import { cn } from "@/lib/utils";
import type { DietTag } from "@/data/foods";

const styles: Record<DietTag, string> = {
  Veg: "border-veg/40 text-veg bg-veg/10",
  "Non-Veg": "border-nonveg/40 text-nonveg bg-nonveg/10",
  "Gluten-Free": "border-border text-muted-foreground bg-muted",
  Spicy: "border-primary/40 text-primary bg-primary/10",
};

export function DietBadge({ tag, className }: { tag: DietTag; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold",
        styles[tag],
        className,
      )}
    >
      {tag}
    </span>
  );
}

export function VegDot({ veg }: { veg: boolean }) {
  return (
    <span
      className={cn(
        "grid size-4 shrink-0 place-items-center rounded-[3px] border",
        veg ? "border-veg" : "border-nonveg",
      )}
      aria-label={veg ? "Vegetarian" : "Non-vegetarian"}
      role="img"
    >
      <span className={cn("size-2 rounded-full", veg ? "bg-veg" : "bg-nonveg")} />
    </span>
  );
}