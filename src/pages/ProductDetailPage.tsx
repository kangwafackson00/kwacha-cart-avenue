import { useParams, Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { products, formatPrice } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/lib/cart-context";
import { Star, ShoppingCart, Heart, Truck, Shield, ArrowLeft } from "lucide-react";
import { useState } from "react";
import ProductCard from "@/components/product/ProductCard";

const ProductDetailPage = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <MainLayout>
        <div className="marketplace-container py-20 text-center">
          <p className="text-lg">Product not found</p>
          <Link to="/products">
            <Button variant="accent" className="mt-4">Back to Products</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <MainLayout>
      <div className="marketplace-container py-6">
        <Link to="/products" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to products
        </Link>

        <div className="mt-4 grid gap-8 md:grid-cols-2">
          {/* Image */}
          <div className="aspect-square overflow-hidden rounded-lg border border-border bg-secondary">
            <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
          </div>

          {/* Details */}
          <div>
            <Badge variant="secondary">{product.category}</Badge>
            <h1 className="mt-2 text-2xl font-bold md:text-3xl">{product.name}</h1>

            <div className="mt-2 flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-accent text-accent" : "text-border"}`} />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>

            <p className="mt-4 text-3xl font-bold text-foreground">{formatPrice(product.price)}</p>

            <div className="mt-2 flex items-center gap-2">
              <Badge variant={product.condition === "New" ? "default" : "secondary"}>
                {product.condition}
              </Badge>
              <span className={`text-sm font-medium ${product.inventory > 0 ? "text-success" : "text-destructive"}`}>
                {product.inventory > 0 ? `${product.inventory} in stock` : "Out of stock"}
              </span>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{product.description}</p>

            {/* Quantity & Add to Cart */}
            <div className="mt-6 flex items-center gap-3">
              <div className="flex items-center rounded-md border border-border">
                <button className="px-3 py-2 text-sm hover:bg-secondary" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                <span className="min-w-[2.5rem] text-center text-sm font-medium">{quantity}</span>
                <button className="px-3 py-2 text-sm hover:bg-secondary" onClick={() => setQuantity(Math.min(product.inventory, quantity + 1))}>+</button>
              </div>
              <Button
                variant="accent"
                size="lg"
                className="flex-1 gap-2"
                onClick={() => addItem(product, quantity)}
                disabled={product.inventory === 0}
              >
                <ShoppingCart className="h-4 w-4" /> Add to Cart
              </Button>
              <Button variant="outline" size="lg">
                <Heart className="h-4 w-4" />
              </Button>
            </div>

            {/* Trust signals */}
            <div className="mt-6 space-y-2 rounded-lg border border-border p-4">
              <div className="flex items-center gap-2 text-sm">
                <Truck className="h-4 w-4 text-accent" />
                <span>Delivery across Zambia • Free over ZMW 500</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-accent" />
                <span>Secure checkout • Mobile Money accepted</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-4 text-xl font-bold">Related Products</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </MainLayout>
  );
};

export default ProductDetailPage;
