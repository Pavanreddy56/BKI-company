import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import { 
  ArrowRight, 
  Target, 
  Eye, 
  Award, 
  Users, 
  Globe,
  Leaf,
  Shield,
  CheckCircle2
} from "lucide-react";

const values = [
  {
    icon: Globe,
    title: "Global Reach",
    description: "Connecting Indian producers with buyers across 10+ countries through our extensive network.",
  },
  {
    icon: Shield,
    title: "Quality Assurance",
    description: "Rigorous quality checks at every stage ensure only the best products reach our customers.",
  },
  {
    icon: Leaf,
    title: "Sustainable Practices",
    description: "Committed to eco-friendly sourcing and fair trade principles for a better tomorrow.",
  },
  {
    icon: Users,
    title: "Customer Focus",
    description: "Dedicated support team ensuring smooth operations and timely deliveries.",
  },
];

const certifications = [
  "Import Export Code (IEC) Licensed",
  "GST Registered",
  "FSSAI Certified for Food Products",
  "APEDA Registered",
  "ISO 9001:2015 Compliant",
];

const milestones = [
  { year: "2023", title: "Company Founded", description: "Blue Kailash International established in Hyderabad" },
  { year: "2023", title: "First Export", description: "Successfully shipped first consignment to UAE" },
  { year: "2024", title: "Network Expansion", description: "Extended operations to 10+ countries" },
  { year: "2024", title: "Digital Platform", description: "Launched online quote and tracking system" },
];

export default function About() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-indigo/10 text-indigo border-indigo/20">About Us</Badge>
            <h1 className="font-heading font-bold text-4xl lg:text-5xl text-gray-900 dark:text-white mb-6">
              About Blue Kailash International
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
              Blue Kailash International is a Hyderabad-based import-export startup specializing 
              in agricultural produce, premium spices, textiles and artisanal handicrafts.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-heading font-bold text-3xl text-gray-900 dark:text-white mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                <p>
                  Founded with a vision to empower Indian SMEs and growers, Blue Kailash International 
                  bridges the gap between local producers and global markets. Our name draws inspiration 
                  from the majestic Kailash mountain — representing stability, trust, and reaching new heights.
                </p>
                <p>
                  We combine deep local supplier relationships with global logistics expertise to help 
                  small and medium producers reach international buyers. Our team handles everything 
                  from quality checks, packing and documentation to freight forwarding and customs clearance.
                </p>
                <p>
                  With a focus on fair trade and sustainable sourcing, we're committed to not just 
                  facilitating trade but doing so responsibly, ensuring benefits reach farmers and 
                  artisans at the grassroots level.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-indigo via-teal to-gold opacity-10 absolute inset-0" />
              <div className="relative p-8">
                <div className="grid grid-cols-2 gap-4">
                  {milestones.map((milestone, index) => (
                    <Card key={index} className="bg-white dark:bg-gray-900" data-testid={`milestone-${index}`}>
                      <CardContent className="p-4">
                        <span className="text-teal font-semibold text-sm">{milestone.year}</span>
                        <h4 className="font-heading font-semibold text-gray-900 dark:text-white mt-1">
                          {milestone.title}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {milestone.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-indigo text-white overflow-hidden" data-testid="card-vision">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center mb-6">
                  <Eye className="w-7 h-7" />
                </div>
                <h3 className="font-heading font-bold text-2xl mb-4">Our Vision</h3>
                <p className="text-white/90 leading-relaxed">
                  To be the most trusted bridge between Indian producers and global markets, 
                  enabling seamless international trade while promoting sustainable practices 
                  and fair commerce.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-teal text-white overflow-hidden" data-testid="card-mission">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center mb-6">
                  <Target className="w-7 h-7" />
                </div>
                <h3 className="font-heading font-bold text-2xl mb-4">Our Mission</h3>
                <p className="text-white/90 leading-relaxed">
                  To simplify global trade for small and medium enterprises by providing 
                  end-to-end export-import services with transparency, efficiency, and 
                  unwavering commitment to quality.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-teal/10 text-teal border-teal/20">Our Values</Badge>
            <h2 className="font-heading font-bold text-3xl lg:text-4xl text-gray-900 dark:text-white mb-4">
              What Drives Us
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="text-center hover-elevate" data-testid={`value-${index}`}>
                  <CardContent className="p-6">
                    <div className="w-14 h-14 rounded-xl bg-indigo/10 flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-7 h-7 text-indigo" />
                    </div>
                    <h3 className="font-heading font-semibold text-lg text-gray-900 dark:text-white mb-2">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-gold/10 text-gold border-gold/20">Certifications</Badge>
              <h2 className="font-heading font-bold text-3xl text-gray-900 dark:text-white mb-6">
                Licensed & Certified
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                Blue Kailash International maintains all necessary licenses and certifications 
                required for international trade operations, ensuring compliance and trust.
              </p>
              <ul className="space-y-3">
                {certifications.map((cert, index) => (
                  <li key={index} className="flex items-center gap-3" data-testid={`cert-${index}`}>
                    <CheckCircle2 className="w-5 h-5 text-teal shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{cert}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-64 h-64 rounded-2xl bg-gradient-to-br from-indigo/20 via-teal/20 to-gold/20 flex items-center justify-center">
                <Award className="w-24 h-24 text-indigo/50" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24 bg-indigo">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading font-bold text-3xl lg:text-4xl text-white mb-4">
            Want to Partner with Us?
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Let's discuss how Blue Kailash International can help you expand your global reach.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quote">
              <Button 
                size="lg" 
                className="bg-gold hover:bg-gold/90 text-gold-foreground font-semibold"
                data-testid="button-about-quote"
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
                data-testid="button-about-contact"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
