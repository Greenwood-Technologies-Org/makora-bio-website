import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ClinboxSection from "@/components/ClinboxSection";
import ContactSection from "@/components/ContactSection";
import Sources from "@/components/Sources";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ClinboxSection />
      <ContactSection />
      <Sources />
      <Footer />
    </div>
  );
};

export default Index;
