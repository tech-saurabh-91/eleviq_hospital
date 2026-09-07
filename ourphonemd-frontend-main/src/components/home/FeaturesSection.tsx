'use client';

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Video,
  FileText,
  CreditCard,
  HeartPulse,
  Clock,
  Shield,
  Pill,
  LucideIcon
} from "lucide-react";
import { FeaturesSectionContent } from "@/data/homeContent";

interface FeaturesSectionProps {
  content: FeaturesSectionContent;
}

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  video: Video,
  file: FileText,
  card: CreditCard,
  heart: HeartPulse,
  clock: Clock,
  shield: Shield,
  prescription: Pill
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

export function FeaturesSection({ content }: FeaturesSectionProps) {
  // Gradient and icon color mapping
  const gradients = [
    "from-blue-500 to-indigo-600",
    "from-purple-500 to-violet-600",
    "from-pink-500 to-rose-600",
    "from-emerald-500 to-teal-600"
  ];
  
  const iconColors = [
    "text-blue-300",
    "text-purple-300",
    "text-pink-300",
    "text-emerald-300"
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-[1220px] px-4 mx-auto space-y-16">
        <motion.div 
          className="text-center relative space-y-6 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute -top-10 right-10 w-32 h-32 bg-teal-600 rounded-full opacity-30 blur-3xl" />
          <div className="absolute bottom-10 left-10 w-28 h-28 bg-emerald-400 rounded-full opacity-30 blur-3xl" />

          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">
            {content.title} <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-600">{content.highlightedTitle}</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            {content.description}
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 md:px-6 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {content.features.map((feature, index) => {
            const IconComponent = iconMap[feature.icon.toLowerCase()] || Video;
            const gradient = gradients[index % gradients.length];
            const iconColor = iconColors[index % iconColors.length];
            
            return (
              <motion.div key={index} variants={item}>
                <Card className="border border-slate-200 bg-white h-full rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 group">
                  <div className={`h-2 w-full bg-gradient-to-r ${gradient}`}></div>
                  <CardHeader className="pb-4">
                    <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center mb-4 group-hover:bg-slate-200 transition-colors duration-300">
                      <IconComponent className={`h-7 w-7 ${iconColor}`} strokeWidth={1.5} />
                    </div>
                    <CardTitle className="text-xl font-semibold text-slate-800 group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-emerald-500 group-hover:to-teal-600 transition-all duration-300">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
} 