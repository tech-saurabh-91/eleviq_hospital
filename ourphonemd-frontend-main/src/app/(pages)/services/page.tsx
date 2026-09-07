/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  BrainCog,
  Calendar,
  FileText,
  HeartPulse,
  MessageSquare,
  Pill,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Thermometer,
  Users
} from "lucide-react";

// export const metadata = {
//   title: "Our Services | OurPhoneMD - Modern Telemedicine Solutions",
//   description: "Explore the range of telemedicine services offered by OurPhoneMD, including ADHD/anxiety appointments, sick child care, and more.",
// };

type ServiceCardProps = {
  icon: any;
  title: string;
  description: string;
};

// Add service data by category
const generalServices: ServiceCardProps[] = [
  {
    icon: HeartPulse,
    title: "Urgent Care Consultations",
    description: "Quick access to medical advice for non-emergency situations, helping you avoid unnecessary ER visits and urgent care facility wait times."
  },
  {
    icon: Pill,
    title: "Prescription Management",
    description: "Medication refills and management for established patients, ensuring you never run out of your important medications."
  },
  {
    icon: Stethoscope,
    title: "Follow-up Appointments",
    description: "Convenient follow-up consultations to monitor your progress and adjust treatment plans as needed, all from the comfort of your home."
  }
];

const pediatricServices: ServiceCardProps[] = [
  {
    icon: Thermometer,
    title: "Common Childhood Illnesses",
    description: "Diagnosis and treatment recommendations for common conditions like fever, cough, cold, ear infections, and minor injuries."
  },
  {
    icon: BrainCog,
    title: "Pediatric ADHD Management",
    description: "Specialized care for children with ADHD, including diagnosis, treatment planning, and ongoing medication management."
  },
  {
    icon: Users,
    title: "Family-Centered Care",
    description: "Multiple children can be seen during the same appointment, making healthcare more convenient for busy parents."
  }
];

const mentalHealthServices: ServiceCardProps[] = [
  {
    icon: MessageSquare,
    title: "Anxiety Management",
    description: "Professional support and treatment for anxiety disorders in children and adults, with customized care plans."
  },
  {
    icon: BrainCog,
    title: "ADHD Consultations",
    description: "Comprehensive ADHD evaluations, diagnosis, and ongoing treatment for both children and adults."
  },
  {
    icon: Pill,
    title: "Medication Management",
    description: "Ongoing care and medication adjustments for various mental health conditions, with regular follow-ups."
  }
];

const specializedServices: ServiceCardProps[] = [
  {
    icon: FileText,
    title: "Medical Documentation",
    description: "Obtain necessary medical documentation, doctor&apos;s notes, and forms for school, work, or other purposes."
  },
  {
    icon: ShieldCheck,
    title: "Lab Result Reviews",
    description: "Professional review and explanation of lab test results, with recommendations for any necessary follow-up care."
  },
  {
    icon: Calendar,
    title: "Commercial Appointments",
    description: "Special services for businesses and organizations, including employee health consultations and group appointments."
  }
];

export default function ServicesPage() {
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

  const ServiceCard = ({ icon: Icon, title, description }: ServiceCardProps) => (
    <motion.div 
      variants={itemFade}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Card className="border-none shadow-lg group-hover:shadow-xl transition-all duration-300 bg-white overflow-hidden h-full">
        <div className="h-1.5 w-full bg-customTeal"></div>
        <CardHeader>
          <div className="h-14 w-14 rounded-2xl bg-customTeal/10 flex items-center justify-center mb-5">
            <Icon className="h-7 w-7 text-customTeal" />
          </div>
          <CardTitle className="text-xl text-slate-900">{title}</CardTitle>
        </CardHeader>
        <CardContent className="text-slate-600">
          <p>{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );

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
          <div className="grid grid-cols-1 md:px-4 lg:grid-cols-2 gap-12 items-center">
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
                Healthcare Solutions
              </motion.span>
              <motion.h1 
                className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                Our <span className="text-emerald-600">Services</span>
              </motion.h1>
              <motion.p 
                className="text-xl text-slate-600 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                OurPhoneMD provides comprehensive telemedicine services for the entire family, offering convenient healthcare solutions from the comfort of your home.
              </motion.p>
              <motion.p 
                className="text-xl text-slate-600 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                Connect with our board-certified providers for a wide range of healthcare needs, from routine consultations to specialized care.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-emerald-600 hover:bg-emerald-700 shadow-md"
                >
                  <Link href="/book">Book Appointment</Link>
                </Button>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="relative h-full w-full m-auto md:h-[400px] md:w-[400px] md:mr-auto md:ml-16 rounded-2xl overflow-hidden shadow-2xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="text-center absolute inset-0 -z-10 bg-emerald-500/10 backdrop-blur-sm rounded-2xl"></div>
              <Image
                src={"https://img.freepik.com/free-photo/unrecognizable-doctor-extending-digital-tab-anonymous-patient-fill-questionnaire_1098-19318.jpg?t=st=1746106728~exp=1746110328~hmac=e7b612c72e4c3ff2d7ca3bbe7e4c15ce47d4e80d8ea2497655dc5c2bb0329a87&w=1060"}
                alt="Telemedicine Services"
                width={500}
                height={500}
                className="object-cover w-full h-full m-auto md:mr-auto rounded-2xl"
              />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Featured Services Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute top-40 left-0 w-72 h-72 bg-emerald-100 rounded-full opacity-30 blur-3xl -translate-x-1/2"></div>
        
        <div className="container max-w-7xl mx-auto space-y-16 px-4">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="inline-flex items-center justify-center h-10 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full mb-5 font-medium"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Featured Services
            </motion.div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Our Featured <span className="text-emerald-600">Services</span>
            </h2>
            <p className="text-xl text-slate-600">
              Connect with our board-certified providers for a wide range of healthcare needs
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
              <Card className="overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all h-full">
                <div className="h-1.5 w-full bg-emerald-500"></div>
                <div className="relative h-[240px]">
                  <Image
                    src="https://ext.same-assets.com/54593336/169712448.jpeg"
                    alt="ADHD/Anxiety Appointment"
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle>ADHD/Anxiety Appointment</CardTitle>
                  <CardDescription className="text-emerald-600 font-medium">
                    Expert consultation for ADHD and anxiety conditions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">
                    Our specialized providers offer consultations and ongoing care for ADHD and anxiety conditions for both children and adults. Get professional guidance, treatment options, and medication management from the convenience of your home.
                  </p>
                  <div className="mt-6 space-y-2">
                    <div className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <BrainCog className="h-3 w-3 text-emerald-600" />
                      </div>
                      <span className="text-slate-700">ADHD evaluation and management</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <MessageSquare className="h-3 w-3 text-emerald-600" />
                      </div>
                      <span className="text-slate-700">Anxiety consultation and treatment</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Pill className="h-3 w-3 text-emerald-600" />
                      </div>
                      <span className="text-slate-700">Medication management</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700">
                    <Link href="/book">Book Now</Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>

            <motion.div 
              variants={itemFade}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
            >
              <Card className="overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all h-full">
                <div className="h-1.5 w-full bg-emerald-500"></div>
                <div className="relative h-[240px]">
                  <Image
                    src="https://img.freepik.com/free-photo/ill-girl-blowing-her-nose_23-2148172221.jpg?t=st=1746106884~exp=1746110484~hmac=e0cf7824cb9dc48f2e1b47067023e4d7e592a74614b412c6191a61771cf82685&w=1060"
                    alt="Sick Child Appointment"
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle>Sick Child Appointment</CardTitle>
                  <CardDescription className="text-emerald-600 font-medium">
                    Quick and professional care for your child&apos;s illnesses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">
                    When your child is feeling under the weather, our pediatric specialists can provide prompt evaluation and treatment recommendations through our secure telemedicine platform. Save time and avoid unnecessary exposure to other illnesses in waiting rooms.
                  </p>
                  <div className="mt-6 space-y-2">
                    <div className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Thermometer className="h-3 w-3 text-emerald-600" />
                      </div>
                      <span className="text-slate-700">Fever and common illness treatment</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Stethoscope className="h-3 w-3 text-emerald-600" />
                      </div>
                      <span className="text-slate-700">Respiratory symptoms assessment</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Calendar className="h-3 w-3 text-emerald-600" />
                      </div>
                      <span className="text-slate-700">Quick appointment scheduling</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700">
                    <Link href="/book">Book Now</Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>

            <motion.div 
              variants={itemFade}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
            >
              <Card className="overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all h-full">
                <div className="h-1.5 w-full bg-emerald-500"></div>
                <div className="relative h-[240px]">
                  <Image
                    src="https://ext.same-assets.com/54593336/1300160112.png"
                    alt="Patient Forms"
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle>Patient Forms</CardTitle>
                  <CardDescription className="text-emerald-600 font-medium">
                    Access and submit all necessary forms online
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">
                    Streamline your healthcare experience with our digital forms. Complete and submit all necessary patient information securely online before your appointment, saving time and ensuring your provider has all the information they need.
                  </p>
                  <div className="mt-6 space-y-2">
                    <div className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <FileText className="h-3 w-3 text-emerald-600" />
                      </div>
                      <span className="text-slate-700">Patient registration forms</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <ShieldCheck className="h-3 w-3 text-emerald-600" />
                      </div>
                      <span className="text-slate-700">Secure and HIPAA compliant</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Users className="h-3 w-3 text-emerald-600" />
                      </div>
                      <span className="text-slate-700">Family member management</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                    <Link href="/forms">Access Forms</Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Additional Services Section */}
      <section className="py-16 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-customTeal/20 rounded-full opacity-20 blur-3xl translate-x-1/3 translate-y-1/3"></div>
        
        <div className="container max-w-7xl mx-auto px-4 md:px-6 ">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-2 ring-5"
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
              Healthcare Solutions
            </motion.div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Additional <span className="text-customTeal">Healthcare Services</span>
            </h2>
            <p className="text-xl text-slate-600">
              OurPhoneMD offers a comprehensive range of telemedicine services
            </p>
          </motion.div>

          <Tabs defaultValue="general" className="w-full py-4">
            <TabsList className="grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-4 w-full h-24 bg-teal-100/5 p-1 overflow-hidden">

              <TabsTrigger value="general" className="border data-[state=active]:bg-customTeal data-[state=active]:text-white text-xs sm:text-sm md:text-base whitespace-normal h-auto py-2">General Healthcare</TabsTrigger>
              <TabsTrigger value="pediatric" className="border data-[state=active]:bg-customTeal data-[state=active]:text-white text-xs sm:text-sm md:text-base whitespace-normal h-auto py-2">Pediatric Care</TabsTrigger>
              <TabsTrigger value="mental" className="border data-[state=active]:bg-customTeal data-[state=active]:text-white text-xs sm:text-sm md:text-base whitespace-normal h-auto py-2">Mental Health</TabsTrigger>
              <TabsTrigger value="specialized" className="border data-[state=active]:bg-customTeal data-[state=active]:text-white text-xs sm:text-sm md:text-base whitespace-normal h-auto py-2">Specialized Services</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="mt-8">
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={staggerChildren}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {generalServices.map((service, index) => (
                  <ServiceCard key={index} {...service} />
                ))}
              </motion.div>
            </TabsContent>

            <TabsContent value="pediatric" className="mt-8">
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={staggerChildren}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {pediatricServices.map((service, index) => (
                  <ServiceCard key={index} {...service} />
                ))}
              </motion.div>
            </TabsContent>

            <TabsContent value="mental" className="mt-8">
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={staggerChildren}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {mentalHealthServices.map((service, index) => (
                  <ServiceCard key={index} {...service} />
                ))}
              </motion.div>
            </TabsContent>

            <TabsContent value="specialized" className="mt-8">
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={staggerChildren}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {specializedServices.map((service, index) => (
                  <ServiceCard key={index} {...service} />
                ))}
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              How Our Services Work
            </h2>
            <p className="text-xl text-slate-600">
              Get the care you need in just a few simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-teal-100 flex items-center justify-center mb-6 relative">
                <span className="text-2xl font-bold text-teal-600">1</span>
                <div className="absolute h-[3px] bg-teal-100 w-full right-0 top-1/2 -translate-y-1/2 -z-10 md:w-[calc(100%+3rem)] md:right-0" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">
                Create an Account
              </h3>
              <p className="text-slate-600">
                Sign up for an OurPhoneMD account, complete your profile, and add family members if needed. Our registration process is quick and secure.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-teal-100 flex items-center justify-center mb-6 relative">
                <span className="text-2xl font-bold text-teal-600">2</span>
                <div className="absolute h-[3px] bg-teal-100 w-full right-0 top-1/2 -translate-y-1/2 -z-10 md:w-[calc(200%+6rem)] md:right-1/2" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">
                Schedule an Appointment
              </h3>
              <p className="text-slate-600">
                Choose the type of appointment you need and select a convenient time. Our system will match you with an appropriate healthcare provider.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-teal-100 flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-teal-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">
                Connect for Your Visit
              </h3>
              <p className="text-slate-600">
                Join your secure video consultation at the scheduled time. Discuss your concerns, receive diagnosis, treatment recommendations, and prescriptions if necessary.
              </p>
            </div>
          </div>

          <div className="text-center mt-16">
            <Button className="bg-teal-700 hover:bg-teal-800 shadow-lg "  asChild size="lg">
              <Link href="/book">Book Your Appointment Now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Insurance & Payment Section */}
      <section className="py-20 bg-teal-50">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Insurance & Payment Options
              </h2>
              <p className="text-lg text-slate-600">
                OurPhoneMD offers multiple payment options to make healthcare affordable and accessible. We work with various insurance providers and also offer competitive self-pay rates.
              </p>

              <div className="space-y-4 mt-8">
                <h3 className="text-xl font-semibold text-slate-900">We Accept</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm font-medium text-teal-600">✓</span>
                    </div>
                    <span className="text-slate-700">Most major insurance plans</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm font-medium text-teal-600">✓</span>
                    </div>
                    <span className="text-slate-700">Credit and debit cards</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm font-medium text-teal-600">✓</span>
                    </div>
                    <span className="text-slate-700">Health Savings Accounts (HSA)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm font-medium text-teal-600">✓</span>
                    </div>
                    <span className="text-slate-700">Flexible Spending Accounts (FSA)</span>
                  </li>
                </ul>
              </div>

              <p className="text-slate-600 mt-6">
                For specific information about covered services and co-pays, please check with your insurance provider. Our team is also available to help you understand your coverage.
              </p>

              <Button asChild variant="outline" className="mt-6 p-2 bg-teal-700 hover:bg-teal-800 px-4 text-white">
                <Link href="/fees">View Fee Schedule</Link>
              </Button>
            </div>

            <div className="relative">
              <div className=" py-8 rounded-xl bg-gradient-to-br from-teal-100 to-teal-50 px-2 flex items-center justify-center">
                <div className="relative w-full max-w-md aspect-square">
                  <Image
                    src="https://img.freepik.com/free-photo/doctor-performing-routine-medical-checkup_23-2149281048.jpg?t=st=1746095015~exp=1746098615~hmac=ec2dd14245da02159108d7274bb53d2c150a1d321afd15d4775ed20cdf968eff&w=1060"
                    alt="Insurance and payment"
                    fill
                    className="object-cover rounded-lg shadow-lg"
                  />
                </div>
              </div>
            </div>
          </div>
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
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-400 rounded-full opacity-20 blur-3xl"></div>
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
