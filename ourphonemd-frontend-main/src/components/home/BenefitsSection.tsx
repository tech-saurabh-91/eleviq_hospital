'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Clock, Shield, MessageSquare, HeartPulse, MapPin, DollarSign, Users, LucideIcon } from "lucide-react";
import { BenefitsSectionContent } from "@/data/homeContent";

interface BenefitsSectionProps {
  content: BenefitsSectionContent;
}

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  'clock': Clock,
  'shield': Shield,
  'message-square': MessageSquare,
  'heart-pulse': HeartPulse,
  'map-pin': MapPin,
  'dollar-sign': DollarSign,
  'users': Users
};

export function BenefitsSection({ content }: BenefitsSectionProps) {
  // Fallback benefits if needed
  const benefitsData = [
    {
      icon: "clock",
      title: "Extended Hours",
      description: "MON-SUN 8:00AM-8:00PM"
    },
    {
      icon: "shield",
      title: "Secure Platform",
      description: "HIPAA compliant telemedicine"
    },
    {
      icon: "message-square",
      title: "Follow-ups",
      description: "Consistent care with your provider"
    },
    {
      icon: "heart-pulse",
      title: "Whole Family",
      description: "Care for everyone in one appointment"
    }
  ];

  // Use content benefits if available, otherwise use fallback
  const benefits = content.benefits.length > 0 
    ? content.benefits.map(benefit => ({
        icon: benefit.icon,
        title: benefit.title,
        description: benefit.description
      }))
    : benefitsData;

  return (
    <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-br from-white to-slate-50 overflow-hidden">
      <div className="max-w-[1220px] px-4 sm:px-6 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div 
            className="order-2 lg:order-1 relative rounded-3xl overflow-hidden w-full mx-auto max-w-xl lg:max-w-none"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-customTeal via-teal-500 to-teal-400 shadow-lg" />
            <div className="relative z-10 p-6 sm:p-8 md:p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {benefits.map((benefit, index) => {
                  const IconComponent = iconMap[benefit.icon.toLowerCase()] || Clock;
                  
                  return (
                    <motion.div 
                      key={index}
                      className="bg-white/95 backdrop-blur-sm p-4 sm:p-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center group"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }} 
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="p-3 rounded-full bg-teal-50 mb-3 group-hover:bg-teal-100 transition-colors duration-300">
                        <IconComponent className="h-6 w-6 sm:h-7 sm:w-7 text-teal-600" strokeWidth={1.5} />
                      </div>
                      <h3 className="font-semibold text-slate-800 text-base sm:text-lg">{benefit.title}</h3>
                      <p className="text-xs sm:text-sm text-slate-600 mt-2">{benefit.description}</p>
                    </motion.div>
                  );
                })}
              </div>
              
              {/* Decorative patterns */}
              <div className="absolute top-0 left-0 w-32 h-32 bg-yellow-300/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-teal-200/30 rounded-full blur-3xl" />
              <div className="absolute top-1/4 right-1/4 w-16 h-16 bg-emerald-300/30 rounded-full blur-2xl" />
            </div>
          </motion.div>
          
          <motion.div 
            className="order-1 lg:order-2 space-y-4 sm:space-y-6 max-w-xl mx-auto lg:max-w-none"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-block px-4 py-1 rounded-full bg-teal-100 text-teal-700 font-medium text-xs sm:text-sm mb-2">
              Why Choose Us
            </div>
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              {content.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-500">{content.highlightedWord}</span>
            </h2>
            
            <div className="space-y-3 sm:space-y-4 text-base sm:text-lg text-slate-600 leading-relaxed">
              <p>{content.description}</p>
            </div>
            
            <div className="pt-4 sm:pt-6">
              <Button 
                asChild 
                size="lg" 
                className="bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-700 hover:scale-105 hover:to-emerald-600 rounded-full px-5 sm:px-8 py-2.5 text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link href="/about">Learn More About Us</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 