import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { AboutSection } from "@/components/home/AboutSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { BenefitsSection } from "@/components/home/BenefitsSection";
import { CTASection } from "@/components/home/CTASection";
import MainLayout from "@/components/layout/MainLayout";
import { homeContent, HomePageContent } from "@/data/homeContent";

// // This function could fetch data from an API or CMS
// async function getHomePageContent(): Promise<HomePageContent> {
//   try {
//     // Replace with your actual API endpoint
//     const response = await fetch('https://your-api.com/api/home-content', {
//       next: { revalidate: 3600 } // Revalidate every hour
//     });
    
//     if (!response.ok) {
//       throw new Error('Failed to fetch content');
//     }
    
//     return await response.json();
//   } catch (error) {
//     console.error('Error fetching home content:', error);
//     // Return default content if API fails
//     return homeContent;
//   }
// }

export default async function Home() {
  // Fetch content from the API
  const content = homeContent as HomePageContent;
  
  return (
    <MainLayout>
      <div className="flex flex-col min-h-screen">
        <HeroSection content={content.hero} />
        <FeaturesSection content={content.features} />
        <AboutSection content={content.about} />
        <ServicesSection content={content.services} />
        <BenefitsSection content={content.benefits} />
        <CTASection content={content.cta} />
      </div>
    </MainLayout>
  );
}
