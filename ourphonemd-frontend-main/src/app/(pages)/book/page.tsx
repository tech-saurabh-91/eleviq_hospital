import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Book Appointment | OurPhoneMD - Modern Telemedicine Solutions",
  description: "Schedule your telemedicine appointment with OurPhoneMD's board-certified healthcare providers.",
};

export default function BookPage() {
  return (
    <div className="flex flex-col">
      <section className="bg-blue-50 py-16 md:py-24">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Book an Appointment
            </h1>
            <p className="text-xl text-slate-600">
              This page is currently under construction. For now, please use our existing booking system.
            </p>
            <div className="mt-8">
              <Button asChild size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black">
                <Link href="#" target="_blank">
                  Go to Current Booking System
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
