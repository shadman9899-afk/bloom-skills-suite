import HeroSection from "@/components/home/HeroSection";
import TrustSection from "@/components/home/TrustSection";
import CategorySection from "@/components/home/CategorySection";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import FeaturedCourses from "@/components/home/FeaturedCourses";
import LearningFlow from "@/components/home/LearningFlow";
import Testimonials from "@/components/home/Testimonials";
import FinalCTA from "@/components/home/FinalCTA";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <TrustSection />
      <CategorySection />
      <WhyChooseUs />
      <FeaturedCourses />
      <LearningFlow />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </div>
  );
};

export default Index;
