import { Linkedin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-8 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm">
          <div className="flex items-center gap-4">
            <span className="font-medium text-primary">Makora Bio</span>
            <a 
              href="mailto:team@makora.bio" 
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
            <a
              href="https://www.linkedin.com/company/makora-bio"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-4 text-muted-foreground text-center">
            <p>© {new Date().getFullYear()} Makora Bio. All rights reserved.</p>
            <p className="text-xs">
              Names and images on this website do not represent real individuals.
            </p>
          </div>
          
          <div className="flex items-center gap-4 text-muted-foreground">
            <button className="hover:text-primary transition-colors">
              Terms of Service
            </button>
            <button className="hover:text-primary transition-colors">
              Privacy Policy
            </button>
            <button className="hover:text-primary transition-colors">
              Cookie Settings
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
