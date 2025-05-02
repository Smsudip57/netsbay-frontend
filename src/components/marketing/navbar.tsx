"use client"

import { useState, useEffect,  useRef, useCallback  } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, X } from "lucide-react"

interface Particle {
  x: number;
  y: number;
  size: number;
  density: number;
  color: string;
  baseX: number;
  baseY: number;
  velocity: number;
  angle: number;
  draw: () => void;
  update: () => void;
}

interface MousePosition {
  x: number | null;
  y: number | null;
  radius: number;
}
export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navLinks = [
    { name: "Home", to: "#home" },
    { name: "Features", to: "#features" },
    { name: "Pricing", to: "#pricing" },
    { name: "FAQ", to: "#faq" },
    { name: "Contact", to: "#contact" },
  ]

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])



  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-black/80 backdrop-blur-sm">

      <div className="container flex h-16 items-center justify-between px-4 md:px-6 relative">
        
        <div className="flex items-center gap-2">
          <Link to="/#home" className="flex items-center gap-2">
            <img src="/netbaylogo.png" alt="NETBAY Logo" width={32} height={32} className="rounded-full" />
            <span className="text-xl font-bold text-white">NETBAY</span>
          </Link>
        </div>
        <nav className="hidden md:flex gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.to}
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex gap-3">
            <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800">
              Sign In
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Get Started</Button>
          </div>
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-slate-300">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-xs bg-slate-950 border-slate-800 p-0">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between border-b border-slate-800 p-4">
                  <Link to="/#home" className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                    <img src="/netbaylogo.png" alt="NETBAY Logo" width={32} height={32} className="rounded-full" />
                    <span className="text-xl font-bold text-white">NETBAY</span>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
                    <X className="h-6 w-6 text-slate-300" />
                    <span className="sr-only">Close menu</span>
                  </Button>
                </div>
                <nav className="flex flex-col gap-1 p-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.to}
                      className="flex items-center py-2 text-base font-medium text-slate-300 hover:text-white transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>
                <div className="mt-auto border-t border-slate-800 p-4 space-y-2">
                  <Button
                    variant="outline"
                    className="w-full border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800"
                  >
                    Sign In
                  </Button>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Get Started</Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
