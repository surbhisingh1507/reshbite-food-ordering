export const inr = (amount: number) =>
  `₹${Math.round(amount).toLocaleString("en-IN")}`;

export const priceSymbol = (level: 1 | 2 | 3) => "₹".repeat(level);

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });