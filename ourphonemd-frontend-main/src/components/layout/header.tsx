"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MainNav, MobileNav } from "./navigation";
import { headerVariants, logoVariants } from "./navigation/animation-variants";
import { Button } from "../ui/button";
import { CalendarDays, Clock } from "lucide-react";
import { LogoIcon } from "../common/LogoIcon";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    // Mark component as mounted
    setHasMounted(true);
    
    // Set initial scroll position
    setScrolled(window.scrollY > 10);
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  
  const headerClass = hasMounted 
    ? scrolled ? "bg-white/80 shadow-md" : "bg-white/80"
    : "bg-white/80"; // Default for SSR

  return (
    <header className="mt-16">
      <motion.div
        className={`fixed top-0 z-50 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-background transition-all duration-300 ${headerClass}`}
        initial="hidden"
        animate="visible"
        variants={headerVariants}
        >
           <div 
          className="bg-gradient-to-r from-customTeal via-teal-600 to-teal-600 text-white text-center py-1.5 font-medium tracking-wide shadow-md"     
    >
      <div className="container flex justify-center items-center gap-x-8 text-xs">
        <div className="flex items-center gap-x-2">
          <CalendarDays className="h-4 w-4" />
          <span>MON – SUN</span>
        </div>
        <div className="flex items-center gap-x-2">
          <Clock className="h-4 w-4" />
          <span>8:00 AM – 8:00 PM</span>
        </div>
      </div>
    </div>
        <div className="max-w-6xl mx-auto flex h-16 lg:h-20 items-center">
          <div className="flex flex-1 items-center justify-between">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={logoVariants}
            >
              <Link href="/" className="flex items-center px-2">
                <LogoIcon />
              </Link>
            </motion.div>
            <MainNav />
            <div className="flex items-center gap-2 px-2 md:px-0">
              <div className="hidden md:flex gap-2">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 transition-all duration-300"
                  >
                    <Link href="/signin">
                      LOGIN
                    </Link>
                  </Button>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <Button
                    asChild
                    size="sm"
                    className="bg-customTeal hover:bg-teal-700 transition-all duration-300"
                  >
                    <Link href="/signup">
                      SIGN UP
                    </Link>
                  </Button>
                </motion.div>
              </div>

              <MobileNav />
            </div>
          </div>
        </div>
      </motion.div>
    </header>
  );
}
