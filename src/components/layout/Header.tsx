import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, User, Menu, Heart, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { categories } from "@/lib/mock-data";

const Header = () => {
  const { totalItems } = useCart();
  const { user, isAdmin, isStaff, signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      {/* Top bar */}
      <div className="bg-primary">
        <div className="marketplace-container flex items-center justify-between py-1.5 text-xs text-primary-foreground">
          <span>🇿🇲 Zambia's Marketplace — Free delivery on orders over ZMW 500</span>
          <div className="hidden items-center gap-4 sm:flex">
            <Link to="/products" className="hover:underline">Sell</Link>
            <Link to="/help" className="hover:underline">Help</Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="marketplace-container flex items-center gap-4 py-3">
        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <nav className="mt-8 flex flex-col gap-2">
              <Link to="/" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary">Home</Link>
              <Link to="/products" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary">All Products</Link>
              {categories.map((cat) => (
                <Link key={cat.id} to={`/products?category=${encodeURIComponent(cat.name)}`} className="rounded-md px-3 py-2 text-sm hover:bg-secondary">
                  {cat.name}
                </Link>
              ))}
              <hr className="my-2" />
              {user ? (
                <>
                  <Link to="/dashboard" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary">My Account</Link>
                  {isAdmin && <Link to="/admin" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary">Admin</Link>}
                  <button onClick={handleSignOut} className="rounded-md px-3 py-2 text-left text-sm font-medium hover:bg-secondary">Sign Out</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary">Sign In</Link>
                  <Link to="/register" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary">Register</Link>
                </>
              )}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <span className="text-2xl font-bold tracking-tight text-primary">
            W<span className="text-accent">Y</span>O
          </span>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="hidden flex-1 sm:flex">
          <div className="flex w-full max-w-2xl">
            <Input
              placeholder="Search for anything..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-r-none border-r-0 focus-visible:ring-0"
            />
            <Button type="submit" variant="accent" className="rounded-l-none px-6">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </form>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Link to="/wishlist">
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Heart className="h-5 w-5" />
            </Button>
          </Link>
          <Link to="/cart" className="relative">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hidden gap-2 sm:flex">
                  <User className="h-4 w-4" />
                  <span className="max-w-[100px] truncate">{user.email?.split("@")[0]}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate("/dashboard")}>My Account</DropdownMenuItem>
                {isAdmin && <DropdownMenuItem onClick={() => navigate("/admin")}>Admin Dashboard</DropdownMenuItem>}
                {isStaff && <DropdownMenuItem onClick={() => navigate("/admin")}>Staff Dashboard</DropdownMenuItem>}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login" className="hidden sm:block">
              <Button variant="ghost" size="sm" className="gap-2">
                <User className="h-4 w-4" />
                <span>Sign In</span>
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile search */}
      <form onSubmit={handleSearch} className="marketplace-container pb-3 sm:hidden">
        <div className="flex">
          <Input
            placeholder="Search for anything..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-r-none border-r-0 focus-visible:ring-0"
          />
          <Button type="submit" variant="accent" className="rounded-l-none px-4">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </form>

      {/* Category nav */}
      <nav className="hidden border-t border-border lg:block">
        <div className="marketplace-container flex items-center gap-6 py-2">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Header;
