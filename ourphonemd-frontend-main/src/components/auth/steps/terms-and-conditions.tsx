"use client";
import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useId } from "react";

export function TermsAndConditions() {
  // Try to get the form context, but handle the case when it's not available
  const formContext = useFormContext();
  const control = formContext?.control;
  const termsCheckboxId = useId();

  if (!control) {
    return (
      <div className="p-4 border rounded-md bg-red-50 border-red-200">
        <p className="text-center text-red-500">Form context not available. Please try again.</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-y-auto space-y-4">
        <div className="text-center space-y-1">
          <h3 className="font-semibold text-lg">OurPhoneMD Terms of Service</h3>
          <p className="text-gray-500">Please review our terms and conditions below</p>
        </div>
       
        <p>Welcome to OurPhoneMD. By accessing our services, you agree to be bound by these Terms and Conditions.</p>
       
        <h4 className="font-medium text-base mt-2">1. Medical Services</h4>
        <p>OurPhoneMD provides telemedicine consultations and related healthcare services. We do not replace your primary care physician and recommend regular in-person check-ups.</p>
       
        <h4 className="font-medium text-base mt-2">2. Privacy Policy</h4>
        <p>We are committed to protecting your privacy. All personal and medical information is handled in accordance with HIPAA regulations and our Privacy Policy.</p>
       
        <h4 className="font-medium text-base mt-2">3. User Responsibilities</h4>
        <p>You agree to provide accurate, complete, and updated information about yourself. You are responsible for maintaining the confidentiality of your account credentials.</p>
       
        <h4 className="font-medium text-base mt-2">4. Medical Emergencies</h4>
        <p>OurPhoneMD is not designed for emergency situations. If you are experiencing a medical emergency, please dial 911 or go to your nearest emergency room immediately.</p>
       
        <h4 className="font-medium text-base mt-2">5. Limitation of Liability</h4>
        <p>OurPhoneMD and its healthcare providers are not liable for any advice, diagnosis, or treatment provided through our platform, except as required by applicable law.</p>
      </div>
      <div className="pt-4 pl-4 pb-1">
      <FormField
        control={control}
        name="termsAccepted"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center mx-auto text-center space-x-2 space-y-0">
            <FormControl>
              <Checkbox
                className="w-5 h-5"
                checked={field.value}
                onCheckedChange={field.onChange}
                id={termsCheckboxId}
              />
            </FormControl>
            <div className="leading-none">
              <label
                htmlFor={termsCheckboxId}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I have read and accept the terms and conditions
              </label>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />
      </div>
    </>
  );
}
