export interface HeroSectionContent {
  title: string;
  titleHighlight: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  imageUrl: string;
  imageAlt: string;
}

export interface AboutSectionContent {
  missionTitle: string;
  visionTitle: string;
  visionHighlight: string;
  paragraphs: string[];
  benefits: string[];
  imageUrl: string;
  imageAlt: string;
}

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

export interface FeaturesSectionContent {
  title: string;
  highlightedTitle: string;
  description: string;
  features: FeatureItem[];
}

export interface ServiceItem {
  title: string;
  description: string;
  icon: string;
  price?: string;
}

export interface ServicesSectionContent {
  sectionTitle: string;
  highlightedWord: string;
  description: string;
  services: ServiceItem[];
}

export interface BenefitItem {
  title: string;
  description: string;
  icon: string;
}

export interface BenefitsSectionContent {
  title: string;
  highlightedWord: string;
  description: string;
  benefits: BenefitItem[];
}

export interface CTASectionContent {
  title: string;
  titleHighlight: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

export interface HomePageContent {
  hero: HeroSectionContent;
  features: FeaturesSectionContent;
  about: AboutSectionContent;
  services: ServicesSectionContent;
  benefits: BenefitsSectionContent;
  cta: CTASectionContent;
}

// Default content that can be overridden
export const homeContent: HomePageContent = {
  hero: {
    title: "Welcome to OurPhone",
    titleHighlight: "MD",
    description: "Connect with board-certified healthcare providers from the comfort of your home. Make appointments in just one minute.",
    primaryButtonText: "Book Appointment",
    primaryButtonLink: "/book",
    secondaryButtonText: "Our Services",
    secondaryButtonLink: "/services",
    imageUrl: "/images/Medicalprescription.png",
    imageAlt: "Telemedicine consultation"
  },
  
  about: {
    missionTitle: "Our Mission",
    visionTitle: "Our",
    visionHighlight: "Vision",
    paragraphs: [
      "OurPhoneMD was created to provide more personal one-on-one care. Unlike other online telemedicine services, OurPhoneMD was created for Kentuckians.",
      "The OurPhoneMD experience is more similar to your traditional doctor's office. You will be able to follow up with the same provider, have multiple family members seen within the same appointment, and order further lab work or imaging.",
      "Our service won't replace your regular doctor visits but can be a great online resource when you need to quickly reach a physician at home or on the go."
    ],
    benefits: [
      "Board certified healthcare providers",
      "Save time, money, and trips to the ER",
      "See multiple family members in one appointment",
      "Personal one-on-one care with the same provider"
    ],
    imageUrl: "https://plus.unsplash.com/premium_photo-1674499074982-1e20253c5241?q=80&w=1396&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    imageAlt: "Our Vision"
  },
  
  features: {
    title: "Why Choose",
    highlightedTitle: "OurPhoneMD",
    description: "We offer convenient, high-quality telehealth services designed to meet your healthcare needs from anywhere.",
    features: [
      {
        icon: "video",
        title: "Video Consultations",
        description: "Connect face-to-face with our healthcare providers through secure video calls."
      },
      {
        icon: "clock",
        title: "24/7 Availability",
        description: "Access medical care whenever you need it, day or night."
      },
      {
        icon: "prescription",
        title: "Prescription Services",
        description: "Get prescriptions sent directly to your preferred pharmacy."
      },
      {
        icon: "shield",
        title: "Secure & Private",
        description: "Your health information is protected with advanced encryption."
      }
    ]
  },
  
  services: {
    sectionTitle: "Our Medical",
    highlightedWord: "Services",
    description: "We provide a comprehensive range of telehealth services to address your healthcare needs.",
    services: [
      {
        title: "Urgent Care",
        description: "Quick treatment for non-emergency conditions like colds, flu, allergies, and minor injuries.",
        icon: "stethoscope",
        price: "$59"
      },
      {
        title: "Primary Care",
        description: "Ongoing care for chronic conditions, preventive care, and health maintenance.",
        icon: "heart-pulse",
        price: "$79"
      },
      {
        title: "Mental Health",
        description: "Support for anxiety, depression, stress management, and other mental health concerns.",
        icon: "brain",
        price: "$89"
      },
      {
        title: "Pediatric Care",
        description: "Healthcare services for children and adolescents, including well-child visits and illness treatment.",
        icon: "baby",
        price: "$69"
      }
    ]
  },
  
  benefits: {
    title: "The",
    highlightedWord: "Benefits",
    description: "Discover why thousands of patients choose OurPhoneMD for their telehealth needs.",
    benefits: [
      {
        title: "Convenience",
        description: "Access healthcare from anywhere – no travel or waiting rooms required.",
        icon: "map-pin"
      },
      {
        title: "Cost-Effective",
        description: "Save money compared to in-person visits, with transparent pricing and no hidden fees.",
        icon: "dollar-sign"
      },
      {
        title: "Continuity of Care",
        description: "Build relationships with the same providers over time for better care.",
        icon: "users"
      },
      {
        title: "Fast Response",
        description: "Get medical attention quickly, often within minutes of requesting an appointment.",
        icon: "clock"
      }
    ]
  },
  
  cta: {
    title: "Ready to experience healthcare",
    titleHighlight: "reimagined?",
    description: "Book your first appointment today and see why our patients love OurPhoneMD.",
    buttonText: "Book Appointment Now",
    buttonLink: "/book"
  }
}; 