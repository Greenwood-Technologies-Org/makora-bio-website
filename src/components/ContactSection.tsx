import { Button } from "@/components/ui/button";
import { Mail, Calendar } from "lucide-react";

const ContactSection = () => {
  return (
    <section id="contact" className="bg-background scroll-mt-20">
      <div className="container mx-auto px-6 pb-40">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Contact Us
          </h2>
          <p className="text-lg text-foreground mb-2 leading-relaxed">
            We're partnering with a small number of select clinical research teams to co-develop Clinbox. Design partners receive early access, feature input, and 3 months of free use.
          </p>
          <div className="flex flex-col gap-4 items-center pt-5">
            <p className="text-lg text-foreground">
              <a 
                href="mailto:team@makora.bio" 
                className="text-primary font-medium"
              >
                team@makora.bio
              </a>
            </p>
            <Button
              size="default"
              className="text-base px-6 py-4"
              onClick={() => window.open("https://calendly.com/roshan-kern/30min", "_blank")}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Book a Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
