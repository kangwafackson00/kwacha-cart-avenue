import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { products } from "@/lib/mock-data";
import ProductCard from "@/components/product/ProductCard";

const FeaturedProducts = () => {
  const featured = products.filter((p) => p.featured).slice(0, 8);

  return (
    <section className="marketplace-container py-10">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold md:text-2xl">Featured Products</h2>
        <Link to="/products" className="flex items-center gap-1 text-sm font-medium text-accent hover:underline">
          View All <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {featured.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;
