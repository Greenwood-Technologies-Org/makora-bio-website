

const HeroSection = () => {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20 animate-fade-in">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px]" />
      <div className="container mx-auto px-6 text-center relative z-10">
        <h1 className="text-7xl font-bold text-primary mb-6">
          Makora Bio
        </h1>
        <p className="text-3xl text-foreground font-semibold max-w-4xl mx-auto mb-4">
          The intelligent data layer for clinical research
        </p>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          We're building an AI-based approach to the data movement between email, source, and vendor portals to save staff 20+ hours a week
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
