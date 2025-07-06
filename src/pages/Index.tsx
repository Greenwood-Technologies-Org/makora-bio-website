import Hero from "@/components/Hero";
import Platform from "@/components/Platform";
import Waitlist from "@/components/Waitlist";
import Contact from "@/components/Contact";
import Navbar from "@/components/Navbar";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Platform />
      <Waitlist />
      <Contact />
    </div>
  );
};

export default Index;
