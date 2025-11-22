import { Linkedin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-8 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-start justify-between gap-8 text-sm">
          {/* Left Stack */}
          <div className="flex flex-col gap-3">
            <span className="font-medium text-primary">Makora Bio</span>
            <div className="flex items-center gap-4">
              <a
                href="https://www.linkedin.com/company/makora-bio"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="mailto:team@makora.bio" 
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          {/* Middle Stack */}
          <div className="flex flex-col gap-2 text-muted-foreground">
            <p>© {new Date().getFullYear()} Makora Bio. All rights reserved.</p>
            <p className="text-xs">
              Names and images on this website do not represent real individuals.
            </p>
          </div>
          
          {/* Right Stack */}
          <div className="flex flex-col gap-2 text-muted-foreground">
            <button className="hover:text-primary transition-colors text-left">
              Terms of Service
            </button>
            <button className="hover:text-primary transition-colors text-left">
              Privacy Policy
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
