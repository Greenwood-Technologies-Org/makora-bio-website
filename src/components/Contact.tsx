import { useEffect, useRef, useState } from "react";

const Contact = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="contact" ref={sectionRef} className="py-24">
      <div className="container mx-auto px-6">
        <div className={`max-w-2xl mx-auto text-center fade-in-up ${isVisible ? 'visible' : ''}`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Get in Touch
          </h2>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            We'd love to hear from you.
          </p>
          
          <div className="text-lg">
            <a 
              href="mailto:team@test.com" 
              className="text-primary hover:text-primary/80 transition-colors duration-200 font-medium"
            >
              team@makora.bio
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;