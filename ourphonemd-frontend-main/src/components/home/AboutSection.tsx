'use client';

import Image from "next/image";
import { motion } from "framer-motion";
import { CircleCheckBig } from "lucide-react";
import { AboutSectionContent } from "@/data/homeContent";

interface AboutSectionProps {
  content: AboutSectionContent;
}

export function AboutSection({ content }: AboutSectionProps) {
  return (
    <section className="py-24 overflow-hidden">
      <div className="max-w-[1220px] px-4 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 md:px-6 gap-12 lg:gap-16 items-center">
          <motion.div 
            className="space-y-6 relative"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute bottom-16 right-8 w-24 h-24 bg-teal-600 rounded-full opacity-70 blur-2xl" />
            <div className="inline-block px-4 py-1 rounded-full bg-teal-200 text-teal-700 font-medium text-sm lg:text-lg mb-2">
              {content.missionTitle}
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              {content.visionTitle} <span className="text-teal-600">{content.visionHighlight}</span>
            </h2>
            
            <div className="space-y-4 text-lg text-slate-600 leading-relaxed">
              {content.paragraphs.map((paragraph, index) => (
                <p key={index}>
                  {paragraph}
                </p>
              ))}
            </div>
            
            <ul className="space-y-4 mt-8">
              {content.benefits.map((benefit, index) => (
                <motion.li 
                  key={index} 
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="rounded-full bg-teal-50 p-1 mt-0.5 flex-shrink-0">
                    <CircleCheckBig className="h-5 w-5 text-yellow-400" />
                  </div>
                  <span className="text-slate-700 font-medium">{benefit}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          
          <motion.div
            className="relative lg:ml-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute top-4 -left-28 w-28 h-28 bg-teal-400 rounded-full opacity-70 blur-2xl" />
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-yellow-200 rounded-full opacity-70 blur-2xl" />
            
            <div className="mt-14 relative h-[550px] flex justify-center items-center w-full rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={content.imageUrl}
                alt={content.imageAlt}
                height={400}
                width={500}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
                priority
                quality={100}
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-teal-800 via-transparent to-transparent"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 