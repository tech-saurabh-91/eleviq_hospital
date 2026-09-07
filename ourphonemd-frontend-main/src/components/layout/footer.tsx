"use client";

import Link from "next/link";
import { Facebook, Mail, MapPin, Phone, Twitter, Youtube, Instagram, ArrowRight, ExternalLink } from "lucide-react";

const quickLinks = [
  { href: "/about", label: "About" },
  { href: "/providers", label: "Our Providers" },
  { href: "/careers", label: "Join Our Team" },
  { href: "/faq", label: "FAQs" },
  { href: "/fees", label: "Fee Schedule" },
  { href: "/business", label: "Business Brokers" }
];

const guideVideos = [
  { href: "https://www.youtube.com/watch?v=okCi1SeHrxA", label: "First Time Registration" },
  { href: "https://www.youtube.com/watch?v=nnLAozaBmQE", label: "Make a Simple Appointment" },
  { href: "https://www.youtube.com/watch?v=SkqIMQYUFV0", label: "Adding Family Members" },
  { href: "https://www.youtube.com/watch?v=WaWw_9XClfo", label: "Commercial Appointment" }
];

const contactInfo = [
  { 
    icon: MapPin, 
    content: "103 Financial Dr, Elizabethtown, KY 42701, United States",
    href: "https://maps.google.com/?q=103+Financial+Dr,+Elizabethtown,+KY+42701"
  },
  { 
    icon: Phone, 
    content: "(270) 769-0110",
    href: "tel:(270)769-0110"
  },
  { 
    icon: Mail, 
    content: "Inquiry.OPMD@yahoo.com",
    href: "mailto:Inquiry.OPMD@yahoo.com"
  }
];

const socialLinks = [
  { 
    icon: Youtube, 
    href: "https://www.youtube.com/@adminourphonemd6366", 
    label: "YouTube",
    bgColor: "bg-red-500 hover:bg-red-600"
  },
  { 
    icon: Facebook, 
    href: "https://www.facebook.com/p/Ourphonemdcom-100064240503186/", 
    label: "Facebook",
    bgColor: "bg-blue-600 hover:bg-blue-700"
  },
  { 
    icon: Twitter, 
    href: "https://www.twitter.com/p/Ourphonemdcom-100064240503186/", 
    label: "Twitter",
    bgColor: "bg-sky-500 hover:bg-sky-600"
  },
  { 
    icon: Instagram, 
    href: "https://www.instagram.com/", 
    label: "Instagram",
    bgColor: "bg-pink-600 hover:bg-pink-700"
  }
];

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="relative overflow-hidden">
      {/* Top accent bar */}
      <div className="h-1.5 bg-gradient-to-r from-teal-400 via-emerald-500 to-teal-600 shadow-sm"></div>
      
      {/* Main footer */}
      <div className="bg-gradient-to-br from-teal-950 via-teal-950 to-teal-950">
        {/* Decorative elements */}
        <div className="absolute top-20 right-[5%] w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-[5%] w-64 h-64 bg-teal-500/5 rounded-full blur-3xl"></div>
        
        <div className="relative container max-w-7xl mx-auto pt-12  pb-4 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Company Info */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4">OurPhoneMD</h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Providing accessible and affordable healthcare solutions through telemedicine, ensuring quality care for you and your family.
              </p>
              <div className="flex space-x-2 mt-7">
                {socialLinks.map((social, index) => (
                  <Link
                    key={index}
                    href={social.href}
                    target="_blank"
                    className={`${social.bgColor} p-2 rounded-full mx-1 text-white transition-all duration-200 hover:scale-110`}
                    aria-label={social.label}
                  >
                    <social.icon className="h-4 w-4" />
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6 text-white">Quick Links</h3>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-slate-400 hover:text-emerald-400 transition-colors duration-200 flex items-center text-sm group"
                    >
                      <ArrowRight className="h-3.5 w-0 opacity-0 mr-0 text-emerald-400 group-hover:w-3.5 group-hover:mr-2 group-hover:opacity-100 transition-all duration-300" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Guide Videos */}
            <div>
              <h3 className="text-lg font-semibold mb-6 text-white">Guide Videos</h3>
              <ul className="space-y-3">
                {guideVideos.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      target="_blank"
                      className="text-slate-400 hover:text-emerald-400 transition-colors duration-200 flex items-center text-sm group"
                    >
                      <ArrowRight className="h-3.5 w-0 opacity-0 mr-0 text-emerald-400 group-hover:w-3.5 group-hover:mr-2 group-hover:opacity-100 transition-all duration-300" />
                      {link.label}
                      <ExternalLink className="h-3 w-3 ml-1.5 text-slate-500" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-6 text-white">Contact Us</h3>
              <ul className="space-y-4">
                {contactInfo.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="bg-slate-800/80 p-2 rounded-full mt-0.5">
                      <item.icon className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                    </div>
                    <div>
                      {item.href ? (
                        <a
                          href={item.href}
                          target={item.href.startsWith('https') ? "_blank" : undefined}
                          className="text-slate-400 hover:text-emerald-400 transition-colors duration-200 text-sm"
                        >
                          {item.content}
                        </a>
                      ) : (
                        <span className="text-slate-400 text-sm">{item.content}</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Newsletter subscription - optional */}
          <div className="mt-4 pb-4  border-t border-slate-800/60">
            <div className=" flex flex-col sm:flex-row justify-between items-center">
              <p className="text-sm text-slate-500">
                © {currentYear} OurPhoneMD. All rights reserved.
              </p>
              
              <div className="mt-4 sm:mt-0 flex items-center space-x-6">
                <Link href="/privacy" className="text-sm text-slate-500 hover:text-emerald-400 transition-colors">
                  Privacy
                </Link>
                <Link href="/terms" className="text-sm text-slate-500 hover:text-emerald-400 transition-colors">
                  Terms
                </Link>
                <Link href="/contact" className="text-sm text-slate-500 hover:text-emerald-400 transition-colors">
                  Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
