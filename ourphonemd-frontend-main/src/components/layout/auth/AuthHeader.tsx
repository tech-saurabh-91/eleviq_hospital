"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { headerVariants, logoVariants } from "@/components/layout/navigation/animation-variants";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { LogoIcon } from "@/components/common/LogoIcon";
export default function AuthHeader() {
  const [scrolled, setScrolled] = useState(false);
 const pathname = usePathname();
  useEffect(() => {
    // Initialize state on mount
    setScrolled(window.scrollY > 10);
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header>
      <motion.div
        className={`fixed top-0 z-50 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-background transition-all duration-300 ${
          scrolled ? "bg-white/80 shadow-md" : "bg-white/80"
        }`}
        initial="hidden"
        animate="visible"
        variants={headerVariants}
      >
        <div className="max-w-6xl mx-auto flex h-16 items-center">
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
          
          {pathname && !pathname.includes("patient") && (
            <div className="flex items-center gap-2 px-2 md:px-0">
              <div className="hidden md:flex gap-2">
                {pathname === "/signin" ? (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
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
                ) : pathname === "/signup" ? (
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
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </div>
          )}


          </div>
        </div>
      </motion.div>
    </header>
  );
}
