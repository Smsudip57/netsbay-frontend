import { Button } from "../components/ui/button"
import { Globe, HardDrive, Layers, Server, Shield, Zap, Mail, Phone, MapPin } from "lucide-react"
import {MarketingNavbar as Navbar} from "../components/marketing/Navbar"
import Footer from "../components/marketing/footer"
import PricingCard from "../components/marketing/pricing-card"
import FaqAccordion from "../components/marketing/faq-accordion"
import ContactForm from "../components/marketing/contact-form"
import FeatureCard from "../components/marketing/feature-card"
import React, { useEffect, useRef, useState } from "react"
import { Star as StarOutline } from "lucide-react";

// Full star component
const StarFull = (props) => (
  <svg {...props} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
  </svg>
);

// Half star component
const StarHalf = (props) => (
  <svg {...props} viewBox="0 0 24 24">
    <defs>
      <linearGradient id="halfStarGradient">
        <stop offset="50%" stopColor="currentColor" />
        <stop offset="50%" stopColor="transparent" stopOpacity="1" />
      </linearGradient>
    </defs>
    <path fill="url(#halfStarGradient)" d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="0.5" />
  </svg>
);

// You can use the imported StarOutline from lucide-react as your empty star
// Or define your own empty star component if needed
const Star = StarOutline;

export default function Home() {
  // Use ref to track initialization
  const spiralInitialized = useRef(false);
  
  useEffect(() => {
    // Only run once
    if (spiralInitialized.current) return;
    
    const createSpiral = () => {
      const spiralContainer = document.getElementById("spiral");
      if (!spiralContainer) {
        console.warn("Spiral container not found");
        return;
      }
      
      // Clear existing content
      spiralContainer.innerHTML = '';
      
      const N = 300; // Reduced for better performance
      const SIZE = 400;
      const DOT_RADIUS = 2;
      const MARGIN = 2;
      const DURATION = 2;
      const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
      const CENTER = SIZE / 2;
      const MAX_RADIUS = CENTER - MARGIN - DOT_RADIUS;
      const svgNS = "http://www.w3.org/2000/svg";
      
      const svg = document.createElementNS(svgNS, "svg");
      svg.setAttribute("width", String(SIZE));
      svg.setAttribute("height", String(SIZE));
      svg.setAttribute("viewBox", `0 0 ${SIZE} ${SIZE}`);
      spiralContainer.appendChild(svg);
      
      for (let i = 0; i < N; i++) {
        const idx = i + 0.5;
        const frac = idx / N;
        const r = Math.sqrt(frac) * MAX_RADIUS;
        const theta = idx * GOLDEN_ANGLE;
        const x = CENTER + r * Math.cos(theta);
        const y = CENTER + r * Math.sin(theta);
        
        // Perfect SVG circle
        const c = document.createElementNS(svgNS, "circle");
        c.setAttribute("cx", String(x));  // Convert to string
        c.setAttribute("cy", String(y));  // Convert to string
        c.setAttribute("r", String(DOT_RADIUS));  // Convert to string
        c.setAttribute("fill", "rgba(18, 38, 76, 0.5)");
        svg.appendChild(c);
        
        // Only animate every 3rd dot for better performance
        if (i % 3 === 0) {
          // Radius pulse
          const animR = document.createElementNS(svgNS, "animate");
          animR.setAttribute("attributeName", "r");
          animR.setAttribute(
            "values",
            `${DOT_RADIUS * 0.5};${DOT_RADIUS * 1.5};${DOT_RADIUS * 0.5}`
          );
          animR.setAttribute("dur", `${DURATION}s`);
          animR.setAttribute("begin", `${frac * DURATION}s`);
          animR.setAttribute("repeatCount", "indefinite");
          animR.setAttribute("calcMode", "spline");
          animR.setAttribute("keySplines", "0.4 0 0.6 1;0.4 0 0.6 1");
          c.appendChild(animR);
          
          // Opacity pulse
          const animO = document.createElementNS(svgNS, "animate");
          animO.setAttribute("attributeName", "opacity");
          animO.setAttribute("values", "0.3;1;0.3");
          animO.setAttribute("dur", `${DURATION}s`);
          animO.setAttribute("begin", `${frac * DURATION}s`);
          animO.setAttribute("repeatCount", "indefinite");
          animO.setAttribute("calcMode", "spline");
          animO.setAttribute("keySplines", "0.4 0 0.6 1;0.4 0 0.6 1");
          c.appendChild(animO);
        }
      }
      
      spiralInitialized.current = true;
    };

    // Delay initialization to ensure DOM is ready
    setTimeout(createSpiral, 500);
    
    // Cleanup function
    return () => {
      const spiralContainer = document.getElementById("spiral");
      if (spiralContainer) {
        spiralContainer.innerHTML = '';
      }
    };
  }, []); // Empty dependency array means this runs once on mount

  const TrustBox = () => {
    const ref = useRef(null);
    const [rating, setRating] = useState({
      score: 4.8,
      reviewCount: 247,
      maxStars: 5
    });
    
    // useEffect(() => {
    //   // Load Trustpilot widget when available
    //   if (window.Trustpilot) {
    //     window.Trustpilot.loadFromElement(ref.current, true);
    //   }
    // }, []);
    
    // Generate star display
    const renderStars = () => {
      const stars = [];
      const fullStars = Math.floor(rating.score);
      const hasHalfStar = rating.score % 1 >= 0.5;
      
      for (let i = 0; i < rating.maxStars; i++) {
        if (i < fullStars) {
          stars.push(<StarFull key={i} className="h-5 w-5 text-yellow-400" />);
        } else if (i === fullStars && hasHalfStar) {
          stars.push(<StarHalf key={i} className="h-5 w-5 text-yellow-400" />);
        } else {
          stars.push(<Star key={i} className="h-5 w-5 text-gray-500" />);
        }
      }
      return stars;
    };
  
    return (
      <div className="w-full max-w-3xl">
        <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900/90 shadow-2xl p-5 transition-all hover:border-blue-600/50 group">
          {/* Hidden div to load actual Trustpilot widget data */}
          <div ref={ref} className="hidden trustpilot-widget" data-locale="en-US" data-template-id="5419b6a8b0d04a076446a9ad" data-businessunit-id="your-business-id" data-style-height="24px" data-style-width="100%" data-theme="dark" data-stars="1,2,3,4,5"></div>
          
          {/* Custom UI - Horizontal Layout */}
          <div className="flex items-center">
            {/* Left side with icon and title */}
            <div className="flex-shrink-0 pr-6 border-r border-slate-800">
              <div className="flex flex-col items-center text-center w-36">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-600/20 mb-2">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-blue-400">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white">Trustpilot</h3>
              </div>
            </div>
            
            {/* Middle section with stars and rating */}
            <div className="flex-grow px-6">
              <div className="flex flex-col">
                <div className="flex items-center mb-2">
                  {renderStars()}
                </div>
                
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold text-blue-400">{rating.score}</span>
                  <span className="text-gray-400 text-xs ml-1">out of 5</span>
                </div>
                
                <p className="text-gray-400 text-sm">
                  Based on <span className="font-medium text-white">{rating.reviewCount}</span> reviews
                </p>
                
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
                    style={{ width: `${(rating.score/rating.maxStars) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            {/* Right side with button */}
            <div className="flex-shrink-0 flex items-center justify-center pl-6 border-l border-slate-800">
              <a 
                href="https://www.trustpilot.com/review/netbay.in" 
                target="_blank" 
                rel="noopener" 
                className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-blue-600/10 border border-blue-600/20 text-blue-400 transition-colors hover:bg-blue-600/20 whitespace-nowrap"
              >
                <span>Read Reviews</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                  <path d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  };

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
              <div className="inline-block rounded-lg bg-blue-600/10 w-max px-3 py-1 text-sm text-blue-400 mb-4 border border-blue-600/20">
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
                  {["https://st2.depositphotos.com/1006318/5909/v/450/depositphotos_59094701-stock-illustration-businessman-profile-icon.jpg", "https://www.shutterstock.com/image-vector/man-shirt-tie-businessman-avatar-600nw-548848999.jpg", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaq6aK4V6ica7lTtCpSBKHgx-qct4usXKpOQx_Qp98BSpidHWS3EldaEpYkR7EjK-9gFA&usqp=CAU"].map((i) => (
                    <div
                      key={i}
                      className={`inline-block h-8 w-8 rounded-full bg-slate-800 border-2 border-slate-950  bg-cover bg-center`}
                      style={{ backgroundImage: `url(${i})` }}
                    ></div>
                  ))}
                </div>
                <p className="text-sm text-slate-400">
                  <span className="text-blue-400 font-medium">100+</span> customers trust NETBAY
                </p>
              </div>
            </div>
            <div className="relative lg:mx-auto ">
            <div id="spiral" className="absolute z-0 top-[-30%] left-[-25%] translate-x--1/4 translate-y--1/3"></div>
              <div className="relative invisi rounded-xl overflow-hidden border border-slate-800 bg-slate-900/90 shadow-2xl">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Server className="h-5 w-5 text-blue-400" />
                      <span className="font-medium text-white mr-6">VPS Control Panel</span>
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
            {/* <p className="text-sm text-slate-400">TrustPilot</p> */}
            <div className="flex flex-wrap justify-center gap-8 md:gap-12 lg:gap-16">
              {/* {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-center">
                  <div className="h-8 w-24 bg-slate-800/50 rounded"></div>
                </div>
              ))} */}
                <div className="flex items-center justify-center">
                  
                  <TrustBox />
                </div>
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
              description="Powered by SSD storage and latest-gen CPUs for lightning-fast loading times."
            />
            <FeatureCard
              icon={<Shield className="h-6 w-6 text-purple-400" />}
              title="Advanced Security"
              description="Security protection, firewall, and regular security updates to keep your data safe."
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
            <p className="max-w-[700px] text-slate-400 md:text-xl">
              Starting at just <span className="text-blue-400 font-medium">₹499/month</span> .
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <PricingCard
              title="Starter VPS"
              price="₹499"
              description="Perfect for small websites and applications"
              features={[
                "2 vCPU Cores",
                "4 GB RAM",
                "10 GB Enterprise SSD",
                "2 TB Bandwidth",
                "1 IPv4 Address",
                "24/7 Support",
              ]}
              buttonText="Get Started"
              popular={false}
            />
            <PricingCard
              title="Business VPS"
              price="₹699"
              description="Ideal for growing businesses and e-commerce"
              features={[
                "4 vCPU Cores",
                "8 GB RAM",
                "20 GB Enterprise SSD",
                "4 TB Bandwidth",
                "1 IPv4 Address",
                "24/7 Priority Support",
              ]}
              buttonText="Get Started"
              popular={true}
            />
            <PricingCard
              title="Enterprise VPS"
              price="₹1199"
              description="For high-traffic websites and resource-intensive applications"
              features={[
                "8 vCPU Cores",
                "16 GB RAM",
                "50 GB Enterprise SSD",
                "8 TB Bandwidth",
                "1 IPv4 Addresses",
                "24/7 Priority Support",
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
              <div className="inline-block w-max rounded-lg bg-blue-600/10 px-3 py-1 text-sm text-blue-400 mb-4 border border-blue-600/20">
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
                    <p className="font-medium text-white">contact@netbay.in</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-600/10 text-blue-400">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Phone</p>
                    <p className="font-medium text-white">+91 95695 99061</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-600/10 text-blue-400">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Address</p>
                    <p className="font-medium text-white">1934 Vishal Vihar, Dubagga, Lucknow 226003</p>
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
