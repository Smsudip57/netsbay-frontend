import { MarketingNavbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <MarketingNavbar />
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Terms and Conditions</h1>
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="lead">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2>1. Service Agreement</h2>
          <p>By using our VPS hosting services, you agree to these terms and conditions. We reserve the right to modify these terms at any time.</p>

          <h2>2. Account Responsibilities</h2>
          <p>You are responsible for:</p>
          <ul>
            <li>Maintaining the security of your account</li>
            <li>All activities that occur under your account</li>
            <li>Compliance with all applicable laws</li>
          </ul>

          <h2>3. Service Level Agreement</h2>
          <p>We guarantee 99.9% uptime for all VPS services. Compensation for downtime will be provided as service credits.</p>

          <h2>4. Acceptable Use</h2>
          <p>Prohibited activities include:</p>
          <ul>
            <li>Illegal content distribution</li>
            <li>Spam or unsolicited email</li>
            <li>Network abuse</li>
            <li>Resource overuse affecting other users</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;