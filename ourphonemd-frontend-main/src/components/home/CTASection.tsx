'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CTASectionContent } from "@/data/homeContent";

interface CTASectionProps {
  content: CTASectionContent;
}

export function CTASection({ content }: CTASectionProps) {
  return (
    <section className="py-14 relative overflow-hidden mb-10">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-customTeal via-customTeal/80 to-sky-500 text-white" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-400 rounded-full opacity-30 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-400 rounded-full opacity-30 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-yellow-300 rounded-full opacity-20 blur-3xl" />
      
      {/* Content overlay */}
      <div className="max-w-[1220px] relative z-10 px-4 mx-auto">
        <motion.div 
          className="max-w-3xl mx-auto space-y-8 text-center text-white"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-bold leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {content.title} <span className="text-yellow-300">{content.titleHighlight}</span>
          </motion.h2>
          
          <motion.p 
            className="text-xl text-white/90 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {content.description}
          </motion.p>
          
          <motion.div 
            className="pt-6 flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button 
              asChild 
              size="lg" 
              className="bg-white rounded-full text-customTeal hover:bg-customTeal/10 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Link href={content.buttonLink}>{content.buttonText}</Link>
            </Button>
            <Button 
              asChild 
              size="lg" 
              variant="outline" 
              className="border-2 px-8 rounded-full backdrop-blur-sm bg-white/10 hover:bg-white/20 border-white shadow-lg hover:shadow-xl transition-all"
            >
              <Link href="/signup">Create Account</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
} 