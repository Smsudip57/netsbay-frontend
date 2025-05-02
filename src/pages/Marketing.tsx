import { Button } from "../components/ui/button"
import { Globe, HardDrive, Layers, Server, Shield, Zap, Mail, Phone, MapPin } from "lucide-react"
import {MarketingNavbar as Navbar} from "../components/marketing/Navbar"
import Footer from "../components/marketing/footer"
import PricingCard from "../components/marketing/pricing-card"
import FaqAccordion from "../components/marketing/faq-accordion"
import ContactForm from "../components/marketing/contact-form"
import FeatureCard from "../components/marketing/feature-card"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-slate-950">
      <Navbar />

      {/* Hero Section */}
      <section id="home" className="relative py-20 md:py-32 overflow-hidden  z-[1]">
        <canvas id="bubbleCanvas" className="absolute top-0 left-0 z-[0] hover:cursor-pointer"></canvas>
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-radial from-purple-900/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 h-[300px] bg-gradient-radial from-blue-900/20 to-transparent"></div>
        </div>
        <div className="container relative z-10 px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="inline-block rounded-lg bg-blue-600/10 px-3 py-1 text-sm text-blue-400 mb-4 border border-blue-600/20">
                Premium VPS Hosting
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-white">
                Powerful VPS Hosting for Your <span className="text-blue-400">Digital Success</span>
              </h1>
              <p className="max-w-[600px] text-slate-400 md:text-xl">
                High-performance virtual private servers with guaranteed resources, 99.9% uptime, and 24/7 expert
                support.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Get Started
                </Button>
                <Button size="lg" variant="outline" className="border-blue-600/50 text-blue-400 hover:bg-blue-600/10">
                  View Plans
                </Button>
              </div>
              <div className="flex items-center gap-4 mt-6">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="inline-block h-8 w-8 rounded-full bg-slate-800 border-2 border-slate-950"
                    ></div>
                  ))}
                </div>
                <p className="text-sm text-slate-400">
                  <span className="text-blue-400 font-medium">500+</span> customers trust NETBAY
                </p>
              </div>
            </div>
            <div className="relative lg:ml-auto">
            <div id="spiral" className="absolute z-0 top-[-30%] left-[-25%] translate-x--1/4 translate-y--1/3"></div>
              <div className="relative invisi rounded-xl overflow-hidden border border-slate-800 bg-slate-900/90 shadow-2xl">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Server className="h-5 w-5 text-blue-400" />
                      <span className="font-medium text-white">VPS Control Panel</span>
                    </div>
                    <div className="flex gap-1">
                      <div className="h-3 w-3 rounded-full bg-red-500"></div>
                      <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <div className="rounded bg-slate-800 p-2 text-center">
                        <div className="font-medium text-white">CPU</div>
                        <div className="text-blue-400">8 Cores</div>
                      </div>
                      <div className="rounded bg-slate-800 p-2 text-center">
                        <div className="font-medium text-white">RAM</div>
                        <div className="text-blue-400">16 GB</div>
                      </div>
                      <div className="rounded bg-slate-800 p-2 text-center">
                        <div className="font-medium text-white">SSD</div>
                        <div className="text-blue-400">100 GB</div>
                      </div>
                    </div>
                    <div className="h-24 rounded-md bg-slate-800 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-sm text-slate-400">Server Status</div>
                        <div className="text-green-400 font-medium flex items-center justify-center gap-1 mt-1">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                          </span>
                          Online
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -z-10 -bottom-6 -right-6 h-48 w-48 rounded-full bg-purple-600/20 blur-2xl"></div>
              <div className="absolute -z-10 -top-6 -left-6 h-48 w-48 rounded-full bg-blue-600/20 blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-12 border-y border-slate-800">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <p className="text-sm text-slate-400">Trusted by leading companies worldwide</p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-12 lg:gap-16">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-center">
                  <div className="h-8 w-24 bg-slate-800/50 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 scroll-mt-16" id="features">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="inline-block rounded-lg bg-blue-600/10 px-3 py-1 text-sm text-blue-400 mb-4 border border-blue-600/20">
              Features
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
              Why Choose NETBAY <span className="text-blue-400">VPS Hosting</span>
            </h2>
            <p className="max-w-[700px] text-slate-400 md:text-xl">
              Our VPS hosting solutions are designed to provide maximum performance, reliability, and security for your
              online projects.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Zap className="h-6 w-6 text-blue-400" />}
              title="High Performance"
              description="Powered by NVMe SSD storage and latest-gen CPUs for lightning-fast loading times."
            />
            <FeatureCard
              icon={<Shield className="h-6 w-6 text-purple-400" />}
              title="Advanced Security"
              description="DDoS protection, firewall, and regular security updates to keep your data safe."
            />
            <FeatureCard
              icon={<Server className="h-6 w-6 text-blue-400" />}
              title="Dedicated Resources"
              description="Guaranteed CPU, RAM, and storage resources exclusively for your applications."
            />
            <FeatureCard
              icon={<Globe className="h-6 w-6 text-purple-400" />}
              title="Global Network"
              description="Multiple data centers worldwide for low-latency access from anywhere."
            />
            <FeatureCard
              icon={<Layers className="h-6 w-6 text-blue-400" />}
              title="Scalable Solutions"
              description="Easily upgrade resources as your business grows without any downtime."
            />
            <FeatureCard
              icon={<HardDrive className="h-6 w-6 text-purple-400" />}
              title="Full Root Access"
              description="Complete control over your server environment with root-level access."
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-slate-950 scroll-mt-16" id="pricing">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="inline-block rounded-lg bg-blue-600/10 px-3 py-1 text-sm text-blue-400 mb-4 border border-blue-600/20">
              Pricing
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
              Simple, Transparent <span className="text-blue-400">Pricing</span>
            </h2>
            <p className="max-w-[700px] text-slate-400 md:text-xl">
              Choose the perfect VPS plan for your needs with no hidden fees or long-term commitments.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <PricingCard
              title="Starter VPS"
              price="$19.99"
              description="Perfect for small websites and applications"
              features={[
                "2 vCPU Cores",
                "4 GB RAM",
                "50 GB NVMe SSD",
                "2 TB Bandwidth",
                "1 IPv4 Address",
                "24/7 Support",
              ]}
              buttonText="Get Started"
              popular={false}
            />
            <PricingCard
              title="Business VPS"
              price="$39.99"
              description="Ideal for growing businesses and e-commerce"
              features={[
                "4 vCPU Cores",
                "8 GB RAM",
                "100 GB NVMe SSD",
                "4 TB Bandwidth",
                "1 IPv4 Address",
                "24/7 Priority Support",
                "Free Domain",
              ]}
              buttonText="Get Started"
              popular={true}
            />
            <PricingCard
              title="Enterprise VPS"
              price="$79.99"
              description="For high-traffic websites and resource-intensive applications"
              features={[
                "8 vCPU Cores",
                "16 GB RAM",
                "200 GB NVMe SSD",
                "8 TB Bandwidth",
                "2 IPv4 Addresses",
                "24/7 Priority Support",
                "Free Domain",
                "Daily Backups",
              ]}
              buttonText="Get Started"
              popular={false}
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 scroll-mt-16" id="faq">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="inline-block rounded-lg bg-blue-600/10 px-3 py-1 text-sm text-blue-400 mb-4 border border-blue-600/20">
              FAQ
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
              Frequently Asked <span className="text-blue-400">Questions</span>
            </h2>
            <p className="max-w-[700px] text-slate-400 md:text-xl">
              Find answers to common questions about our VPS hosting services.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <FaqAccordion />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-slate-950 scroll-mt-16" id="contact">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="inline-block rounded-lg bg-blue-600/10 px-3 py-1 text-sm text-blue-400 mb-4 border border-blue-600/20">
                Contact Us
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
                Get in Touch with <span className="text-blue-400">Our Team</span>
              </h2>
              <p className="max-w-[600px] text-slate-400 md:text-xl">
                Have questions about our VPS hosting solutions? Our team is ready to help you find the perfect plan for
                your needs.
              </p>

              <div className="grid gap-4 mt-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-600/10 text-blue-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Email</p>
                    <p className="font-medium text-white">support@netbayhosting.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-600/10 text-blue-400">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Phone</p>
                    <p className="font-medium text-white">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-600/10 text-blue-400">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Address</p>
                    <p className="font-medium text-white">123 Tech Street, Server City, 10001</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-900/50 shadow-2xl p-6">
                <ContactForm />
              </div>
              <div className="absolute -z-10 -bottom-6 -right-6 h-48 w-48 rounded-full bg-purple-600/20 blur-2xl"></div>
              <div className="absolute -z-10 -top-6 -left-6 h-48 w-48 rounded-full bg-blue-600/20 blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
