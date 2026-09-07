'use client';

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { HeroSectionContent } from "@/data/homeContent";

interface HeroSectionProps {
  content: HeroSectionContent;
}

export function HeroSection({ content }: HeroSectionProps) {
  return (
    <section className="relative bg-gradient-to-br from-teal-600 via-customTeal to-teal-600 text-white overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 animate-pulse" />
    
      {/* Decorative circles */}
      <div className="absolute top-20 left-10 w-24 h-24 bg-customTeal/30 rounded-full blur-3xl opacity-20" />
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-sky-400 rounded-full blur-3xl opacity-20" />
    
      <div className="max-w-[1220px] relative z-10 py-20 md:py-28 mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center md:pl-4 gap-12">
          <motion.div 
            className="flex-1 space-y-6"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-poppins leading-tight">
              {content.title}<span className="text-amber-300">{content.titleHighlight}</span> Portal
            </h1>
            <p className="text-xl md:text-2xl max-w-2xl opacity-90 leading-relaxed">
              {content.description}
            </p>
            <div className="flex flex-wrap gap-4 pt-6">
              <Button asChild size="lg" className="bg-amber-400 hover:bg-amber-500 text-black font-medium px-8 rounded-full shadow-lg hover:shadow-xl transition-all">
                <Link href={content.primaryButtonLink}>{content.primaryButtonText}</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 border-white rounded-full backdrop-blur-sm">
                <Link href={content.secondaryButtonLink}>{content.secondaryButtonText}</Link>
              </Button>
            </div>
          </motion.div>
    
          <motion.div 
            className="flex-1 flex justify-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="relative w-full max-w-md h-[400px] rounded-3xl">
              <Image
                src={content.imageUrl}
                alt={content.imageAlt}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 