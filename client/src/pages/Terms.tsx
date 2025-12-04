import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";

export default function Terms() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Badge className="mb-4 bg-indigo/10 text-indigo border-indigo/20">Legal</Badge>
          <h1 className="font-heading font-bold text-4xl lg:text-5xl text-gray-900 dark:text-white mb-4">
            Terms & Conditions
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
            <h2>Agreement to Terms</h2>
            <p>
              By accessing or using the services of Blue Kailash International ("Company," "we," "us," or "our"), 
              you agree to be bound by these Terms and Conditions. If you do not agree to all the terms 
              and conditions, you may not access the website or use our services.
            </p>

            <h2>Services</h2>
            <p>
              Blue Kailash International provides import-export services including but not limited to:
            </p>
            <ul>
              <li>Product sourcing and procurement</li>
              <li>Export and import facilitation</li>
              <li>Freight forwarding (sea, air, and road)</li>
              <li>Customs clearance and documentation</li>
              <li>Warehousing and distribution</li>
              <li>Shipment tracking and management</li>
            </ul>

            <h2>Quotes and Pricing</h2>
            <p>
              Quote requests submitted through our website are for informational purposes only and do not 
              constitute a binding contract. Final pricing is subject to:
            </p>
            <ul>
              <li>Verification of product details and quantities</li>
              <li>Current shipping rates and carrier availability</li>
              <li>Applicable customs duties and taxes</li>
              <li>Currency exchange rates at the time of transaction</li>
            </ul>
            <p>
              All quotes are valid for 7 days from the date of issue unless otherwise specified.
            </p>

            <h2>User Accounts</h2>
            <p>
              When you create an account with us, you must provide accurate and complete information. 
              You are responsible for:
            </p>
            <ul>
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use</li>
            </ul>

            <h2>Shipment Terms</h2>
            <h3>Documentation</h3>
            <p>
              Customers are responsible for providing accurate and complete documentation for all shipments. 
              This includes product descriptions, HS codes, and any required certifications.
            </p>
            
            <h3>Prohibited Items</h3>
            <p>
              We do not handle shipments of items that are prohibited by law or restricted under 
              international trade regulations. The customer is responsible for ensuring compliance 
              with all applicable laws.
            </p>

            <h3>Insurance</h3>
            <p>
              Unless specifically requested and confirmed in writing, shipments are not insured. 
              We recommend customers obtain appropriate cargo insurance for valuable shipments.
            </p>

            <h2>Liability Limitations</h2>
            <p>
              Blue Kailash International shall not be liable for:
            </p>
            <ul>
              <li>Delays caused by customs inspections or government actions</li>
              <li>Losses due to acts of God, war, or civil unrest</li>
              <li>Damage caused by improper packaging by the shipper</li>
              <li>Indirect, consequential, or incidental damages</li>
            </ul>
            <p>
              Our liability is limited to the terms and conditions of the relevant carrier or 
              freight forwarder engaged for the shipment.
            </p>

            <h2>Payment Terms</h2>
            <p>
              Payment terms are specified in individual quotations and invoices. Unless otherwise agreed:
            </p>
            <ul>
              <li>A deposit may be required before processing shipments</li>
              <li>Final payment is due upon delivery or as specified in the invoice</li>
              <li>Late payments may incur additional charges</li>
            </ul>

            <h2>Intellectual Property</h2>
            <p>
              All content on our website, including logos, text, graphics, and software, is the 
              property of Blue Kailash International and is protected by copyright and trademark laws.
            </p>

            <h2>Dispute Resolution</h2>
            <p>
              Any disputes arising from these Terms and Conditions shall be resolved through 
              good faith negotiation. If a resolution cannot be reached, disputes shall be 
              subject to the jurisdiction of courts in Hyderabad, India.
            </p>

            <h2>Governing Law</h2>
            <p>
              These Terms and Conditions are governed by and construed in accordance with the 
              laws of India, without regard to conflict of law principles.
            </p>

            <h2>Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms and Conditions at any time. Changes 
              will be effective immediately upon posting on our website. Continued use of our 
              services constitutes acceptance of the modified terms.
            </p>

            <h2>Contact Information</h2>
            <p>
              For questions about these Terms and Conditions, please contact us at:
            </p>
            <p>
              <strong>Blue Kailash International</strong><br />
              Email: legal@bluekailash.international<br />
              Address: Hyderabad, Telangana, India
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
