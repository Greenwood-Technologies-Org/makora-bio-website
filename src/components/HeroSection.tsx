import { ChevronDown } from "lucide-react";

const HeroSection = () => {
  const scrollToClinbox = () => {
    const clinboxSection = document.getElementById("clinbox");
    if (clinboxSection) {
      clinboxSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20 animate-fade-in">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px]" />
      <div className="container mx-auto px-6 text-center relative z-10">
        <h1 className="text-7xl font-bold text-primary mb-6">
          Makora Bio
        </h1>
        <p className="text-3xl text-foreground font-semibold max-w-4xl mx-auto mb-8">
          The intelligent data layer for clinical research
        </p>
        <div className="max-w-3xl mx-auto space-y-2 mb-8">
          <p className="text-lg text-muted-foreground">
            What if your trials ran 30% faster?
          </p>
          <p className="text-lg text-muted-foreground">
            What if your team could save 20+ hours a week?
          </p>
          <p className="text-lg text-muted-foreground">
            What if data moved seamlessly between email, source, and vendor portals?
          </p>
        </div>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          We're building an AI solution for just that.
        </p>
      </div>
      
      {/* Scroll Down Arrow */}
      <button
        onClick={scrollToClinbox}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 cursor-pointer animate-bounce hover:text-primary transition-colors"
        aria-label="Scroll to Clinbox section"
      >
        <ChevronDown className="h-12 w-12 text-muted-foreground hover:text-primary transition-colors" />
      </button>
    </section>
  );
};

export default HeroSection;
