import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-secondary">
      <div className="marketplace-container py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <span className="text-xl font-bold text-primary">
              W<span className="text-accent">Y</span>O
            </span>
            <p className="mt-3 text-sm text-muted-foreground">
              Zambia's trusted online marketplace. Buy and sell with confidence.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Shop</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/products" className="hover:text-foreground">All Products</Link></li>
              <li><Link to="/products?category=Electronics" className="hover:text-foreground">Electronics</Link></li>
              <li><Link to="/products?category=Fashion" className="hover:text-foreground">Fashion</Link></li>
              <li><Link to="/products?category=Home+%26+Garden" className="hover:text-foreground">Home & Garden</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Account</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/login" className="hover:text-foreground">Sign In</Link></li>
              <li><Link to="/register" className="hover:text-foreground">Register</Link></li>
              <li><Link to="/cart" className="hover:text-foreground">My Cart</Link></li>
              <li><Link to="/wishlist" className="hover:text-foreground">Wishlist</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/help" className="hover:text-foreground">Help Centre</Link></li>
              <li><Link to="/shipping" className="hover:text-foreground">Shipping Info</Link></li>
              <li><Link to="/returns" className="hover:text-foreground">Returns</Link></li>
              <li><Link to="/contact" className="hover:text-foreground">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} WYO. All rights reserved. Lusaka, Zambia.</p>
          <p className="mt-1">Payments: Mobile Money (MTN, Airtel, Zamtel) · Cash on Delivery</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
