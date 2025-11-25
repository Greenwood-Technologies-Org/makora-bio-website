import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";

const companyLogos = [
  { name: "Stanford Medicine", src: "/built_for_logos/stanford_medicine_logo.png" },
  { name: "MSK", src: "/built_for_logos/msk_logo.png" },
  { name: "Syneos Health", src: "/built_for_logos/1200px-Syneos_Health_logo.png" },
  { name: "Grifols", src: "/built_for_logos/Grifols.png" },
  { name: "Fortrea", src: "/built_for_logos/fortrea-logo-without-background.png" },
  { name: "Summit Therapeutics", src: "/built_for_logos/summit-therapeutics-logo.png" },
  { name: "Worldwide Clinical Trials", src: "/built_for_logos/worldwide-1.png" },
  { name: "CWRU Med", src: "/built_for_logos/Casemed_logo2010.png" },
];

const Hero = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollPos = 0;
    const scroll = () => {
      scrollPos += 0.2;
      scrollContainer.style.transform = `translate3d(-${scrollPos}px, 0px, 0px)`;
      
      // Reset when we've scrolled through half the content (since we duplicate)
      if (scrollPos >= scrollContainer.scrollWidth / 2) {
        scrollPos = 0;
      }
      
      requestAnimationFrame(scroll);
    };
    
    const animationId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <section className="pt-32 pb-8">
      <div className="mx-auto">
        <div className="flex flex-col lg:flex-row gap-2 items-center lg:justify-around">
          <div className="space-y-8 animate-fade-in text-center lg:text-left lg:max-w-xl">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-medium tracking-tight">
                <span className="text-primary">ClinBox</span>
              </h1>
              <p className="text-2xl font-medium">
                the intelligent inbox for clinical research
              </p>
              <p className="text-lg text-muted-foreground">
                Advancing Clinical Operations with AI-native Workflows
              </p>
            </div>
            
            <Button size="lg" className="shadow-glow">
              Get Started
            </Button>
            
            <div className="pt-2">
              <p className="text-sm text-muted-foreground mb-5">Built for teams at:</p>
              <div className="relative w-full max-w-md">
                <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10" />
                <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10" />
                <div className="overflow-hidden">
                  <div className="flex gap-8" ref={scrollRef}>
                    {[...companyLogos, ...companyLogos].map((logo, index) => (
                      <div
                        key={`${logo.name}-${index}`}
                        className="flex-[0_0_auto] flex items-center justify-center px-1"
                      >
                        <img 
                          src={logo.src} 
                          alt={logo.name}
                          className="h-6 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center animate-fade-in lg:max-w-md w-full">
            <div 
              className="w-full max-w-md border-2 border-primary rounded-2xl flex items-center justify-center bg-card/50 backdrop-blur-sm shadow-lg"
              style={{ aspectRatio: "9/9" }}
            >
              <span className="text-2xl font-medium text-primary">Demo</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
