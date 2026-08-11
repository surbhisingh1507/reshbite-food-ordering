import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/EmptyState";
import { FoodCard } from "@/components/food/FoodCard";
import { useWishlist } from "@/context/WishlistContext";
import { getFood } from "@/data/foods";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Your Wishlist — FreshBite" },
      { name: "description", content: "All the FreshBite dishes you saved for later, in one place." },
      { property: "og:title", content: "Your Wishlist — FreshBite" },
      { property: "og:description", content: "Saved dishes you can add to your cart any time." },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const { ids } = useWishlist();
  const saved = ids.map(getFood).filter(Boolean);

  return (
    <div className="container-page py-12">
      <h1 className="mb-8 text-3xl font-black sm:text-4xl">Your wishlist</h1>
      {saved.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {saved.map((food) => (food ? <FoodCard key={food.id} food={food} /> : null))}
        </div>
      ) : (
        <EmptyState
          icon={Heart}
          title="No saved dishes yet"
          description="Tap the heart on any dish to save it here for later cravings."
          action={
            <Button asChild className="rounded-full">
              <Link to="/restaurants">Find something tasty</Link>
            </Button>
          }
        />
      )}
    </div>
  );
}