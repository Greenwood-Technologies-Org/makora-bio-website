

import { useEffect, useRef } from "react";

const integrations = [
  { name: "CRIO", src: "/integration_logos/CRIO.png" },
  { name: "Advarra", src: "/integration_logos/advarra.jpg" },
  { name: "Calendly", src: "/integration_logos/calendly.png" },
  { name: "Gmail", src: "/integration_logos/gmail.png" },
  { name: "Outlook", src: "/integration_logos/outlook.png" },
  { name: "Realtime", src: "/integration_logos/realtime.png" },
  { name: "Veeva", src: "/integration_logos/veeva.png" },
];

const Integrations = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollPos = 0;
    const scroll = () => {
      scrollPos += 0.5;
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
    <section className="py-8 px-6 lg:px-8 bg-secondary/30" id="integrations">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-medium text-center mb-12">
          Seamless Integrations Across Your Workflows
        </h2>
        
        <div className="relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-secondary/30 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-secondary/30 to-transparent z-10" />
          <div className="flex gap-12" ref={scrollRef}>
            {[...integrations, ...integrations].map((integration, index) => (
              <div
                key={`${integration.name}-${index}`}
                className="flex-shrink-0 w-40 text-center space-y-3"
              >
                <div className="w-20 h-20 mx-auto bg-card rounded-2xl shadow-md flex items-center justify-center border border-border p-2">
                  <img 
                    src={integration.src} 
                    alt={integration.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-sm font-medium text-foreground">{integration.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Integrations;
