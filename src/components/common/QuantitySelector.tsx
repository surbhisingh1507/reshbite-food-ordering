import { Minus, Plus } from "lucide-react";

export function QuantitySelector({
  qty,
  onChange,
  min = 1,
  label = "item",
}: {
  qty: number;
  onChange: (qty: number) => void;
  min?: number;
  label?: string;
}) {
  return (
    <div className="inline-flex items-center rounded-full border border-primary/30 bg-card">
      <button
        type="button"
        onClick={() => onChange(qty - 1)}
        disabled={qty <= min}
        aria-label={`Decrease quantity of ${label}`}
        className="grid size-9 place-items-center rounded-full text-primary transition-colors hover:bg-primary/10 disabled:opacity-40"
      >
        <Minus className="size-4" aria-hidden="true" />
      </button>
      <span className="w-8 text-center text-sm font-bold tabular-nums" aria-live="polite">
        {qty}
      </span>
      <button
        type="button"
        onClick={() => onChange(qty + 1)}
        aria-label={`Increase quantity of ${label}`}
        className="grid size-9 place-items-center rounded-full text-primary transition-colors hover:bg-primary/10"
      >
        <Plus className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}