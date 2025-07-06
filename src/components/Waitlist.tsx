import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";

const Waitlist = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle waitlist signup
    console.log("Email submitted:", email);
    setEmail("");
  };

  return (
    <section id="waitlist" ref={sectionRef} className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className={`max-w-2xl mx-auto text-center fade-in-up ${isVisible ? 'visible' : ''}`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Be the First to Try It
          </h2>
          <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
            We're building in public. Enter your email to get early access and updates.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-background border-border text-foreground placeholder:text-muted-foreground"
              required
            />
            <Button type="submit" variant="waitlist" className="sm:w-auto">
              Join Waitlist
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Waitlist;