import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/70 backdrop-blur-glass border-b border-border/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-semibold text-primary hover:opacity-80 transition-opacity">
            Makora Bio
          </Link>
          
          <div className="flex items-center gap-8">
            <a href="#demo" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Demo
            </a>
            <a href="#security" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Security
            </a>
            <Button asChild variant="default" size="sm">
              <a href="#contact">Get Started</a>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
