import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import { 
  ArrowRight, 
  Ship, 
  Plane, 
  Truck, 
  FileCheck, 
  Warehouse, 
  FileText,
  CheckCircle2,
  Package,
  Globe,
  Clock,
  Shield
} from "lucide-react";

const services = [
  {
    icon: Ship,
    title: "Export Services",
    description: "Market-ready export solutions from India to the world.",
    features: [
      "Product sourcing and quality verification",
      "Export-grade packaging and labeling",
      "Complete export documentation",
      "International freight arrangements",
      "End-to-end supply chain management",
    ],
    color: "bg-blue-500",
  },
  {
    icon: Plane,
    title: "Import Services",
    description: "Seamless import facilitation into India.",
    features: [
      "Supplier identification and vetting",
      "Import license and permit assistance",
      "Customs clearance procedures",
      "Duty calculation and payment",
      "Last-mile delivery coordination",
    ],
    color: "bg-purple-500",
  },
  {
    icon: Truck,
    title: "Freight Forwarding",
    description: "Comprehensive logistics solutions across all modes.",
    features: [
      "Sea freight (FCL & LCL)",
      "Air freight for urgent shipments",
      "Multimodal transport solutions",
      "Partner carrier network",
      "Cargo insurance coordination",
    ],
    color: "bg-teal",
  },
  {
    icon: FileCheck,
    title: "Customs Clearance",
    description: "Expert handling of all customs procedures.",
    features: [
      "Pre-shipment documentation review",
      "Customs filing and declarations",
      "Duty estimation and optimization",
      "License and permit management",
      "Regulatory compliance support",
    ],
    color: "bg-amber-500",
  },
  {
    icon: Warehouse,
    title: "Warehousing & Storage",
    description: "Flexible storage solutions for your cargo.",
    features: [
      "Short and long-term warehousing",
      "Temperature-controlled storage",
      "Pick and pack services",
      "Inventory management",
      "Distribution support",
    ],
    color: "bg-indigo",
  },
  {
    icon: FileText,
    title: "Documentation Services",
    description: "Complete documentation and certification support.",
    features: [
      "Commercial invoices and packing lists",
      "Bill of lading and airway bills",
      "Certificates of origin",
      "Phytosanitary certificates",
      "Quality and inspection certificates",
    ],
    color: "bg-rose-500",
  },
];

const processSteps = [
  {
    step: 1,
    title: "Inquiry & Quote",
    description: "Submit your requirements and receive a detailed quote within 48 hours.",
    icon: Package,
  },
  {
    step: 2,
    title: "Documentation",
    description: "We prepare all necessary export/import documentation.",
    icon: FileText,
  },
  {
    step: 3,
    title: "Logistics",
    description: "Freight booking, pickup, and transportation coordination.",
    icon: Truck,
  },
  {
    step: 4,
    title: "Customs & Delivery",
    description: "Customs clearance and final delivery to destination.",
    icon: Globe,
  },
];

const benefits = [
  { icon: Clock, title: "Fast Turnaround", description: "Quick processing and delivery" },
  { icon: Shield, title: "Secure Handling", description: "Safe and insured cargo" },
  { icon: Globe, title: "Global Network", description: "Partners in 10+ countries" },
  { icon: FileCheck, title: "Full Compliance", description: "100% regulatory adherence" },
];

export default function Services() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-teal/10 text-teal border-teal/20">Our Services</Badge>
            <h1 className="font-heading font-bold text-4xl lg:text-5xl text-gray-900 dark:text-white mb-6">
              Complete Import & Export Solutions
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
              From sourcing to delivery, we provide end-to-end services for all your 
              international trade requirements.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Bar */}
      <section className="bg-indigo py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="flex items-center gap-3 text-white" data-testid={`benefit-${index}`}>
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{benefit.title}</h4>
                    <p className="text-white/70 text-xs">{benefit.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card 
                  key={index} 
                  className="overflow-hidden hover-elevate"
                  data-testid={`service-card-${index}`}
                >
                  <CardHeader className="pb-4">
                    <div className={`w-12 h-12 rounded-xl ${service.color} text-white flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="font-heading text-xl">{service.title}</CardTitle>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {service.description}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {service.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-teal shrink-0 mt-0.5" />
                          <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-indigo/10 text-indigo border-indigo/20">Our Process</Badge>
            <h2 className="font-heading font-bold text-3xl lg:text-4xl text-gray-900 dark:text-white mb-4">
              How We Work
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              A streamlined process designed for efficiency and transparency.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative" data-testid={`process-step-${index}`}>
                  <Card className="h-full text-center">
                    <CardContent className="p-6">
                      <div className="w-10 h-10 rounded-full bg-indigo text-white flex items-center justify-center mx-auto mb-4 font-bold">
                        {step.step}
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-6 h-6 text-indigo" />
                      </div>
                      <h3 className="font-heading font-semibold text-lg text-gray-900 dark:text-white mb-2">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {step.description}
                      </p>
                    </CardContent>
                  </Card>
                  {index < processSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                      <ArrowRight className="w-6 h-6 text-gray-300" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-teal">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading font-bold text-3xl lg:text-4xl text-white mb-4">
            Need a Custom Solution?
          </h2>
          <p className="text-white/90 text-lg mb-8">
            Every shipment is unique. Tell us about your requirements and we'll create 
            a tailored solution for your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quote">
              <Button 
                size="lg" 
                className="bg-white text-teal hover:bg-white/90 font-semibold"
                data-testid="button-services-quote"
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
                data-testid="button-services-contact"
              >
                Contact Our Team
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
