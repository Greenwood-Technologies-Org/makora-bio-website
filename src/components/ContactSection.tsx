import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Calendar } from "lucide-react";

const ContactSection = () => {
  return (
    <section id="contact" className="py-20 bg-muted/30 scroll-mt-20">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center fade-in-section">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
            Contact Us
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="text-lg"
              onClick={() => window.location.href = "mailto:contact@makorabio.com"}
            >
              <Mail className="mr-2 h-5 w-5" />
              Email
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg"
              onClick={() => window.open("https://calendly.com/makorabio", "_blank")}
            >
              <Calendar className="mr-2 h-5 w-5" />
              Book a Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
