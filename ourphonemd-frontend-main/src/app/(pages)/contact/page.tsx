"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Clock,
  Facebook,
  Mail,
  MapPin,
  Phone,
  Youtube,
  Sparkles
} from "lucide-react";
import ContactForm from "@/components/contact-form";
import Image from "next/image";



export default function ContactPage() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemFade = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const contactMethods = [
    {
      icon: Phone,
      title: "Phone",
      description: "Talk to our support team",
      content: "(270) 769-0110",
      href: "tel:(270)769-0110",
      detail: "Available Mon-Sun, 8:00 AM - 8:00 PM"
    },
    {
      icon: Mail,
      title: "Email",
      description: "Send us a message",
      content: "Inquiry.OPMD@yahoo.com",
      href: "mailto:Inquiry.OPMD@yahoo.com",
      detail: "We'll respond as quickly as possible"
    },
    {
      icon: MapPin,
      title: "Office Location",
      description: "Visit our office",
      content: "103 Financial Dr, Elizabethtown, KY 42701",
      href: "https://goo.gl/maps/7xFgQL3H6NQoBFdJ9",
      detail: "United States"
    }
  ];

  const faqs = [
    {
      question: "How quickly will I receive a response?",
      answer: "We aim to respond to all inquiries within 24 hours during business days. For urgent matters, please call us directly at (270) 769-0110."
    },
    {
      question: "Can I book an appointment through the contact form?",
      answer: "While you can inquire about appointments through the contact form, we recommend using our dedicated appointment booking system for faster scheduling. You can also call us directly to schedule."
    },
    {
      question: "How do I get technical support for the telemedicine platform?",
      answer: "For technical support, please call our support line at (270) 769-0110 or email us with \"Technical Support\" in the subject line. Our team is available during regular business hours to assist you."
    },
    {
      question: "Do you offer in-person consultations?",
      answer: "While we specialize in telemedicine, Dr. Saifullah does maintain physical practices in Elizabethtown and Bardstown. Please contact us for more information about in-person appointments at these locations."
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-16 md:py-20 overflow-hidden bg-gradient-to-b from-customTeal/10 to-white">
        {/* Decorative elements */}
        <div className="absolute -top-10 right-10 w-64 h-64 bg-customTeal rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-blue-400 rounded-full opacity-10 blur-3xl"></div>

        <motion.div 
          className="container max-w-7xl mx-auto px-4"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <div className="grid grid-cols-1 md:px-4 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              className="space-y-6"
              variants={fadeIn}
            >
              <motion.span 
                className="inline-block px-4 py-1.5 bg-customTeal/10 text-customTeal rounded-full text-sm font-medium"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Get In Touch
              </motion.span>
              <motion.h1 
                className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                Contact <span className="text-customTeal">Us</span>
              </motion.h1>
              <motion.p 
                className="text-xl text-slate-600 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                Have questions about our telemedicine services? Our team is here to help. Reach out to us through any of the channels below.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="flex gap-4 pt-4"
              >
                <Button 
                  asChild 
                  className="bg-customTeal hover:bg-customTeal/90 transition-all duration-300"
                >
                  <a href="tel:(270)769-0110">Call Us Now</a>
                </Button>
                <Button 
                  asChild 
                  variant="outline" 
                  className="border-customTeal text-customTeal hover:bg-customTeal/5"
                >
                  <Link href="#contact-form">Send Message</Link>
                </Button>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="relative h-full w-full m-auto md:h-[400px] md:w-[400px] md:mr-auto md:ml-16 rounded-2xl overflow-hidden shadow-2xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="text-center absolute inset-0 -z-10 bg-customTeal/10 backdrop-blur-sm rounded-2xl"></div>
              <Image
                src="https://img.freepik.com/free-photo/businessman-checking-his-phone-office_23-2148377701.jpg?t=st=1746109517~exp=1746113117~hmac=2b0e31ccb94a3ebdf953c93cfd370d5b635b18660015304a1402af372e4dff20&w=1060"
                alt="Contact Us"
                width={500}
                height={500}
                className="object-cover w-full h-full m-auto md:mr-auto rounded-2xl"
              />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Contact Info Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute top-40 left-0 w-72 h-72 bg-customTeal/10 rounded-full opacity-30 blur-3xl -translate-x-1/2"></div>
        
        <div className="container max-w-7xl mx-auto px-4">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {contactMethods.map((method, index) => (
              <motion.div key={index} variants={itemFade}>
                <Card className="border-none shadow-xl hover:shadow-2xl transition-all h-full overflow-hidden group">
                  <div className="h-1.5 w-full bg-customTeal"></div>
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto h-14 w-14 rounded-2xl bg-customTeal/10 flex items-center justify-center mb-5 group-hover:bg-customTeal/20 transition-colors duration-300">
                      <method.icon className="h-7 w-7 text-customTeal" />
                    </div>
                    <CardTitle>{method.title}</CardTitle>
                    <CardDescription>{method.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <a
                      href={method.href}
                      target={method.title === "Office Location" ? "_blank" : undefined}
                      rel={method.title === "Office Location" ? "noreferrer" : undefined}
                      className="text-xl font-medium text-customTeal hover:text-customTeal/80 transition-colors"
                    >
                      {method.content}
                    </a>
                    <p className="mt-2 text-sm text-slate-600">
                      {method.detail}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Map Section */}
      <section id="contact-form" className="py-20 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-customTeal/20 rounded-full opacity-20 blur-3xl translate-x-1/3 translate-y-1/3"></div>
        
        <div className="container max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-customTeal/10 text-customTeal font-medium mb-6">
                <Mail className="w-4 h-4" />
                <span>Write to Us</span>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Send Us a <span className="text-customTeal">Message</span>
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                Fill out the form below and we&apos;ll get back to you as soon as possible. For urgent matters, please call us directly.
              </p>

              <div className="bg-teal-50/5 p-8 rounded-2xl shadow-xl">
                <ContactForm />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-customTeal/10 text-customTeal font-medium mb-6">
                <MapPin className="w-4 h-4" />
                <span>Find Us</span>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Our <span className="text-customTeal">Location</span>
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                While our telemedicine services are available online, you can also visit our physical office in Elizabethtown, Kentucky.
              </p>

              <div className="rounded-2xl overflow-hidden shadow-xl">
                <iframe
                  title="OurPhoneMD Office Location Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3160.5535614185383!2d-85.85909382397788!3d37.6973044155785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88680d954c3a1921%3A0xed6a2cda88c1f22!2s103%20Financial%20Dr%2C%20Elizabethtown%2C%20KY%2042701%2C%20USA!5e0!3m2!1sen!2sin!4v1714569847801!5m2!1sen!2sin"
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-customTeal/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-customTeal" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900">Business Hours</h3>
                    <p className="text-slate-600">Monday - Sunday: 8:00 AM - 8:00 PM</p>
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <a
                    href="https://www.youtube.com/@adminourphonemd6366"
                    target="_blank"
                    className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-customTeal/10 hover:text-customTeal transition-colors" 
                    rel="noreferrer"
                  >
                    <Youtube className="h-5 w-5" />
                    <span className="sr-only">YouTube</span>
                  </a>
                  <a
                    href="https://www.facebook.com/p/Ourphonemdcom-100064240503186/"
                    target="_blank"
                    className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-customTeal/10 hover:text-customTeal transition-colors" 
                    rel="noreferrer"
                  >
                    <Facebook className="h-5 w-5" />
                    <span className="sr-only">Facebook</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute top-40 right-0 w-72 h-72 bg-customTeal/10 rounded-full opacity-30 blur-3xl translate-x-1/2"></div>
        
        <div className="container max-w-7xl mx-auto px-4">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="inline-flex items-center justify-center h-10 px-4 py-2 bg-customTeal/10 text-customTeal rounded-full mb-5 font-medium"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Common Questions
            </motion.div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Frequently Asked <span className="text-customTeal">Questions</span>
            </h2>
            <p className="text-xl text-slate-600">
              Find answers to common questions about contacting us and our services
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 px-4 gap-8"
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {faqs.map((faq, index) => (
              <motion.div key={index} variants={itemFade}>
                <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 h-full overflow-hidden">
                  <div className="h-1.5 w-full bg-customTeal"></div>
                  <CardHeader className="-my-2">
                    <CardTitle className="text-xl text-slate-900">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600">
                      {faq.answer}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section 
        className="py-12 md:py-16 bg-gradient-to-br from-customTeal to-teal-800 text-white relative overflow-hidden mb-10 -mt-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid-pattern.png')] opacity-10"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400 rounded-full opacity-20 blur-3xl"></div>
        
        <div className="container max-w-5xl mx-auto px-4 relative z-10">
          <motion.div 
            className="text-center max-w-3xl mx-auto space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.h2 
              className="text-3xl md:text-4xl lg:text-5xl font-bold"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Ready to experience our care?
            </motion.h2>
            <motion.p 
              className="text-xl opacity-90"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Connect with our board-certified providers from the comfort of your home.
            </motion.p>
            <motion.div 
              className="pt-6 flex flex-wrap justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <Button 
                asChild 
                size="lg" 
                className="bg-white text-customTeal hover:bg-slate-50 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Link href="/book">Book Appointment</Link>
              </Button>
              <Button 
                asChild 
                size="lg" 
                variant="outline" 
                className="bg-customTeal/20 hover:bg-customTeal/30 transition-all duration-300 border-white/70 hover:border-white text-white shadow-lg hover:shadow-xl"
              >
                <Link href="/signup">Create Account</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
