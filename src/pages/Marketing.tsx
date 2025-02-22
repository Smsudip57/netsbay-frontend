import { Button } from "@/components/ui/button";
import { MarketingNavbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { Link } from "react-router-dom";
import { ArrowRight, Server, Shield, Zap, Check, Mail, Phone, MapPin } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

const Marketing = () => {
  const { toast } = useToast();

  const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Message sent!",
      description: "We'll get back to you as soon as possible.",
    });
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="min-h-screen bg-background">
      <MarketingNavbar />
      
      {/* Hero Section */}
      <section id="hero" className="relative py-20 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
            High-Performance VPS Solutions
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience lightning-fast performance and unmatched reliability with our Linux and Windows VPS hosting solutions. Perfect for businesses of all sizes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-base group">
              <Link to="/signup">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-base">
              <Link to="#pricing">View Pricing</Link>
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-16">
            <div className="space-y-4 p-6 rounded-lg bg-background/50 backdrop-blur-sm border">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                <Server className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-primary">99.9%</h3>
              <p className="text-muted-foreground">Uptime Guarantee</p>
            </div>
            <div className="space-y-4 p-6 rounded-lg bg-background/50 backdrop-blur-sm border">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-primary">10Gbps</h3>
              <p className="text-muted-foreground">Network Speed</p>
            </div>
            <div className="space-y-4 p-6 rounded-lg bg-background/50 backdrop-blur-sm border">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-primary">24/7</h3>
              <p className="text-muted-foreground">Expert Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-lg text-muted-foreground">Choose the perfect plan for your needs</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Starter",
                price: "29",
                features: ["2 vCPU Cores", "4GB RAM", "80GB SSD", "2TB Bandwidth"],
              },
              {
                name: "Professional",
                price: "59",
                features: ["4 vCPU Cores", "8GB RAM", "160GB SSD", "4TB Bandwidth"],
                popular: true,
              },
              {
                name: "Enterprise",
                price: "99",
                features: ["8 vCPU Cores", "16GB RAM", "320GB SSD", "8TB Bandwidth"],
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-lg p-8 bg-background/50 backdrop-blur-sm border ${
                  plan.popular ? "border-primary shadow-lg scale-105" : ""
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                )}
                <div className="text-center">
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline justify-center">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="ml-1 text-muted-foreground">/month</span>
                  </div>
                  <ul className="mt-8 space-y-4">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center justify-center gap-2">
                        <Check className="h-5 w-5 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    className="mt-8 w-full"
                    variant={plan.popular ? "default" : "outline"}
                  >
                    <Link to="/signup">Get Started</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 md:px-6 lg:px-8 bg-muted/50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground">Find answers to common questions about our VPS services</p>
          </div>
          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="item-1" className="bg-background/50 backdrop-blur-sm rounded-lg border">
              <AccordionTrigger className="px-4">What operating systems do you support?</AccordionTrigger>
              <AccordionContent className="px-4">
                We support all major Linux distributions (Ubuntu, CentOS, Debian) and Windows Server editions. You have full control over your operating system choice.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="bg-background/50 backdrop-blur-sm rounded-lg border">
              <AccordionTrigger className="px-4">How quickly can I scale my resources?</AccordionTrigger>
              <AccordionContent className="px-4">
                Resource scaling is instant. You can upgrade your CPU, RAM, and storage at any time through our control panel with zero downtime.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="bg-background/50 backdrop-blur-sm rounded-lg border">
              <AccordionTrigger className="px-4">Do you offer DDoS protection?</AccordionTrigger>
              <AccordionContent className="px-4">
                Yes, all our VPS plans include enterprise-grade DDoS protection at no additional cost to ensure your services remain online and secure.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4" className="bg-background/50 backdrop-blur-sm rounded-lg border">
              <AccordionTrigger className="px-4">What kind of support do you provide?</AccordionTrigger>
              <AccordionContent className="px-4">
                We offer 24/7 technical support through live chat, email, and ticket system. Our expert team is always ready to help with any issues.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Get in Touch</h2>
            <p className="text-lg text-muted-foreground">Have questions? We're here to help!</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p className="text-muted-foreground">support@netbay.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Phone</h3>
                  <p className="text-muted-foreground">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Location</h3>
                  <p className="text-muted-foreground">123 Server Street, Cloud City, CC 12345</p>
                </div>
              </div>
            </div>
            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Name
                  </label>
                  <Input id="name" required placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input id="email" type="email" required placeholder="john@example.com" />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">
                  Subject
                </label>
                <Input id="subject" required placeholder="How can we help?" />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Message
                </label>
                <Textarea
                  id="message"
                  required
                  placeholder="Tell us more about your needs..."
                  className="min-h-[150px]"
                />
              </div>
              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Marketing;
