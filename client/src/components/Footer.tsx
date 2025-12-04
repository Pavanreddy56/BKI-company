import { Link } from "wouter";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Linkedin, 
  Twitter,
  Instagram
} from "lucide-react";
import logoImage from "@assets/image_1764695842663.png";

const quickLinks = [
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/products", label: "Products" },
];

const supportLinks = [
  { href: "/contact", label: "Contact Us" },
  { href: "/tracking", label: "Track Shipment" },
  { href: "/quote", label: "Request Quote" },
];

const legalLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src={logoImage} 
                alt="Blue Kailash International" 
                className="h-10 w-auto brightness-0 invert"
              />
              <div>
                <span className="font-heading font-bold text-lg text-white">
                  Blue Kailash
                </span>
                <br />
                <span className="font-heading text-sm text-gray-400">
                  International
                </span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Connecting Indian produce to the world — trusted export & import services 
              for agriculture, spices, textiles and handicrafts.
            </p>
            <div className="flex items-center gap-3">
              <a 
                href="#" 
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-teal transition-colors"
                data-testid="link-social-facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-teal transition-colors"
                data-testid="link-social-linkedin"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-teal transition-colors"
                data-testid="link-social-twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-teal transition-colors"
                data-testid="link-social-instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-teal transition-colors text-sm"
                    data-testid={`link-footer-${link.label.toLowerCase().replace(/\s/g, '-')}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-heading font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-teal transition-colors text-sm"
                    data-testid={`link-footer-${link.label.toLowerCase().replace(/\s/g, '-')}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-heading font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-teal shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">
                  Hyderabad, Telangana, India
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-teal shrink-0" />
                <a 
                  href="tel:+919876543210" 
                  className="text-gray-400 hover:text-teal transition-colors text-sm"
                  data-testid="link-phone"
                >
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-teal shrink-0" />
                <a 
                  href="mailto:info@bluekailash.international" 
                  className="text-gray-400 hover:text-teal transition-colors text-sm"
                  data-testid="link-email"
                >
                  info@bluekailash.international
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm text-center sm:text-left">
              © {currentYear} Blue Kailash International. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              {legalLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href}
                  className="text-gray-500 hover:text-gray-300 transition-colors text-sm"
                  data-testid={`link-legal-${link.label.toLowerCase().replace(/\s/g, '-')}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
