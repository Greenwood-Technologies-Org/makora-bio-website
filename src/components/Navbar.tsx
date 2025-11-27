import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setOpen(false);
    const element = document.querySelector(href);
    if (element) {
      const navbarHeight = 64; // Height of the fixed navbar (h-16 = 4rem = 64px)
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navbarHeight - 32; // Additional 16px for spacing
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      <a 
        href="#clinbox" 
        onClick={(e) => handleNavClick(e, '#clinbox')}
        className={`text-sm font-medium text-foreground hover:text-primary transition-colors ${mobile ? 'block py-3' : ''}`}
      >
        Value
      </a>
      <a 
        href="#demo" 
        onClick={(e) => handleNavClick(e, '#demo')}
        className={`text-sm font-medium text-foreground hover:text-primary transition-colors ${mobile ? 'block py-3' : ''}`}
      >
        Demo
      </a>
      <a 
        href="#security" 
        onClick={(e) => handleNavClick(e, '#security')}
        className={`text-sm font-medium text-foreground hover:text-primary transition-colors ${mobile ? 'block py-3' : ''}`}
      >
        Security
      </a>
      <a 
        href="#integrations" 
        onClick={(e) => handleNavClick(e, '#integrations')}
        className={`text-sm font-medium text-foreground hover:text-primary transition-colors ${mobile ? 'block py-3' : ''}`}
      >
        Integrations
      </a>
      <Button asChild variant="default" size="sm" className={mobile ? 'w-full mt-2' : ''}>
        <a href="#contact" onClick={(e) => handleNavClick(e, '#contact')}>Get Started</a>
      </Button>
    </>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/50 backdrop-blur-glass border-b border-border/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a 
            href="#top" 
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xl font-semibold text-primary hover:opacity-80 transition-opacity cursor-pointer"
          >
            Makora Bio
          </a>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <NavLinks />
          </div>

          {/* Mobile Navigation */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[240px]">
              <div className="flex flex-col mt-8">
                <NavLinks mobile />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
