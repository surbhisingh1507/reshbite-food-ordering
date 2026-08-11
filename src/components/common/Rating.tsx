import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Rating({
  value,
  reviews,
  className,
}: {
  value: number;
  reviews?: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-veg/10 px-2 py-0.5 text-xs font-semibold text-veg",
        className,
      )}
    >
      <Star className="size-3 fill-current" aria-hidden="true" />
      {value.toFixed(1)}
      {reviews ? (
        <span className="font-medium text-muted-foreground">({reviews.toLocaleString("en-IN")})</span>
      ) : null}
      <span className="sr-only">out of 5 stars</span>
    </span>
  );
}

export function Stars({ value = 5 }: { value?: number }) {
  return (
    <span className="inline-flex gap-0.5 text-gold" aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={cn("size-4", i < value ? "fill-current" : "opacity-30")} aria-hidden="true" />
      ))}
    </span>
  );
}