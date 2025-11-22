import { Button } from "@/components/ui/button";

const ContactSection = () => {
  return (
    <section className="py-8 px-6 lg:px-8 bg-secondary/30" id="contact">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <h2 className="text-4xl font-semibold">Contact Us</h2>
        
        <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
          We're partnering with a small number of select clinical research teams to co-develop ClinBox. 
          Design partners receive early access, feature input, and 3 months of free use.
        </p>
        
        <div className="flex flex-col items-center justify-center gap-4">
          <a 
            href="mailto:team@makora.bio" 
            className="text-primary hover:underline text-lg font-medium"
          >
            team@makora.bio
          </a>
          
          <Button asChild size="lg" className="shadow-glow">
            <a href="https://calendly.com/roshan-kern/30min" target="_blank" rel="noopener noreferrer">
              Meet Us
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
