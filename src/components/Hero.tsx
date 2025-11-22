import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const companies = ["MIT", "Stanford", "Sanofi", "Pfizer", "Johns Hopkins"];

const Hero = () => {
  const [currentCompany, setCurrentCompany] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCompany((prev) => (prev + 1) % companies.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="pt-32 pb-12 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 items-center lg:justify-between">
          <div className="space-y-8 animate-fade-in text-center lg:text-left lg:max-w-xl">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold tracking-tight">
                Meet <span className="text-primary">ClinBox</span>
              </h1>
              <p className="text-2xl text-muted-foreground font-medium">
                The intelligent inbox for clinical research
              </p>
              <p className="text-lg text-muted-foreground">
                Advancing Clinical Operations with AI-native Workflows
              </p>
            </div>
            
            <Button size="lg" className="shadow-glow">
              Get Started
            </Button>
            
            <div className="pt-4">
              <p className="text-sm text-muted-foreground mb-3">Built for researchers at:</p>
              <div className="relative h-8 overflow-hidden">
                <div 
                  className="flex absolute whitespace-nowrap animate-slide-in"
                  style={{ 
                    animation: 'slideCarousel 15s linear infinite',
                  }}
                >
                  {[...companies, ...companies, ...companies].map((company, index) => (
                    <span
                      key={`${company}-${index}`}
                      className="text-lg font-semibold text-primary px-8"
                    >
                      {company}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center animate-fade-in lg:max-w-md w-full">
            <div 
              className="w-full max-w-md border-2 border-primary rounded-2xl flex items-center justify-center bg-card/50 backdrop-blur-sm shadow-lg"
              style={{ aspectRatio: "7/9" }}
            >
              <span className="text-2xl font-semibold text-primary">Demo</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
