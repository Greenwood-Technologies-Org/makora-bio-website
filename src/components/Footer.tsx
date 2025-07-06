import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-background/50 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-muted-foreground">
            © 2025 Makora Bio. All rights reserved.
          </div>
          
          <div className="flex flex-wrap gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
              onClick={() => window.open('mailto:team@makora.bio?subject=Privacy Inquiry', '_blank')}
            >
              Privacy
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
              onClick={() => window.open('mailto:team@makora.bio?subject=Terms Inquiry', '_blank')}
            >
              Terms
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
              onClick={() => window.open('mailto:team@makora.bio?subject=Support Request', '_blank')}
            >
              Support
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
