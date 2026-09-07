"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { motion } from "framer-motion";

export function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden border-emerald-200 hover:bg-emerald-50">
          <Menu className="h-5 w-5 text-emerald-700" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="border-l-emerald-200">
        <motion.div 
          className="flex flex-col gap-4 mt-8"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            href="/"
            className="text-lg font-medium transition-colors hover:text-emerald-600"
          >
            HOME
          </Link>
          <Link
            href="/about"
            className="text-lg font-medium transition-colors hover:text-emerald-600"
          >
            ABOUT US
          </Link>
          <Link
            href="/services"
            className="text-lg font-medium transition-colors hover:text-emerald-600"
          >
            OUR SERVICES
          </Link>
          <Link
            href="/contact"
            className="text-lg font-medium transition-colors hover:text-emerald-600"
          >
            CONTACT US
          </Link>
          <Link
            href="https://ourphonemd.com/ords/f?p=191:145"
            className="text-lg font-medium transition-colors hover:text-emerald-600"
            target="_blank"
          >
            PROVIDER LOGIN
          </Link>

          <div className="mt-6 space-y-2">
            <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700">
              <Link href="https://ourphonemd.com/ords/f?p=191:9999">
                LOGIN
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50">
              <Link href="https://ourphonemd.com/ords/f?p=191:214">
                SIGN UP
              </Link>
            </Button>
          </div>
        </motion.div>
      </SheetContent>
    </Sheet>
  );
} 