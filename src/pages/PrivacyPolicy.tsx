import { MarketingNavbar } from "@/components/marketing/Navbar";
import Footer from "../components/marketing/footer"
import { useEffect } from "react";

const PrivacyPolicy = () => {


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
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Privacy Policy</h1>
            <div className="h-1 w-20 bg-blue-600 mx-auto"></div>
            <p className="text-slate-400 mt-6">
              <strong className="text-white">Effective Date:</strong> May 1, 2024
            </p>
          </div>
          
          {/* Introduction */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl">
            <p className="text-slate-300 leading-relaxed">
              This policy explains how <strong className="text-white">Technoconnect IT Solutions Pvt Ltd</strong> handles your data while using <strong className="text-white">Netbay.in</strong>.
            </p>
          </div>
          
          {/* Sections */}
          <div className="space-y-8">
            {/* Section 1 */}
            <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl">
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-600/20 text-blue-400 mr-3 text-sm">1</span>
                Information We Collect
              </h2>
              <ul className="space-y-2 pl-6 text-slate-300">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Full name, email, and contact number</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Account activity and server usage data</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>IP address and browser/device info</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Billing and payment details</span>
                </li>
              </ul>
            </section>
            
            {/* Section 2 */}
            <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl">
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-600/20 text-blue-400 mr-3 text-sm">2</span>
                Why We Collect It
              </h2>
              <ul className="space-y-2 pl-6 text-slate-300">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>To create and manage your account</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>To provide support and deliver services</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>To process billing and detect fraud</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>To comply with Indian law</span>
                </li>
              </ul>
            </section>
            
            {/* Section 3 */}
            <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl">
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-600/20 text-blue-400 mr-3 text-sm">3</span>
                Data Sharing
              </h2>
              <div className="bg-blue-900/20 border border-blue-900/30 rounded-lg p-4">
                <p className="text-blue-300">
                  We do <strong>not</strong> share or sell your data. We only share information when legally required by Indian authorities.
                </p>
              </div>
            </section>
            
            {/* Section 4 */}
            <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl">
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-600/20 text-blue-400 mr-3 text-sm">4</span>
                Security Measures
              </h2>
              <p className="text-slate-300 leading-relaxed">
                We use SSL, firewalls, encrypted storage, and access control to protect your information. Only authorized staff have access.
              </p>
            </section>
            
            {/* Section 5 */}
            <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl">
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-600/20 text-blue-400 mr-3 text-sm">5</span>
                Cookies and Tracking
              </h2>
              <p className="text-slate-300 leading-relaxed">
                We use cookies for session management and analytics. You can disable cookies in your browser settings.
              </p>
            </section>
            
            {/* Section 6 */}
            <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl">
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-600/20 text-blue-400 mr-3 text-sm">6</span>
                Data Retention
              </h2>
              <p className="text-slate-300 leading-relaxed">
                We retain data for the life of your account and up to <strong className="text-white">90 days</strong> post-termination, unless required by law. You may request deletion earlier.
              </p>
            </section>
            
            {/* Section 7 */}
            <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl">
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-600/20 text-blue-400 mr-3 text-sm">7</span>
                Your Rights
              </h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                You may request to:
              </p>
              <ul className="space-y-2 pl-6 text-slate-300 mb-4">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Access your stored data</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Correct or delete your data</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Withdraw consent for data processing</span>
                </li>
              </ul>
              <p className="text-slate-300 leading-relaxed">
                Contact <a href="mailto:contact@netbay.in" className="text-blue-400 hover:text-blue-300 underline">contact@netbay.in</a> to exercise your rights.
              </p>
            </section>
            
            {/* Section 8 */}
            <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl">
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-600/20 text-blue-400 mr-3 text-sm">8</span>
                Policy Updates
              </h2>
              <p className="text-slate-300 leading-relaxed">
                We may update this Privacy Policy. Check this page regularly. Continued use means you accept the changes.
              </p>
            </section>
            
            {/* Section 9 */}
            <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl">
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-600/20 text-blue-400 mr-3 text-sm">9</span>
                Contact
              </h2>
              <p className="text-slate-300 leading-relaxed">
                For privacy concerns or questions, email: <a href="mailto:contact@netbay.in" className="text-blue-400 hover:text-blue-300 underline">contact@netbay.in</a>
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

export default PrivacyPolicy;