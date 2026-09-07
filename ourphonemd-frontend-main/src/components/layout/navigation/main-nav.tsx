"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { navItemVariants } from "./animation-variants";

interface NavItem {
  href: string;
  label: string;
  isExternal?: boolean;
}

export function MainNav() {
  const navItems: NavItem[] = [
    { href: "/", label: "HOME" },
    { href: "/about", label: "ABOUT US" },
    { href: "/services", label: "OUR SERVICES" },
    { href: "/contact", label: "CONTACT US" },
    { href: "https://ourphonemd.com/ords/f?p=191:145", label: "PROVIDER LOGIN", isExternal: true }
  ];

  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList className="gap-1">
        {navItems.map((item, i) => (
          <NavigationMenuItem key={item.label}>
            <motion.div
              custom={i}
              initial="hidden"
              animate="visible"
              variants={navItemVariants}
            >
              <Link href={item.href} 
                    target={item.isExternal ? "_blank" : undefined}
                    className={navigationMenuTriggerStyle() + " text-sm font-medium bg-transparent hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-300"}>
                {item.label}
              </Link>
            </motion.div>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
} 