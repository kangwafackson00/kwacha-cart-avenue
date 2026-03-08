import { Link } from "react-router-dom";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/lib/mock-data";
import { formatPrice } from "@/lib/mock-data";
import { useCart } from "@/lib/cart-context";

const ProductCard = ({ product }: { product: Product }) => {
  const { addItem } = useCart();

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-md">
      <Link to={`/product/${product.id}`} className="relative aspect-square overflow-hidden bg-secondary">
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {product.condition === "Used" && (
          <Badge className="absolute left-2 top-2 bg-warning text-warning-foreground">Used</Badge>
        )}
        {product.inventory <= 3 && product.inventory > 0 && (
          <Badge variant="destructive" className="absolute right-2 top-2">Only {product.inventory} left</Badge>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-3">
        <Link to={`/product/${product.id}`}>
          <h3 className="line-clamp-2 text-sm font-medium text-foreground hover:text-accent transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="mt-1 flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-accent text-accent" />
          <span className="text-xs text-muted-foreground">
            {product.rating} ({product.reviewCount})
          </span>
        </div>
        <div className="mt-auto pt-2">
          <p className="text-lg font-bold text-foreground">{formatPrice(product.price)}</p>
          <p className="text-xs text-success">
            {product.inventory > 0 ? "In Stock" : "Out of Stock"}
          </p>
        </div>
        <div className="mt-2 flex gap-1">
          <Button
            variant="accent"
            size="sm"
            className="flex-1 gap-1 text-xs"
            onClick={(e) => {
              e.preventDefault();
              addItem(product);
            }}
            disabled={product.inventory === 0}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            Add to Cart
          </Button>
          <Button variant="outline" size="icon" className="h-9 w-9 shrink-0">
            <Heart className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
