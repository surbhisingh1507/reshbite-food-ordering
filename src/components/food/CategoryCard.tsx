import { Link } from "@tanstack/react-router";
import type { Category } from "@/data/categories";
import { cn } from "@/lib/utils";

export function CategoryCard({ category }: { category: Category }) {
  const Icon = category.icon;
  return (
    <Link
      to="/restaurants"
      search={{ category: category.id }}
      className="group flex w-28 shrink-0 flex-col items-center gap-3 rounded-2xl p-3 transition-colors hover:bg-card sm:w-auto"
    >
      <span
        className={cn(
          "grid size-20 place-items-center rounded-full text-primary transition-transform duration-300 group-hover:-translate-y-1",
          category.tint,
        )}
      >
        <Icon className="size-8" aria-hidden="true" />
      </span>
      <span className="text-sm font-semibold">{category.name}</span>
    </Link>
  );
}