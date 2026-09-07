"use client";
import Image from "next/image";
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
  CheckCircle2,
  HeartPulse,
  Stethoscope,
  Users,
  Goal,
  Sparkles
} from "lucide-react";


const features = [
  {
    title: "Personal One-on-One Care",
    description: "You will be able to follow up with the same provider each time, ensuring continuity of care and a relationship built on trust."
  },
  {
    title: "Family-Focused Appointments",
    description: "Have multiple family members seen within the same appointment, making healthcare more convenient for busy families."
  },
  {
    title: "Comprehensive Services",
    description: "Order further lab work or imaging as needed, ensuring you receive complete care even through telemedicine."
  },
  {
    title: "Locally Focused",
    description: "Created specifically for Kentuckians, our service understands local healthcare needs and resources."
  },
  {
    title: "Board Certified Providers",
    description: "All our healthcare providers are board certified and passionate about providing quality, efficient care."
  },
  {
    title: "Convenient Hours",
    description: "With service available from 8:00 AM to 8:00 PM seven days a week, we're here when you need us."
  }
]

export default function AboutPage() {
  
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

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-b from-emerald-50 to-white">
        {/* Decorative elements */}
        <div className="absolute -top-10 right-10 w-64 h-64 bg-emerald-400 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-teal-400 rounded-full opacity-10 blur-3xl"></div>

        <motion.div 
          className="container max-w-7xl mx-auto px-4"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <div className="grid grid-cols-1 md:px-4 lg:grid-cols-2 gap-12 items-center  ">
            <motion.div 
              className="space-y-6"
              variants={fadeIn}
            >
              <motion.span 
                className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Our Story
              </motion.span>
              <motion.h1 
                className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                About <span className="text-customTeal">OurPhoneMD</span>
              </motion.h1>
              <motion.p 
                className="text-xl text-slate-600 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                OurPhoneMD was created by Dr. Saifullah from Elizabethtown Kentucky, where he actively practices pediatric medicine at his Elizabethtown and Bardstown offices.
              </motion.p>
              <motion.p 
                className="text-xl text-slate-600 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                When Dr. Saifullah came to Kentucky, he spent his first five years working in a family clinic, and then later narrowed his focus to pediatrics. For the last 25 years, Dr. Saifullah has always emphasized treating the whole family, parents as well as pediatric patients.
              </motion.p>
            </motion.div>
            
            <motion.div 
              className="relative h-full w-full m-auto md:h-[400px] md:w-[400px] md:mr-auto  md:ml-16  rounded-2xl overflow-hidden shadow-2xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className=" text-center absolute inset-0 -z-10 bg-emerald-500/10 backdrop-blur-sm  rounded-2xl"></div>
              <Image
                src="https://ext.same-assets.com/54593336/3227853396.bin"
                alt="Dr. Saifullah"
                width={500}
                height={500}
                className="object-contain w-full h-ful  m-auto md:mr-auto md:w-[450px]  rounded-2xl"
              />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute top-40 left-0 w-72 h-72 bg-emerald-100 rounded-full opacity-30 blur-3xl -translate-x-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Our Mission & Vision
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              We&apos;re committed to making healthcare accessible, affordable, and convenient while maintaining quality and personalization
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <motion.div 
              className="relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card className="h-full bg-gradient-to-br from-emerald-50 to-white border-none shadow-xl">
                <CardHeader className="pb-4">
                  <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-5">
                    <HeartPulse className="h-7 w-7 text-emerald-600" />
                  </div>
                  <CardTitle className="text-2xl text-slate-900">Our Mission</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-slate-600">
                  <p>
                    OurPhoneMD came from the passion of being a resource for the entire family. Dr. Saifullah and his staff of providers are all board certified and passionate about providing quality efficient care for your family.
                  </p>
                  <p>
                    We believe in making healthcare accessible, affordable, and convenient for all Kentuckians, while maintaining the personal touch of traditional healthcare.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div 
              className="relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="h-full bg-gradient-to-br from-teal-50 to-white border-none shadow-xl">
                <CardHeader className="pb-4">
                  <div className="h-14 w-14 rounded-2xl bg-teal-500/10 flex items-center justify-center mb-5">
                    <Goal className="h-7 w-7 text-teal-600" />
                  </div>
                  <CardTitle className="text-2xl text-slate-900">Our Vision</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-slate-600">
                  <p>
                    OurPhoneMD was created in response to patients&apos; busy schedules, insurance premiums, and ever higher deductibles. This service allows families to save time, money, and trips to the ER and urgent care facilities.
                  </p>
                  <p>
                    Unlike other online telemedicine services, OurPhoneMD was created for Kentuckians. This allows us to provide more personal one-on-one care. The OurPhoneMD experience is more similar to your traditional doctor&apos;s office.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What Makes Us Different Section */}
      <section className="py-14 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-200 rounded-full opacity-20 blur-3xl translate-x-1/3 translate-y-1/3"></div>
        
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          <motion.div 
            className="text-center mb-12 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="inline-flex items-center -mt-2 justify-center h-10 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full mb-5 font-medium"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Our Unique Approach
            </motion.div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              What Makes Us <span className="text-customTeal">Different</span>
            </h2>
            <p className="text-xl text-slate-600">
              At OurPhoneMD, we focus on providing personalized care that meets the unique needs of each patient and family
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features?.map((feature, index) => (
              <motion.div 
                key={index}
                variants={itemFade}
                className="group"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Card className="h-full border border-slate-200/70 shadow-lg group-hover:shadow-xl transition-all duration-300 bg-white overflow-hidden">
                  <div className="h-1.5 w-full bg-customTeal"></div>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-lg md:text-xl">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                      <span>{feature.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-slate-600">
                    <p>
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Our Founder Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute top-1/3 left-1/3 w-40 h-40 bg-emerald-300 rounded-full opacity-20 blur-3xl"></div>
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div>
                <motion.div 
                  className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  Leadership
                </motion.div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                  About Our <span className="text-customTeal">Founder</span>
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Dr. Saifullah has over 25 years of experience in healthcare, with a focus on pediatric medicine. He practices at his clinics in Elizabethtown and Bardstown, Kentucky.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-slate-900">Education & Credentials</h3>
                <ul className="space-y-3">
                  {["Board Certified Physician", "Specialized in Pediatric Medicine", "25+ Years of Medical Experience"].map((item, index) => (
                    <motion.li 
                      key={index} 
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                    >
                      <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle2 className="h-4 w-4 text-customTeal" />
                      </div>
                      <span className="text-slate-600">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-slate-900">Philosophy</h3>
                <p className="text-slate-600">
                  Dr. Saifullah believes in treating the whole family and has always emphasized a patient-centered approach to healthcare. He founded OurPhoneMD to make quality healthcare more accessible to Kentucky families.
                </p>
              </div>
            </motion.div>

            <motion.div 
              className="grid grid-cols-4 grid-rows-2 gap-4"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.div 
                className="col-span-2 row-span-2 rounded-2xl overflow-hidden shadow-lg"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src="https://img.freepik.com/free-photo/medical-banner-with-doctor-working-laptop_23-2149611211.jpg?t=st=1746052431~exp=1746056031~hmac=be97d7e4230c33e27b0043c50fcd92af01c4625f5b0455c99118b80e071c2939&w=1060"
                  alt="Medical consultation"
                  width={400}
                  height={400}
                  className="object-cover w-full h-full"
                />
              </motion.div>
              <motion.div 
                className="col-span-2 rounded-2xl overflow-hidden shadow-lg"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src="https://img.freepik.com/free-vector/dna-sequence-hand-wireframe-dna-code-molecules-structure-mesh_127544-902.jpg?t=st=1746052832~exp=1746056432~hmac=dacd44de2d6ad01eaa56eb7498f8ca067b861c6aae824d998ffa3faa086c83dd&w=996"
                  alt="Telemedicine service"
                  width={400}
                  height={200}
                  className="object-cover w-full h-full"
                />
              </motion.div>
              <motion.div 
                className="col-span-2 rounded-2xl overflow-hidden shadow-lg"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src="https://img.freepik.com/free-photo/medical-banner-with-doctor-wearing-equipment_23-2149611201.jpg?t=st=1746052710~exp=1746056310~hmac=a183460f4fac46c9ae78699f1ed59dc9ad13458273f59254c72b6887ab990671&w=1060"
                  alt="Healthcare for everyone"
                  width={400}
                  height={200}
                  className="object-cover w-full h-full"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="py-12 bg-gradient-to-b from-emerald-50 to-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-200 rounded-full opacity-20 blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="container max-w-7xl mx-auto px-4 relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Users className="h-8 w-8 text-customTeal" />
            </motion.div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 -mt-2">
              Our <span className="text-customTeal">Team</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our staff of providers are all board certified and passionate about providing quality efficient care for your family
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div 
              variants={itemFade}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
            >
              <Card className="border-none shadow-xl overflow-hidden h-full">
                <div className="h-72 relative">
                  <Image
                    src="https://ext.same-assets.com/54593336/3227853396.bin"
                    alt="Dr. Saifullah"
                    fill
                    className="object-cover object-top"
                  />
                </div>
                <CardHeader className="bg-white">
                  <CardTitle className="text-xl text-slate-900">Dr. Saifullah</CardTitle>
                  <CardDescription className="text-emerald-600 font-medium">Founder & Pediatrician</CardDescription>
                </CardHeader>
                <CardContent className="bg-white">
                  <p className="text-slate-600">
                    With over 25 years of experience in pediatric medicine, Dr. Saifullah leads our team with a passion for family-centered care.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              variants={itemFade}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
            >
              <Card className="border-none shadow-xl overflow-hidden h-full">
                <div className="h-72 bg-gradient-to-br from-emerald-400/20 to-emerald-50 relative flex items-center justify-center">
                  <div className="h-24 w-24 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow-md">
                    <Stethoscope className="h-12 w-12 text-customTeal" />
                  </div>
                </div>
                <CardHeader className="bg-white">
                  <CardTitle className="text-xl text-slate-900">Board Certified Providers</CardTitle>
                  <CardDescription className="text-emerald-600 font-medium">Healthcare Professionals</CardDescription>
                </CardHeader>
                <CardContent className="bg-white">
                  <p className="text-slate-600">
                    Our team consists of board-certified medical professionals committed to providing the highest quality of care through telemedicine.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              variants={itemFade}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
            >
              <Card className="border-none shadow-xl overflow-hidden h-full">
                <div className="h-72 bg-gradient-to-br from-customTeal/60 to-teal-50 relative flex items-center justify-center">
                  <div className="h-24 w-24 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow-md">
                    <HeartPulse className="h-12 w-12 text-teal-600" />
                  </div>
                </div>
                <CardHeader className="bg-white">
                  <CardTitle className="text-xl text-slate-900">Support Staff</CardTitle>
                  <CardDescription className="text-teal-600 font-medium">Patient Care Specialists</CardDescription>
                </CardHeader>
                <CardContent className="bg-white">
                  <p className="text-slate-600">
                    Our dedicated support team ensures a smooth experience from appointment scheduling to follow-up care.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section 
        className="py-16 md:py-20 bg-gradient-to-br from-customTeal to-teal-800 text-white relative overflow-hidden mb-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid-pattern.png')] opacity-10"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-customTeal rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-400 rounded-full opacity-20 blur-3xl"></div>
        
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
              Join thousands of Kentucky families who trust OurPhoneMD for their healthcare needs.
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
                className="bg-white text-emerald-700 hover:bg-emerald-50 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Link href="/book">Book Appointment</Link>
              </Button>
              <Button 
                asChild 
                size="lg" 
                variant="outline" 
                className="bg-emerald-700/20 hover:bg-emerald-700/30 transition-all duration-300 border-white/70 hover:border-white text-white shadow-lg hover:shadow-xl"
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
