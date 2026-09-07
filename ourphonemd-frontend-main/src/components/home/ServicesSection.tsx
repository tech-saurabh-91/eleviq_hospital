'use client';

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { ServicesSectionContent } from "@/data/homeContent";

interface ServicesSectionProps {
  content: ServicesSectionContent;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3
    }
  }
};

const item = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  show: { 
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};


export function ServicesSection({ content }: ServicesSectionProps) {
  // Example services data if not all fields are in content
  const servicesData = [
    {
      title: content.services[0]?.title || "ADHD/Anxiety Care",
      description: content.services[0]?.description || "Expert consultation and personalized treatment plans for ADHD and anxiety management",
      image: "https://ext.same-assets.com/54593336/169712448.jpeg",
      link: "/book",
      highlight: "Most Popular",
      isOutline: false
    },
    {
      title: content.services[1]?.title || "Pediatric Care",
      description: content.services[1]?.description || "Comprehensive medical care for your child's health and wellbeing",
      image: "https://ext.same-assets.com/54593336/1876822310.jpeg",
      link: "/book", 
      highlight: "Quick Care",
      isOutline: false
    },
    {
      title: content.services[2]?.title || "Digital Forms",
      description: content.services[2]?.description || "Streamlined patient documentation and medical history forms",
      image: "https://ext.same-assets.com/54593336/1300160112.png",
      link: "/forms",
      highlight: "Easy Access",
      isOutline: true
    }
  ];

  return (
    <section className="py-32 relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-teal-50">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute top-0 -left-4 w-72 h-72 bg-teal-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
      <div className="absolute top-0 -right-4 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />

      <div className="max-w-[1220px] px-4 mx-auto relative z-10">
        <motion.div 
          className="text-center space-y-6 mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-teal-500/10 to-indigo-500/10 text-teal-700 font-medium"
            whileHover={{ scale: 1.05 }}
          >
            <Star className="w-4 h-4" />
            <span>Premium Healthcare</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
            {content.sectionTitle} <span className="bg-gradient-to-r from-teal-600 to-indigo-600 bg-clip-text text-transparent">{content.highlightedWord}</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            {content.description}
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {servicesData.map((service, index) => (
            <motion.div key={index} variants={item}>
              <Card className="group relative bg-white/70 backdrop-blur-sm border-0 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 h-full flex flex-col overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative h-[260px] overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-conatain transition-transform duration-700 group-hover:scale-105"
                    quality={90}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 rounded-full text-sm font-medium text-teal-600">
                      {service.highlight}
                    </span>
                  </div>
                </div>

                <CardHeader className="relative pt-3">
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-indigo-600 bg-clip-text text-transparent">
                    {service.title}
                  </CardTitle>
                  <CardDescription className="text-slate-600 mt-2 text-base">
                    {service.description}
                  </CardDescription>
                </CardHeader>

                <CardFooter className="mt-auto pb-4 px-6">
                  <Button 
                    asChild 
                    className={`w-full rounded-xl h-12 text-base font-medium transition-all duration-300 ${
                      service.isOutline 
                        ? 'bg-white text-teal-600 border-2 border-teal-200 hover:bg-teal-50 hover:border-teal-300' 
                        : 'bg-teal-600 hover:bg-teal-700 text-white'
                    }`}
                  >
                    <Link href={service.link} className="flex items-center justify-center gap-2">
                      {service.isOutline ? 'Access Forms' : 'Schedule Now'}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}