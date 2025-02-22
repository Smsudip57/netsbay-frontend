import { MarketingNavbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";

const Refund = () => {
  return (
    <div className="min-h-screen bg-background">
      <MarketingNavbar />
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Refund and Cancellation Policy</h1>
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="lead">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2>1. Refund Policy</h2>
          <p>We offer a 30-day money-back guarantee for our VPS services under the following conditions:</p>
          <ul>
            <li>Service has been active for less than 30 days</li>
            <li>Account is in good standing</li>
            <li>No terms of service violations</li>
          </ul>

          <h2>2. Cancellation Process</h2>
          <p>To cancel your service:</p>
          <ul>
            <li>Log into your client area</li>
            <li>Select the service you wish to cancel</li>
            <li>Submit a cancellation request</li>
            <li>Receive confirmation within 24 hours</li>
          </ul>

          <h2>3. Pro-rated Refunds</h2>
          <p>For annual plans cancelled after 30 days, we provide pro-rated refunds for the unused portion of the service.</p>

          <h2>4. Non-refundable Items</h2>
          <p>The following items are non-refundable:</p>
          <ul>
            <li>Domain registration fees</li>
            <li>SSL certificates</li>
            <li>Custom configurations</li>
            <li>Administrative fees</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Refund;