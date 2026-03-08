import { Link } from "react-router-dom";
import { Smartphone, Shirt, Home, Car, Dumbbell, BookOpen } from "lucide-react";
import { categories } from "@/lib/mock-data";

const iconMap: Record<string, React.ReactNode> = {
  Smartphone: <Smartphone className="h-6 w-6" />,
  Shirt: <Shirt className="h-6 w-6" />,
  Home: <Home className="h-6 w-6" />,
  Car: <Car className="h-6 w-6" />,
  Dumbbell: <Dumbbell className="h-6 w-6" />,
  BookOpen: <BookOpen className="h-6 w-6" />,
};

const CategoryGrid = () => {
  return (
    <section className="marketplace-container py-10">
      <h2 className="mb-6 text-xl font-bold md:text-2xl">Shop by Category</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/products?category=${encodeURIComponent(cat.name)}`}
            className="flex flex-col items-center gap-2 rounded-lg border border-border bg-card p-4 text-center transition-all hover:border-accent hover:shadow-sm"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-accent">
              {iconMap[cat.icon]}
            </div>
            <span className="text-sm font-medium">{cat.name}</span>
            <span className="text-xs text-muted-foreground">{cat.productCount} items</span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;
