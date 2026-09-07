"use client";

import { motion } from "framer-motion";
import { Clock, CalendarDays } from "lucide-react";
import { infoBarVariants } from "./animation-variants";

export function InfoBar() {
  return (
    <motion.div 
      className="fixed top-0 lg:top-[70px] left-0 right-0 z-50 bg-gradient-to-r from-emerald-600 via-teal-600 to-teal-700 text-white text-center py-1.5 font-medium tracking-wide shadow-md"
      initial="hidden"
      animate="visible"
      variants={infoBarVariants}
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
    </motion.div>
  );
} 