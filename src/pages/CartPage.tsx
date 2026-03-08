import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Trash2, ShoppingCart, ArrowRight } from "lucide-react";

const CartPage = () => {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <MainLayout>
        <div className="marketplace-container flex flex-col items-center justify-center py-20 text-center">
          <ShoppingCart className="mb-4 h-16 w-16 text-muted-foreground/40" />
          <h1 className="text-2xl font-bold">Your cart is empty</h1>
          <p className="mt-2 text-muted-foreground">Browse our products and find something you love!</p>
          <Link to="/products">
            <Button variant="accent" className="mt-6 gap-2">
              Start Shopping <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="marketplace-container py-6">
        <h1 className="mb-6 text-2xl font-bold">Shopping Cart ({totalItems} items)</h1>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Cart items */}
          <div className="space-y-3 lg:col-span-2">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex gap-4 rounded-lg border border-border bg-card p-4">
                <Link to={`/product/${product.id}`} className="h-20 w-20 shrink-0 overflow-hidden rounded-md bg-secondary">
                  <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                </Link>
                <div className="flex flex-1 flex-col">
                  <Link to={`/product/${product.id}`}>
                    <h3 className="text-sm font-medium hover:text-accent">{product.name}</h3>
                  </Link>
                  <p className="text-xs text-muted-foreground">{product.condition}</p>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center rounded-md border border-border">
                      <button className="px-2 py-1 text-xs hover:bg-secondary" onClick={() => updateQuantity(product.id, quantity - 1)}>−</button>
                      <span className="min-w-[1.5rem] text-center text-xs font-medium">{quantity}</span>
                      <button className="px-2 py-1 text-xs hover:bg-secondary" onClick={() => updateQuantity(product.id, quantity + 1)}>+</button>
                    </div>
                    <p className="font-bold">{formatPrice(product.price * quantity)}</p>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeItem(product.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="mb-4 text-lg font-bold">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-success">{totalPrice >= 500 ? "Free" : formatPrice(50)}</span>
              </div>
              <hr className="my-3" />
              <div className="flex justify-between text-base font-bold">
                <span>Total</span>
                <span>{formatPrice(totalPrice + (totalPrice >= 500 ? 0 : 50))}</span>
              </div>
            </div>
            <Link to="/login">
              <Button variant="accent" className="mt-6 w-full gap-2" size="lg">
                Proceed to Checkout <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Sign in to complete your purchase
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CartPage;
