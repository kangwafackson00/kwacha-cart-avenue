export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  condition: "New" | "Used";
  images: string[];
  category: string;
  subcategory: string;
  inventory: number;
  rating: number;
  reviewCount: number;
  featured: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  subcategories: string[];
  productCount: number;
}

export const categories: Category[] = [
  { id: "1", name: "Electronics", icon: "Smartphone", subcategories: ["Phones", "Laptops", "Accessories", "TVs"], productCount: 45 },
  { id: "2", name: "Fashion", icon: "Shirt", subcategories: ["Men", "Women", "Kids", "Shoes"], productCount: 120 },
  { id: "3", name: "Home & Garden", icon: "Home", subcategories: ["Furniture", "Kitchen", "Decor", "Tools"], productCount: 67 },
  { id: "4", name: "Vehicles", icon: "Car", subcategories: ["Cars", "Motorcycles", "Parts", "Accessories"], productCount: 23 },
  { id: "5", name: "Sports", icon: "Dumbbell", subcategories: ["Fitness", "Outdoor", "Team Sports", "Water Sports"], productCount: 34 },
  { id: "6", name: "Books & Media", icon: "BookOpen", subcategories: ["Books", "Music", "Movies", "Games"], productCount: 89 },
];

export const products: Product[] = [
  {
    id: "1", name: "Samsung Galaxy A54 5G", description: "Brand new Samsung Galaxy A54 with 128GB storage, 6GB RAM, and stunning AMOLED display. Perfect for everyday use with excellent camera quality.", price: 4500, condition: "New", images: ["/placeholder.svg"], category: "Electronics", subcategory: "Phones", inventory: 15, rating: 4.5, reviewCount: 23, featured: true,
  },
  {
    id: "2", name: "HP Pavilion Laptop 15\"", description: "Powerful HP Pavilion laptop with Intel i5 processor, 8GB RAM, 256GB SSD. Ideal for work and study.", price: 12000, condition: "New", images: ["/placeholder.svg"], category: "Electronics", subcategory: "Laptops", inventory: 8, rating: 4.2, reviewCount: 15, featured: true,
  },
  {
    id: "3", name: "Men's Casual Polo Shirt", description: "High-quality cotton polo shirt, comfortable fit, available in multiple colors.", price: 250, condition: "New", images: ["/placeholder.svg"], category: "Fashion", subcategory: "Men", inventory: 50, rating: 4.0, reviewCount: 8, featured: false,
  },
  {
    id: "4", name: "Leather Sofa Set (3-Piece)", description: "Elegant 3-piece leather sofa set, perfect for your living room. Durable and stylish.", price: 18500, condition: "New", images: ["/placeholder.svg"], category: "Home & Garden", subcategory: "Furniture", inventory: 3, rating: 4.7, reviewCount: 12, featured: true,
  },
  {
    id: "5", name: "Toyota Corolla 2019", description: "Well-maintained Toyota Corolla 2019 model, low mileage, full service history.", price: 185000, condition: "Used", images: ["/placeholder.svg"], category: "Vehicles", subcategory: "Cars", inventory: 1, rating: 4.8, reviewCount: 5, featured: true,
  },
  {
    id: "6", name: "Wireless Bluetooth Earbuds", description: "Premium wireless earbuds with noise cancellation, 24-hour battery life.", price: 450, condition: "New", images: ["/placeholder.svg"], category: "Electronics", subcategory: "Accessories", inventory: 30, rating: 4.3, reviewCount: 41, featured: true,
  },
  {
    id: "7", name: "Women's Running Shoes", description: "Lightweight and comfortable running shoes with cushioned sole.", price: 650, condition: "New", images: ["/placeholder.svg"], category: "Fashion", subcategory: "Shoes", inventory: 20, rating: 4.1, reviewCount: 19, featured: false,
  },
  {
    id: "8", name: "Adjustable Dumbbell Set", description: "Complete adjustable dumbbell set from 5kg to 25kg. Perfect for home workouts.", price: 1800, condition: "New", images: ["/placeholder.svg"], category: "Sports", subcategory: "Fitness", inventory: 10, rating: 4.6, reviewCount: 7, featured: true,
  },
  {
    id: "9", name: "55\" Smart TV 4K UHD", description: "Stunning 55-inch 4K Smart TV with built-in streaming apps and HDR support.", price: 7500, condition: "New", images: ["/placeholder.svg"], category: "Electronics", subcategory: "TVs", inventory: 5, rating: 4.4, reviewCount: 32, featured: true,
  },
  {
    id: "10", name: "Kitchen Blender Pro", description: "Professional-grade kitchen blender with 1000W motor and multiple speed settings.", price: 850, condition: "New", images: ["/placeholder.svg"], category: "Home & Garden", subcategory: "Kitchen", inventory: 25, rating: 4.0, reviewCount: 14, featured: false,
  },
  {
    id: "11", name: "Children's School Backpack", description: "Durable and colorful school backpack with multiple compartments.", price: 180, condition: "New", images: ["/placeholder.svg"], category: "Fashion", subcategory: "Kids", inventory: 40, rating: 4.2, reviewCount: 11, featured: false,
  },
  {
    id: "12", name: "Mountain Bike 26\"", description: "Sturdy mountain bike with 21-speed gear system and disc brakes.", price: 3200, condition: "Used", images: ["/placeholder.svg"], category: "Sports", subcategory: "Outdoor", inventory: 2, rating: 4.5, reviewCount: 6, featured: false,
  },
];

export const formatPrice = (price: number): string => {
  return `ZMW ${price.toLocaleString("en-ZM")}`;
};
