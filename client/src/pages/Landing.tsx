import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import { 
  ArrowRight, 
  Truck, 
  FileCheck, 
  Globe, 
  Package, 
  ShieldCheck,
  Clock,
  CheckCircle2,
  Ship,
  Plane,
  Warehouse,
  FileText
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "@shared/schema";

const trustIndicators = [
  { icon: ShieldCheck, text: "Licensed Exporters" },
  { icon: FileCheck, text: "Transparent Pricing" },
  { icon: Globe, text: "10+ Countries" },
  { icon: Clock, text: "Real-time Tracking" },
];

const services = [
  {
    icon: Ship,
    title: "Export Services",
    description: "Market-ready export solutions — product sourcing, packaging, export documentation, and international freight.",
  },
  {
    icon: Plane,
    title: "Import Services",
    description: "Import facilitation and customs clearance for overseas products into India.",
  },
  {
    icon: Truck,
    title: "Freight Forwarding",
    description: "Sea freight, air freight and multimodal solutions with partner carriers and consolidated LCL services.",
  },
  {
    icon: FileCheck,
    title: "Customs Clearance",
    description: "End-to-end customs filing, duty estimation, and license management to ensure smooth border crossings.",
  },
  {
    icon: Warehouse,
    title: "Warehousing",
    description: "Short-term and long-term warehousing, pick & pack, and last-mile distribution support.",
  },
  {
    icon: FileText,
    title: "Documentation",
    description: "Commercial invoices, packing lists, certificates of origin, phytosanitary and other export-import certificates.",
  },
];

const categories = [
  { name: "Spices", count: 12, color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" },
  { name: "Textiles", count: 8, color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
  { name: "Handicrafts", count: 15, color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400" },
  { name: "Agriculture", count: 10, color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
];

export default function Landing() {
  const { data: products } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const featuredProducts = products?.slice(0, 4) || [];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[600px] lg:min-h-[700px] flex items-center bg-gradient-to-br from-indigo via-indigo-dark to-indigo overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="max-w-3xl">
            <Badge 
              className="mb-6 bg-white/20 text-white border-white/30 backdrop-blur-sm"
              data-testid="badge-hero"
            >
              Trusted Import & Export Partner
            </Badge>
            
            <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl text-white leading-tight mb-6">
              Blue Kailash International
            </h1>
            
            <p className="text-xl lg:text-2xl text-white/90 mb-4 font-light">
              Connecting Indian produce to the world
            </p>
            
            <p className="text-lg text-white/75 mb-8 max-w-2xl leading-relaxed">
              Trusted export & import services for agriculture, spices, textiles and handicrafts — 
              end-to-end logistics, customs and documentation support.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/quote">
                <Button 
                  size="lg" 
                  className="bg-gold hover:bg-gold/90 text-gold-foreground font-semibold text-lg px-8 py-6 w-full sm:w-auto"
                  data-testid="button-hero-quote"
                >
                  Request a Quote
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/tracking">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white/40 text-white hover:bg-white/10 backdrop-blur-sm font-semibold text-lg px-8 py-6 w-full sm:w-auto"
                  data-testid="button-hero-track"
                >
                  <Truck className="mr-2 w-5 h-5" />
                  Track Your Shipment
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/3 h-full opacity-20">
          <div className="absolute right-0 top-0 w-96 h-96 bg-teal rounded-full blur-3xl" />
          <div className="absolute right-20 bottom-0 w-64 h-64 bg-gold rounded-full blur-3xl" />
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap items-center justify-center gap-6 lg:gap-12">
            {trustIndicators.map((item, index) => {
              const Icon = item.icon;
              return (
                <div 
                  key={index} 
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-400"
                  data-testid={`trust-indicator-${index}`}
                >
                  <Icon className="w-5 h-5 text-teal" />
                  <span className="font-medium text-sm">{item.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <Badge className="mb-4 bg-teal/10 text-teal border-teal/20">Our Services</Badge>
            <h2 className="font-heading font-bold text-3xl lg:text-4xl text-gray-900 dark:text-white mb-4">
              Complete Import & Export Solutions
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
              From sourcing to delivery, we handle every aspect of your international trade needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card 
                  key={index} 
                  className="group hover-elevate border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
                  data-testid={`card-service-${index}`}
                >
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-teal/10 flex items-center justify-center mb-4 group-hover:bg-teal/20 transition-colors">
                      <Icon className="w-6 h-6 text-teal" />
                    </div>
                    <h3 className="font-heading font-semibold text-lg text-gray-900 dark:text-white mb-2">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <Link href="/services">
              <Button variant="outline" size="lg" data-testid="button-view-services">
                View All Services
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-indigo/10 text-indigo border-indigo/20">Product Categories</Badge>
            <h2 className="font-heading font-bold text-3xl lg:text-4xl text-gray-900 dark:text-white mb-4">
              What We Export
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
              Premium quality products from India to the world.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-12">
            {categories.map((category, index) => (
              <Link href={`/products?category=${category.name.toLowerCase()}`} key={index}>
                <Card 
                  className="group hover-elevate text-center cursor-pointer"
                  data-testid={`card-category-${category.name.toLowerCase()}`}
                >
                  <CardContent className="p-6">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl ${category.color} mb-4`}>
                      <Package className="w-8 h-8" />
                    </div>
                    <h3 className="font-heading font-semibold text-gray-900 dark:text-white mb-1">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {category.count} Products
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Featured Products */}
          {featuredProducts.length > 0 && (
            <div>
              <h3 className="font-heading font-semibold text-xl text-gray-900 dark:text-white mb-6 text-center">
                Featured Products
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                  <Link href={`/products/${product.id}`} key={product.id}>
                    <Card 
                      className="group hover-elevate overflow-hidden"
                      data-testid={`card-product-${product.id}`}
                    >
                      <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
                        {product.imageUrl ? (
                          <img 
                            src={product.imageUrl} 
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-12 h-12 text-gray-400" />
                          </div>
                        )}
                        {product.hsCode && (
                          <Badge className="absolute top-2 right-2 bg-white/90 text-gray-700 text-xs">
                            HS: {product.hsCode}
                          </Badge>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-1 line-clamp-1">
                          {product.name}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {product.origin} • {product.unit}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
              <div className="text-center mt-8">
                <Link href="/products">
                  <Button size="lg" data-testid="button-view-products">
                    View All Products
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-indigo">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading font-bold text-3xl lg:text-4xl text-white mb-4">
            Ready to Start Exporting?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Get a customized quote for your shipment. Our team will respond within 48 hours 
            with a tailored solution and estimated transit time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quote">
              <Button 
                size="lg" 
                className="bg-gold hover:bg-gold/90 text-gold-foreground font-semibold px-8"
                data-testid="button-cta-quote"
              >
                Request a Quote
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/40 text-white hover:bg-white/10"
                data-testid="button-cta-contact"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-teal/10 text-teal border-teal/20">Why Choose Us</Badge>
              <h2 className="font-heading font-bold text-3xl lg:text-4xl text-gray-900 dark:text-white mb-6">
                Your Trusted Partner in Global Trade
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 leading-relaxed">
                Blue Kailash International is a Hyderabad-based import-export startup specializing 
                in agricultural produce, premium spices, textiles and artisanal handicrafts. We combine 
                local supplier relationships with global logistics expertise.
              </p>
              <ul className="space-y-4">
                {[
                  "Founded to empower Indian SMEs and growers",
                  "Licensed exporters and customs-compliant operations",
                  "Emphasis on fair trade and sustainable sourcing",
                  "End-to-end logistics and documentation support",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-teal shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link href="/about">
                  <Button variant="outline" data-testid="button-learn-more">
                    Learn More About Us
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-indigo/10 via-teal/10 to-gold/10 p-8 flex items-center justify-center">
                <div className="grid grid-cols-2 gap-6 w-full max-w-sm">
                  {[
                    { value: "500+", label: "Shipments" },
                    { value: "10+", label: "Countries" },
                    { value: "100+", label: "Products" },
                    { value: "98%", label: "Satisfaction" },
                  ].map((stat, index) => (
                    <div 
                      key={index} 
                      className="text-center p-4 bg-white dark:bg-gray-900 rounded-xl shadow-md"
                      data-testid={`stat-${index}`}
                    >
                      <div className="font-heading font-bold text-2xl lg:text-3xl text-indigo mb-1">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
