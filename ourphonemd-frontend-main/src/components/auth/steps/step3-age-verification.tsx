"use client";

import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { useId, useEffect } from "react";

export function Step3AgeVerification() {
  // Generate IDs first to avoid conditional hook calls
  const adultOptionId = useId();
  const minorOptionId = useId();
  
  // Try to get the form context, but handle the case when it's not available
  const formContext = useFormContext();
  const formState = formContext?.formState;
  const setValue = formContext?.setValue;
  const watch = formContext?.watch;
  const currentValue = watch ? watch("isAdult") : null;
  
  // Use hooks unconditionally
  useEffect(() => {
    if (setValue && currentValue === undefined) {
      setValue("isAdult", null);
    }
  }, [setValue, currentValue]);
  
  if (!formContext) {
    return (
      <div className="p-4 border rounded-md bg-red-50 border-red-200">
        <p className="text-center text-red-500">Form context not available. Please try again.</p>
      </div>
    );
  }
  
  const errors = formState?.errors;

  return (
    <div className="space-y-6">
      <Card className="border-customTeal/20 shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-customTeal to-customTeal/70 p-1" />
        <CardHeader className="pb-2">
          {/* <h2 className="text-xl font-semibold text-customTeal mb-1">Age Verification</h2> */}
          <p className="text-gray-500 text-sm">
            Please select the option that best describes your situation
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {errors?.isAdult && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <p className="text-sm">{errors.isAdult.message as string}</p>
            </div>
          )}
          
          <div className="space-y-3">
            {/* Adult option */}
            <label
              htmlFor={adultOptionId}
              className={`block relative border rounded-md p-4 cursor-pointer transition-colors ${
                currentValue === true ? "border-customTeal bg-teal-50" : "border-gray-200 hover:border-customTeal/50"
              }`}
            >
              <div className="flex items-start space-x-3 space-y-0">
                <input 
                  type="radio"
                  id={adultOptionId}
                  name="age-verification"
                  checked={currentValue === true}
                  onChange={() => setValue("isAdult", true, { shouldValidate: true })}
                  className="h-4 w-4 mt-1 text-customTeal border-gray-300 focus:ring-customTeal"
                  aria-label="I am 18 years or older"
                />
                <div>
                  <div className="font-medium text-gray-800">
                    I am 18 years or older
                  </div>
                  <p className="text-sm text-gray-500">
                    I am registering for myself and can provide identification
                  </p>
                </div>
              </div>
            </label>
            
            {/* Guardian option */}
            <label
              htmlFor={minorOptionId}
              className={`block relative border rounded-md p-4 cursor-pointer transition-colors ${
                currentValue === false ? "border-customTeal bg-teal-50" : "border-gray-200 hover:border-customTeal/50"
              }`}
            >
              <div className="flex items-start space-x-3 space-y-0">
                <input 
                  type="radio"
                  id={minorOptionId}
                  name="age-verification"
                  checked={currentValue === false}
                  onChange={() => setValue("isAdult", false, { shouldValidate: true })}
                  className="h-4 w-4 mt-1 text-customTeal border-gray-300 focus:ring-customTeal"
                  aria-label="I am a parent or legal guardian"
                />
                <div>
                  <div className="font-medium text-gray-800">
                    I am a parent or legal guardian
                  </div>
                  <p className="text-sm text-gray-500">
                    I am registering on behalf of someone under 18 years old
                  </p>
                </div>
              </div>
            </label>
          </div>
          
          <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-md text-sm">
            <p><strong>Important:</strong> Valid identification and/or legal guardianship documentation may be required during your first visit.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 