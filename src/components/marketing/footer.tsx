import { Link } from "react-router-dom"
// import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800">
      <div className="container px-4 md:px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <Link to="/#home" className="flex items-center gap-2">
              <img src="/netbaylogo.png" alt="NETBAY Logo" width={32} height={32} className="rounded-full" />
              <span className="text-xl font-bold text-white">NETBAY</span>
            </Link>
            <p className="text-slate-400 max-w-md">
              NETBAY HOSTING SOLUTIONS provides high-performance VPS hosting services with 24/7 support, guaranteed
              resources, and 99.9% uptime.
            </p>
            <div className="flex gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Button>
            </div>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-white">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                    Press
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-white">Products</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                    VPS Hosting
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                    Web Hosting
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                    Dedicated Servers
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                    Cloud Hosting
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-white">Support</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="#contact" className="text-sm text-slate-400 hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                    Status
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                    Documentation
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="text-sm text-slate-400">
            © {new Date().getFullYear()} NETBAY HOSTING SOLUTIONS. All rights reserved.
          </div>
          <div className="flex flex-wrap gap-6 text-sm">
            <Link to="#" className="text-slate-400 hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link to="#" className="text-slate-400 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="#" className="text-slate-400 hover:text-white transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
