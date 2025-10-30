import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";

const HeroSection = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  
  const questions = [
    "What if your trials ran 30% faster?",
    "What if your team could save 20+ hours a week?",
    "What if data moved seamlessly between email, source, and vendor portals?",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false); // Start fade out
      
      setTimeout(() => {
        setCurrentQuestionIndex((prevIndex) => (prevIndex + 1) % questions.length);
        setIsVisible(true); // Start fade in
      }, 1000); // Wait 1 second for fade out before changing question
    }, 6000);

    return () => clearInterval(interval);
  }, [questions.length]);

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
        <div className="max-w-3xl mx-auto h-8 mb-4 relative">
          <p
            className={`text-lg text-muted-foreground absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            {questions[currentQuestionIndex]}
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
