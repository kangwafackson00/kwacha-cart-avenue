import MainLayout from "@/components/layout/MainLayout";
import HeroSection from "@/components/home/HeroSection";
import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import TrustBanner from "@/components/home/TrustBanner";

const Index = () => {
  return (
    <MainLayout>
      <HeroSection />
      <TrustBanner />
      <CategoryGrid />
      <FeaturedProducts />
    </MainLayout>
  );
};

export default Index;
