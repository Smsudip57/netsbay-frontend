import { MarketingNavbar } from "@/components/marketing/Navbar";
import Footer from "../components/marketing/footer"
import { useEffect } from "react";

const Terms = () => {


    useEffect(() => {
      if (typeof window !== 'undefined') {
        const handleLoad = () => {
          window.scrollTo(0, 0);
        }
        if (document.readyState === 'complete') {
          window.scrollTo(0, 0);
        } else {
          window.addEventListener('load', handleLoad);
          return () => window.removeEventListener('load', handleLoad);
        }
      }
    }, []);


  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-slate-950">
      <MarketingNavbar />
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Terms & Conditions</h1>
            <div className="h-1 w-20 bg-blue-600 mx-auto"></div>
            <p className="text-slate-400 mt-6">
              <strong className="text-white">Effective Date:</strong> May 1, 2024
            </p>
          </div>
          
          {/* Introduction */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl">
            <p className="text-slate-300 leading-relaxed">
              Welcome to <strong className="text-white">Netbay.in</strong>, operated by <strong className="text-white">Technoconnect IT Solutions Pvt Ltd</strong> ("we", "our", or "us"). By using our website and services, you agree to comply with and be bound by the following terms and conditions.
            </p>
          </div>
          
          {/* Sections */}
          <div className="space-y-8">
            {/* Section 1 */}
            <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl">
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-600/20 text-blue-400 mr-3 text-sm">1</span>
                Services Provided
              </h2>
              <p className="text-slate-300 leading-relaxed">
                We provide Virtual Private Server (VPS) hosting solutions and digital infrastructure services. All services are offered under the brand <strong className="text-white">Netbay</strong>.
              </p>
            </section>
            
            {/* Section 2 */}
            <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl">
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-600/20 text-blue-400 mr-3 text-sm">2</span>
                Acceptable Use
              </h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                You agree not to use our services for any unlawful or malicious purposes including but not limited to:
              </p>
              <ul className="space-y-2 pl-6 text-slate-300 mb-4">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Spamming, phishing, or malware distribution</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Hosting illegal or copyrighted content</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>DDoS attacks or unauthorized scanning</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Fraudulent or malicious activity</span>
                </li>
              </ul>
              <div className="bg-blue-900/20 border border-blue-900/30 rounded-lg p-4">
                <p className="text-blue-300 font-medium">
                  We reserve the right to suspend or terminate services without notice if such activity is detected. No refund will be issued.
                </p>
              </div>
            </section>
            
            {/* Sections 3-9 */}
            <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl">
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-600/20 text-blue-400 mr-3 text-sm">3</span>
                Service Delivery
              </h2>
              <p className="text-slate-300 leading-relaxed">
                All services are delivered digitally. VPS provisioning occurs within <strong className="text-white">15 to 30 minutes</strong> after payment confirmation.
              </p>
            </section>
            
            <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl">
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-600/20 text-blue-400 mr-3 text-sm">4</span>
                Shipping Policy
              </h2>
              <p className="text-slate-300 leading-relaxed">
                No physical goods are shipped. All services are provided electronically.
              </p>
            </section>
            
            <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl">
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-600/20 text-blue-400 mr-3 text-sm">5</span>
                Refund Policy
              </h2>
              <ul className="space-y-2 pl-6 text-slate-300">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Refunds are available within <strong className="text-white">24 hours</strong> of purchase.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>No refunds for custom builds, discounts, or policy violations.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>All refund requests must be emailed to <a href="mailto:contact@netbay.in" className="text-blue-400 hover:text-blue-300 underline">contact@netbay.in</a>.</span>
                </li>
              </ul>
            </section>
            
            <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl">
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-600/20 text-blue-400 mr-3 text-sm">6</span>
                Suspension & Termination
              </h2>
              <p className="text-slate-300 leading-relaxed">
                Services may be suspended or terminated for violating terms or engaging in malicious activity. No refund will be provided in such cases.
              </p>
            </section>
            
            <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl">
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-600/20 text-blue-400 mr-3 text-sm">7</span>
                Data Access and Privacy
              </h2>
              <p className="text-slate-300 leading-relaxed">
                We protect your data using industry standards. No third party, except Indian government or legal authorities under proper orders, will be granted access.
              </p>
            </section>
            
            <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl">
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-600/20 text-blue-400 mr-3 text-sm">8</span>
                Modification of Terms
              </h2>
              <p className="text-slate-300 leading-relaxed">
                We may update our terms. Continued use after changes implies agreement. Notices will be posted on our website.
              </p>
            </section>
            
            <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl">
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-600/20 text-blue-400 mr-3 text-sm">9</span>
                Contact
              </h2>
              <p className="text-slate-300 leading-relaxed">
                Email: <a href="mailto:contact@netbay.in" className="text-blue-400 hover:text-blue-300 underline">contact@netbay.in</a>
              </p>
            </section>
          </div>
          
          {/* Footer note */}
          <div className="text-center text-slate-400 text-sm mt-12">
            <p>Last updated: May 1, 2024</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Terms;