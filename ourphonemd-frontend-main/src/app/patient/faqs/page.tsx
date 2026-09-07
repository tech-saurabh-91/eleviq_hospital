"use client";

import React, { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function FaqPage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const faqs = [
    {
      question: "What is PhoneMD?",
      answer: "PhoneMD is a physician owned online health resource."
    },
    {
      question: "Why PhoneMD?",
      answer: "PhoneMD was created in response to patients' busy schedules, rising health insurance premiums, and ever higher deductibles. This service allows families to save time, money, and trips to the ER/urgent care.\n\nUnlike other online telemedicine services, PhoneMD was created for Kentuckians by Kentuckians. This allows us to provide more personal one on one care. However due to COVID-19, we will be taking calls from out of state for the time being. This service won't replace your regular doctor visits, but can be a great online resource when you need to quickly reach a physician."
    },
    {
      question: "What medical services do we offer?",
      answer: "We treat most of the non-emergent health conditions that can be easily diagnosed over the phone like common cold, flu, sinus infections, earpain, refills, rashes, vomiting, diarrhea, name a few. Soon we also offering lab orders and x-ray for injuries as well."
    },
    {
      question: "How do I pay for the consult?",
      answer: "Patients can pay via credit card or HSA card."
    },
    {
      question: "Can PhoneMD bill my health Insurance?",
      answer: "Yes, as long as the insurance information section is completed a few days prior to the appointment, so we can verify that they will cover telemedicine."
    },
    {
      question: "If you are billing my Insurance company, why do I have to pay?",
      answer: "Not all health plans pay for telemedicine visits so we charge you first until we get reimbursed by your insurance carrier."
    },
    {
      question: "Can I get a refund if my Insurance paid the bill?",
      answer: "Yes, we will refund your Credit card once we get the reimbursement from your Insurance company, which can take upto 30 days."
    },
    {
      question: "Does PhoneMD offer Psychiatric medical care?",
      answer: "Yes. At the current time, we are limiting this service to just the pediatric population (ages 4-17). We can also refill your child's ADHD/Anxiety/Depression medications if you are one of our regular patients."
    },
    {
      question: "Can I discuss my labs with the physician?",
      answer: "Yes. We can review the labs and make recommendations for next steps."
    },
    {
      question: "Can PhoneMD order labs/X-rays?",
      answer: "Yes we can. Please make sure you provide us with the nearest hospital/lab information (name/telephone and fax#). The cost for this service is slightly higher as we will be working with the hospital and following up on results."
    },
    {
      question: "Can we refer you to a specialist?",
      answer: "Yes if we think it's needed."
    },
    {
      question: "Can PhoneMD providers treat both adults/children?",
      answer: "Yes, we have unrestricted Kentucky medical licenses and can see all ages. We want to be your family health resource!"
    },
    {
      question: "Do I need a separate call for my spouse/children?",
      answer: "No, just let us know at the time of making the appointment that the call is for 2 or more family members."
    },
    {
      question: "Can I request a specific date and time for my appointment?",
      answer: "Absolutely appointments are available 7 days a week from 7am-7pm."
    },
    {
      question: "Can I attach an image or request a video consult?",
      answer: "Yes, video consults are always available, and attaching a photo is recommended for phone consults to help with diagnosis."
    },
    {
      question: "Can PhoneMD send my records to my regular physician?",
      answer: "Unfortunately at this time, we are unable to offer this service."
    },
    {
      question: "What if I am traveling and out of State?",
      answer: "Most non controlled prescriptions can be called in without any issue, as long as you provide the name and number of the pharmacy."
    },
    {
      question: "Can I get a prescription/antibiotic called in for my illness?",
      answer: "This will be decided on a case by case basis. Many illnesses are viral in nature, but if the provider thinks an antibiotic or other medication is needed we will call it in."
    },
    {
      question: "Are PhoneMD providers aware of my medical history?",
      answer: "Yes, as long as you fill out our forms accurately. You must fill in the allergy section as well as any relevant current and past medical history, then the provider will review your history prior to your appointment."
    },
    {
      question: "Can we refill your regular monthly medicines?",
      answer: "Yes, depending on the type of medication. We are always happy to do emergency refills of medicines from few days to few weeks until you can see you regular physician."
    },
    {
      question: "Can PhoneMD call in pain medicine?",
      answer: "No, we do not prescribe controlled medications, you would need to see your regular physician."
    },
    {
      question: "Do I get charged by the time?",
      answer: "No, appointments are a set cost, regardless of time."
    },
    {
      question: "Do I still have to pay if I did not get a prescription called in?",
      answer: "Yes, the assessment and recommendation of the provider is the primary service, medication will only be prescribed if the provider feels it is warranted."
    },
    {
      question: "Is my Information safe with PhoneMD?",
      answer: "Yes. We are fully compliant with the Health Information Privacy and Portability Act (HIPAA)."
    },
    {
      question: "Can I get a work excuse/school note?",
      answer: "Yes."
    },
    {
      question: "Would I talk to a physician or an NP?",
      answer: "The majority of calls will be answered by a physician. However, there will be times when calls may be answered by board-certified nurse practitioners. All of PhoneMD's providers (Physicians/APRNs) are actively practicing medicine and are well trained to take care of you and your family."
    }
  ];

  // Filter FAQs based on search query
  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full m-auto px-4 py-2">
      <div className="border-customTeal/10">
        <div className="pb-2">
          <h1 className="text-3xl font-bold text-customTeal">Frequently Asked Questions</h1>
          <p className="text-lg">
            Find answers to common questions about our telemedicine services
          </p>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              className="pl-10 border-customTeal/20 focus:border-customTeal"
              placeholder="Search for questions or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div>
          <div className="bg-white rounded-lg">
            {filteredFaqs.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {filteredFaqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-b border-customTeal/10">
                    <AccordionTrigger className="text-base sm:text-lg font-medium text-customTeal hover:text-customTeal/80 py-4">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700 leading-relaxed pb-4">
                      {faq.answer.split('\n\n').map((paragraph, idx) => (
                        <p key={idx} className={idx > 0 ? "mt-3" : ""}>
                          {paragraph}
                        </p>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="py-8 text-center">
                <p className="text-gray-500">No FAQs found matching your search query.</p>
                <p className="text-gray-500 mt-2">Try using different keywords or reset your search.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}