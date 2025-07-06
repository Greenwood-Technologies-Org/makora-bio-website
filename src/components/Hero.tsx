import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background glow effect */}
      <div className="absolute inset-0 gradient-glow opacity-50" />
      
      <div className="container mx-auto px-6 text-center relative z-10">
        <div className={`fade-in-up ${isVisible ? 'visible' : ''}`}>
          <h1 className="text-6xl md:text-8xl font-bold mb-4 leading-tight text-white">
            Makora Bio
          </h1>
          
          <h2 className="text-3xl md:text-5xl font-semibold mb-6 leading-tight text-muted-foreground">
            Accelerating life sciences research with{" "}
            <span className="text-primary">agentic AI</span>
          </h2>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed">
            We build intelligent tools that free scientists from tedious digital tasks — so they can focus on discovery.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="hero" 
              size="lg" 
              className="text-lg px-8 py-6"
              onClick={() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Join the Waitlist
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-6 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Get in Contact
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-6 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              onClick={() => window.open('https://linkedin.com/company/makora-bio', '_blank')}
            >
              Visit LinkedIn
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;