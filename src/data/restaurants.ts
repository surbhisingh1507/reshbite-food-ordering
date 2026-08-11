import pizza from "@/assets/dish-pizza.jpg";
import burger from "@/assets/dish-burger.jpg";
import biryani from "@/assets/dish-biryani.jpg";
import paneer from "@/assets/dish-paneer.jpg";
import noodles from "@/assets/dish-noodles.jpg";
import dessert from "@/assets/dish-dessert.jpg";
import salad from "@/assets/dish-salad.jpg";

export type Restaurant = {
  id: number;
  name: string;
  image: string;
  cuisine: string[];
  categories: string[];
  rating: number;
  reviews: number;
  priceForTwo: number;
  priceLevel: 1 | 2 | 3;
  deliveryMinutes: number;
  deliveryTime: string;
  pureVeg: boolean;
  description: string;
  address: string;
};

export const restaurants: Restaurant[] = [
  {
    id: 1,
    name: "Spice Garden",
    image: paneer,
    cuisine: ["Indian", "North Indian"],
    categories: ["indian", "biryani"],
    rating: 4.6,
    reviews: 2140,
    priceForTwo: 400,
    priceLevel: 2,
    deliveryMinutes: 30,
    deliveryTime: "25-30 min",
    pureVeg: false,
    description:
      "Slow-cooked curries, clay-oven kebabs and fresh tandoori breads made by chefs from Amritsar. A neighbourhood favourite for over a decade.",
    address: "12 Marigold Lane, Green Park",
  },
  {
    id: 2,
    name: "Napoli Woodfire",
    image: pizza,
    cuisine: ["Italian", "Pizza"],
    categories: ["pizza"],
    rating: 4.7,
    reviews: 3320,
    priceForTwo: 650,
    priceLevel: 3,
    deliveryMinutes: 35,
    deliveryTime: "30-35 min",
    pureVeg: false,
    description:
      "Naples-style pizza baked at 450°C in a wood-fired oven, using 48-hour fermented dough and imported San Marzano tomatoes.",
    address: "5 Cobbler Street, Bandra West",
  },
  {
    id: 3,
    name: "The Burger Yard",
    image: burger,
    cuisine: ["Fast Food", "American"],
    categories: ["burgers"],
    rating: 4.3,
    reviews: 1890,
    priceForTwo: 350,
    priceLevel: 1,
    deliveryMinutes: 25,
    deliveryTime: "20-25 min",
    pureVeg: false,
    description:
      "Smashed patties, brioche buns and hand-cut fries. Everything is griddled to order in an open kitchen you can smell from the street.",
    address: "88 Yard Road, Indiranagar",
  },
  {
    id: 4,
    name: "Biryani House",
    image: biryani,
    cuisine: ["Indian", "Biryani", "Hyderabadi"],
    categories: ["biryani", "indian"],
    rating: 4.5,
    reviews: 4210,
    priceForTwo: 500,
    priceLevel: 2,
    deliveryMinutes: 40,
    deliveryTime: "35-40 min",
    pureVeg: false,
    description:
      "Dum-cooked biryani sealed in copper handis with long-grain basmati, hand-pounded spices and saffron from Kashmir.",
    address: "22 Charminar Cross, Banjara Hills",
  },
  {
    id: 5,
    name: "Wok & Roll",
    image: noodles,
    cuisine: ["Chinese", "Asian"],
    categories: ["chinese"],
    rating: 4.2,
    reviews: 1260,
    priceForTwo: 450,
    priceLevel: 2,
    deliveryMinutes: 30,
    deliveryTime: "25-30 min",
    pureVeg: false,
    description:
      "High-flame wok cooking with house-made sauces. Expect proper smoky 'wok hei' in every bowl of noodles and rice.",
    address: "3 Lantern Square, Koramangala",
  },
  {
    id: 6,
    name: "Green Bowl Kitchen",
    image: salad,
    cuisine: ["Healthy", "Salads"],
    categories: ["healthy"],
    rating: 4.8,
    reviews: 980,
    priceForTwo: 550,
    priceLevel: 2,
    deliveryMinutes: 25,
    deliveryTime: "20-25 min",
    pureVeg: true,
    description:
      "Calorie-counted grain bowls, cold-pressed juices and seasonal produce sourced from farms within 60 km of the city.",
    address: "17 Orchard Walk, Powai",
  },
  {
    id: 7,
    name: "Sugar & Spoon",
    image: dessert,
    cuisine: ["Desserts", "Bakery"],
    categories: ["desserts", "beverages"],
    rating: 4.6,
    reviews: 1520,
    priceForTwo: 300,
    priceLevel: 1,
    deliveryMinutes: 20,
    deliveryTime: "15-20 min",
    pureVeg: true,
    description:
      "A tiny dessert atelier making lava cakes, slow-churned gelato and single-origin hot chocolate every morning.",
    address: "9 Vanilla Court, Civil Lines",
  },
  {
    id: 8,
    name: "Casa Mexicana",
    image: burger,
    cuisine: ["Mexican", "Fast Food"],
    categories: ["burgers", "healthy"],
    rating: 4.1,
    reviews: 760,
    priceForTwo: 700,
    priceLevel: 3,
    deliveryMinutes: 45,
    deliveryTime: "40-45 min",
    pureVeg: false,
    description:
      "Street-style tacos, loaded burrito bowls and salsas ground fresh on a volcanic stone molcajete.",
    address: "44 Sol Avenue, Aundh",
  },
];

export const getRestaurant = (id: number) => restaurants.find((r) => r.id === id);