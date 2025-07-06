import Hero from "@/components/Hero";
import Products from "@/components/Products";
import Waitlist from "@/components/Waitlist";
import Contact from "@/components/Contact";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <Products />
      <Waitlist />
      <Contact />
    </div>
  );
};

export default Index;
