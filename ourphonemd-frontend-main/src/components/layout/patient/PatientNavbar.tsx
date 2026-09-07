"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { headerVariants } from "@/components/layout/navigation/animation-variants";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, ChevronDown, User2, Menu } from "lucide-react";
import { useUser } from "@/context/userContext";
import { LogoIcon } from "@/components/common/LogoIcon";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function PatientNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useUser();
  const router = useRouter();

  useEffect(() => {
    setScrolled(window.scrollY > 10);

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/signin");
  };

  return (
    <header className="w-full">
      <motion.div
        className={`fixed top-0 z-50 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-background transition-all duration-300 ${
          scrolled ? "bg-white/80 shadow-md" : "bg-white/80"
        }`}
        initial="hidden"
        animate="visible"
        variants={headerVariants}
      >
        <div className="w-full">
          <div className="max-w-7xl mx-auto flex h-16 items-center px-4">
            <div className="flex flex-1 items-center justify-between">
              <div className="md:hidden block ">
                <SidebarTrigger>
                  <Menu className="h-10 w-10 "/>
                </SidebarTrigger>
              </div>
              <div className="md:block hidden">
              <LogoIcon />
              </div>
              <div className="flex items-center gap-2">
                {user && (
                  <DropdownMenu>
                    <DropdownMenuTrigger className="outline-none">
                      <div className="flex items-center cursor-pointer rounded-md px-3 py-1.5 hover:bg-emerald-50 transition-colors">
                        <User className="w-5 h-5 text-emerald-600 mr-2" />
                        <span className="text-sm text-gray-800">
                          {user.email || ""}
                        </span>
                        <ChevronDown className="w-4 h-4 ml-2 text-gray-500" />
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-emerald-600" />
                        <span>Logout</span>
                      </DropdownMenuItem>
                      <Link href={"/patient/profile"}>
                        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                          <User2 className="w-4 h-4 text-emerald-600" />
                          <span>Profile</span>
                        </DropdownMenuItem>
                      </Link>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </header>
  );
}
