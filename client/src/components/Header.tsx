import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Menu, 
  X, 
  Package, 
  FileText, 
  Phone, 
  Info, 
  Home, 
  ShoppingBag,
  Truck,
  User,
  LogOut,
  LayoutDashboard
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import logoImage from "@assets/image_1764695842663.png";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/about", label: "About Us", icon: Info },
  { href: "/services", label: "Services", icon: Package },
  { href: "/products", label: "Products", icon: ShoppingBag },
  { href: "/tracking", label: "Track Shipment", icon: Truck },
  { href: "/contact", label: "Contact", icon: Phone },
];

export default function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, isLoading } = useAuth();

  const isActive = (path: string) => {
    if (path === "/") return location === "/";
    return location.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img 
              src={logoImage} 
              alt="Blue Kailash International" 
              className="h-10 lg:h-12 w-auto"
              data-testid="img-logo"
            />
            <div className="hidden sm:block">
              <span className="font-heading font-bold text-lg lg:text-xl text-indigo dark:text-white">
                Blue Kailash
              </span>
              <span className="hidden lg:inline font-heading font-bold text-lg lg:text-xl text-indigo dark:text-white">
                {" "}International
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant={isActive(link.href) ? "secondary" : "ghost"}
                  size="sm"
                  className={`font-medium ${
                    isActive(link.href) 
                      ? "bg-indigo/10 text-indigo dark:bg-indigo/20 dark:text-white" 
                      : "text-gray-600 dark:text-gray-300"
                  }`}
                  data-testid={`link-nav-${link.label.toLowerCase().replace(/\s/g, '-')}`}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Request Quote CTA - Desktop */}
            <Link href="/quote" className="hidden md:block">
              <Button 
                className="bg-gold hover:bg-gold/90 text-gold-foreground font-semibold"
                data-testid="button-request-quote-header"
              >
                <FileText className="w-4 h-4 mr-2" />
                Request Quote
              </Button>
            </Link>

            {/* Auth Buttons */}
            {isLoading ? (
              <div className="h-9 w-20 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
            ) : isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                <Link href="/dashboard">
                  <Button variant="outline" size="sm" data-testid="button-dashboard">
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Dashboard</span>
                  </Button>
                </Link>
                <a href="/api/logout">
                  <Button variant="ghost" size="icon" data-testid="button-logout">
                    <LogOut className="w-4 h-4" />
                  </Button>
                </a>
              </div>
            ) : (
              <a href="/api/login">
                <Button variant="outline" data-testid="button-login">
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </a>
            )}

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" data-testid="button-mobile-menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0">
                <div className="flex flex-col h-full">
                  {/* Mobile Menu Header */}
                  <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-2">
                      <img 
                        src={logoImage} 
                        alt="Blue Kailash International" 
                        className="h-8 w-auto"
                      />
                      <span className="font-heading font-bold text-indigo dark:text-white">
                        Blue Kailash
                      </span>
                    </div>
                  </div>

                  {/* Mobile Navigation */}
                  <nav className="flex-1 p-4 space-y-1">
                    {navLinks.map((link) => {
                      const Icon = link.icon;
                      return (
                        <Link key={link.href} href={link.href}>
                          <Button
                            variant={isActive(link.href) ? "secondary" : "ghost"}
                            className={`w-full justify-start gap-3 ${
                              isActive(link.href) 
                                ? "bg-indigo/10 text-indigo" 
                                : "text-gray-600"
                            }`}
                            onClick={() => setMobileMenuOpen(false)}
                            data-testid={`link-mobile-${link.label.toLowerCase().replace(/\s/g, '-')}`}
                          >
                            <Icon className="w-5 h-5" />
                            {link.label}
                          </Button>
                        </Link>
                      );
                    })}
                  </nav>

                  {/* Mobile Menu Footer */}
                  <div className="p-4 border-t space-y-2">
                    <Link href="/quote">
                      <Button 
                        className="w-full bg-gold hover:bg-gold/90 text-gold-foreground font-semibold"
                        onClick={() => setMobileMenuOpen(false)}
                        data-testid="button-mobile-quote"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Request Quote
                      </Button>
                    </Link>
                    {isAuthenticated ? (
                      <>
                        <Link href="/dashboard">
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <LayoutDashboard className="w-4 h-4 mr-2" />
                            Dashboard
                          </Button>
                        </Link>
                        <a href="/api/logout" className="block">
                          <Button variant="ghost" className="w-full">
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                          </Button>
                        </a>
                      </>
                    ) : (
                      <a href="/api/login" className="block">
                        <Button variant="outline" className="w-full">
                          <User className="w-4 h-4 mr-2" />
                          Login
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
