
-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'staff', 'customer');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checks
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- Auto-create profile + assign customer role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'customer');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Subcategories table
CREATE TABLE public.subcategories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL
);
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;

-- Products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  condition TEXT NOT NULL DEFAULT 'New',
  images TEXT[] DEFAULT '{}',
  category_id UUID REFERENCES public.categories(id),
  subcategory_id UUID REFERENCES public.subcategories(id),
  inventory INTEGER NOT NULL DEFAULT 0,
  rating NUMERIC(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  shipping_address TEXT,
  shipping_city TEXT,
  shipping_phone TEXT,
  payment_method TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Order items
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price NUMERIC(10,2) NOT NULL DEFAULT 0
);
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Reviews
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL,
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Wishlists
CREATE TABLE public.wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, product_id)
);
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES

-- Profiles: users read/update own; admins read all
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- User roles: users read own; admins manage all
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Categories & subcategories: public read; admin write
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can manage categories" ON public.categories FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Anyone can view subcategories" ON public.subcategories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can manage subcategories" ON public.subcategories FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Products: public read active; admin/staff manage
CREATE POLICY "Anyone can view active products" ON public.products FOR SELECT TO anon, authenticated USING (active = true);
CREATE POLICY "Admins can manage products" ON public.products FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Staff can manage products" ON public.products FOR ALL USING (public.has_role(auth.uid(), 'staff'));

-- Orders: users see own; admin/staff see all
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage orders" ON public.orders FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Staff can view orders" ON public.orders FOR SELECT USING (public.has_role(auth.uid(), 'staff'));
CREATE POLICY "Staff can update orders" ON public.orders FOR UPDATE USING (public.has_role(auth.uid(), 'staff'));

-- Order items: same as orders
CREATE POLICY "Users can view own order items" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);
CREATE POLICY "Users can insert own order items" ON public.order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);
CREATE POLICY "Admins can manage order items" ON public.order_items FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Staff can view order items" ON public.order_items FOR SELECT USING (public.has_role(auth.uid(), 'staff'));

-- Reviews: public read; users manage own
CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Users can insert own reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON public.reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reviews" ON public.reviews FOR DELETE USING (auth.uid() = user_id);

-- Wishlists: users manage own
CREATE POLICY "Users can view own wishlist" ON public.wishlists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own wishlist" ON public.wishlists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own wishlist" ON public.wishlists FOR DELETE USING (auth.uid() = user_id);
