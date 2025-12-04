import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";

export default function Privacy() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Badge className="mb-4 bg-indigo/10 text-indigo border-indigo/20">Legal</Badge>
          <h1 className="font-heading font-bold text-4xl lg:text-5xl text-gray-900 dark:text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Last updated: December 2024
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h2>Introduction</h2>
            <p>
              Blue Kailash International ("we," "our," or "us") is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
              when you visit our website bluekailash.international and use our services.
            </p>

            <h2>Information We Collect</h2>
            <h3>Personal Information</h3>
            <p>
              We may collect personal information that you voluntarily provide to us when you:
            </p>
            <ul>
              <li>Register for an account</li>
              <li>Request a quote</li>
              <li>Contact us through our website</li>
              <li>Subscribe to our newsletter</li>
              <li>Use our shipment tracking services</li>
            </ul>
            <p>
              This information may include your name, email address, phone number, company name, 
              shipping addresses, and other relevant business information.
            </p>

            <h3>Transaction Information</h3>
            <p>
              When you engage our services, we collect information related to your shipments, 
              including product descriptions, quantities, origins, destinations, and shipping preferences.
            </p>

            <h2>How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Process and manage your quote requests and shipments</li>
              <li>Communicate with you about your orders and services</li>
              <li>Provide shipment tracking information</li>
              <li>Send you important updates and service notifications</li>
              <li>Improve our website and services</li>
              <li>Comply with legal and regulatory requirements</li>
            </ul>

            <h2>Information Sharing</h2>
            <p>
              We may share your information with third parties only in the following circumstances:
            </p>
            <ul>
              <li>With shipping carriers and logistics partners to fulfill your shipments</li>
              <li>With customs authorities as required by law</li>
              <li>With service providers who assist in operating our business</li>
              <li>When required by law or to protect our legal rights</li>
            </ul>

            <h2>Data Security</h2>
            <p>
              We implement appropriate technical and organizational security measures to protect 
              your personal information against unauthorized access, alteration, disclosure, or destruction. 
              All data is stored securely and access is limited to authorized personnel only.
            </p>

            <h2>Document Storage</h2>
            <p>
              Shipping documents, invoices, and related files uploaded to our platform are stored 
              securely. We retain these documents for the period required by applicable trade and 
              customs regulations.
            </p>

            <h2>Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your information (subject to legal requirements)</li>
              <li>Opt out of marketing communications</li>
            </ul>

            <h2>Cookies</h2>
            <p>
              Our website uses cookies to enhance your browsing experience and analyze site traffic. 
              You can control cookie settings through your browser preferences.
            </p>

            <h2>Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes 
              by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy or our data practices, please contact us at:
            </p>
            <p>
              <strong>Blue Kailash International</strong><br />
              Email: privacy@bluekailash.international<br />
              Address: Hyderabad, Telangana, India
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
