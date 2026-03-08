import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="bg-primary text-primary-foreground">
      <div className="marketplace-container py-12 md:py-20">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold leading-tight md:text-5xl">
            Shop Zambia's <span className="text-accent">Best Deals</span>
          </h1>
          <p className="mt-4 text-base text-primary-foreground/80 md:text-lg">
            Discover thousands of products from electronics to fashion. Safe payments with Mobile Money. Delivery across Zambia.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/products">
              <Button variant="hero" size="lg" className="gap-2">
                Shop Now <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="outline" size="lg" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
