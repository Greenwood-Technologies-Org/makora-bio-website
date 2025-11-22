import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

const companyLogos = [
  { name: "Stanford Medicine", src: "/built_for_logos/stanford_medicine_logo.png" },
  { name: "MSK", src: "/built_for_logos/msk_logo.png" },
  { name: "Syneos Health", src: "/built_for_logos/1200px-Syneos_Health_logo.png" },
  { name: "Grifols", src: "/built_for_logos/Grifols.png" },
  { name: "Fortrea", src: "/built_for_logos/fortrea-logo-without-background.png" },
  { name: "Summit Therapeutics", src: "/built_for_logos/summit-therapeutics-logo.png" },
  { name: "Worldwide Clinical Trials", src: "/built_for_logos/worldwide-1.png" },
];

const Hero = () => {
  const [emblaRef] = useEmblaCarousel(
    { 
      loop: true,
      align: 'start',
      slidesToScroll: 1,
    },
    [Autoplay({ delay: 2000, stopOnInteraction: false })]
  );

  return (
    <section className="pt-32 pb-12 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 items-center lg:justify-around">
          <div className="space-y-8 animate-fade-in text-center lg:text-left lg:max-w-xl">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-semibold tracking-tight">
                Meet <span className="text-primary">ClinBox</span>
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
              <p className="text-sm text-muted-foreground mb-3">Built for clinical research staff at:</p>
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10" />
                <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10" />
                <div className="overflow-hidden" ref={emblaRef}>
                  <div className="flex gap-8">
                    {companyLogos.map((logo, index) => (
                      <div
                        key={`${logo.name}-${index}`}
                        className="flex-[0_0_auto] flex items-center justify-center px-4"
                      >
                        <img 
                          src={logo.src} 
                          alt={logo.name}
                          className="h-12 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity"
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
              style={{ aspectRatio: "8/9" }}
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
