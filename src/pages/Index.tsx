import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroCarousel from "@/components/home/HeroCarousel";
import QuickActions from "@/components/home/QuickActions";
import CategorySection from "@/components/home/CategorySection";
import DoctorSchedule from "@/components/home/DoctorSchedule";
import HealthPackages from "@/components/home/HealthPackages";
import DiscountedProducts from "@/components/home/DiscountedProducts";
import AboutSection from "@/components/home/AboutSection";
import Testimonials from "@/components/Testimonials";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 space-y-12">
          {/* Hero Carousel */}
          <HeroCarousel />
          
          {/* Quick Actions */}
          <QuickActions />
          
          {/* Discounted Products */}
          <DiscountedProducts />
          
          {/* All Categories */}
          <CategorySection />
          
          {/* Health Packages */}
          <HealthPackages />
          
          {/* Visiting Doctors Schedule */}
          <DoctorSchedule />
          
          {/* About Section */}
          <AboutSection />
          
          {/* Testimonials */}
          <Testimonials />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
