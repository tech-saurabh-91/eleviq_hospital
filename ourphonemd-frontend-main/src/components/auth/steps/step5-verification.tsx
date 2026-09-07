/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Mail,
  Phone,
  KeyRound,
  Check,
} from "lucide-react";
import { useState, useId } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";


enum VerificationMethod {
  EMAIL = "email",
  PHONE = "phone",
  NONE = "none",
}

export function Step5Verification() {
  // Try to get the form context, but handle the case when it's not available
  const formContext = useFormContext();
  if (!formContext) {
    return (
      <Card className="border-customTeal/20 shadow-md overflow-hidden max-w-lg mx-auto mt-8">
        <div className="bg-gradient-to-r from-customTeal to-customTeal/70 h-2 w-full" />
        <div className="p-6">
          <p className="text-center text-red-500">Form context not available. Please try again.</p>
        </div>
      </Card>
    );
  }
  
  const { control, watch, setValue } = formContext;
  const [verificationMethod, setVerificationMethod] = useState<VerificationMethod | null>(null);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const email = watch("email");
  const phone = watch("primaryPhone");
  const codeInputId = useId();

  // Handle method selection and auto-send code
  function handleSelectMethod(method: VerificationMethod) {
    setVerificationMethod(method);
    setIsCodeSent(false);
    setTimeout(() => setIsCodeSent(true), 1000); // Simulate auto-send
  }

  function getMaskedContactInfo(): string {
    if (verificationMethod === VerificationMethod.EMAIL && email) {
      const [user, domain] = email.split("@");
      return `${user.charAt(0)}***${user.slice(-1)}@${domain}`;
    }
    if (verificationMethod === VerificationMethod.PHONE && phone) {
      return `***-***-${phone.slice(-4)}`;
    }
    return "";
  }

  // If no method selected, show method selection UI
  if (!verificationMethod) {
    return (
      <Card className="border-customTeal/20 shadow-md overflow-hidden max-w-lg mx-auto mt-8">
        <div className="bg-gradient-to-r from-customTeal to-customTeal/70 h-2 w-full" />
        <div className="p-6 space-y-6">
          <h2 className="text-xl font-semibold text-customTeal mb-2">Choose Verification Method</h2>
          <p className="text-gray-500 text-sm mb-4">Select how &apos;d like to verify your account</p>
          <div className="space-y-3">
            <RadioGroup
              defaultValue={undefined}
              onValueChange={val => handleSelectMethod(val as VerificationMethod)}
              className="space-y-2"
            >
              {[VerificationMethod.EMAIL, VerificationMethod.PHONE].map(method => (
                <label
                  key={method}
                  htmlFor={`${method}-method`}
                  className="flex items-center gap-3 border rounded-md p-4 cursor-pointer transition-colors border-gray-200 hover:border-customTeal/50"
                >
                  <RadioGroupItem value={method} id={`${method}-method`} />
                  <div>
                    <div className="font-medium text-gray-800">
                      {method === "email" ? "Email Verification" : "Phone Verification"}
                    </div>
                    <p className="text-xs text-gray-500">
                      Receive a code at {method === "email" ? email : phone}
                    </p>
                  </div>
                </label>
              ))}
            </RadioGroup>
          </div>
        </div>
      </Card>
    );
  }

  // After method selection, show code input UI
  const fieldName =
    verificationMethod === VerificationMethod.EMAIL
      ? "emailVerificationCode"
      : "phoneVerificationCode";
  const icon =
    verificationMethod === VerificationMethod.EMAIL ? (
      <Mail className="h-6 w-6 text-customTeal" />
    ) : (
      <Phone className="h-6 w-6 text-customTeal" />
    );
  const title =
    verificationMethod === VerificationMethod.EMAIL
      ? "Email Verification"
      : "Phone Verification";

  return (
    <Card className="border-customTeal/20 shadow-md overflow-hidden max-w-lg mx-auto mt-8">
      <div className="bg-gradient-to-r from-customTeal to-customTeal/70 h-2 w-full" />
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-2 mb-2">
          {icon}
          <h2 className="text-lg font-semibold text-customTeal">{title}</h2>
        </div>
        <p className="text-gray-600 text-sm mb-2 text-center">
          A code has been sent to <span className="font-medium text-gray-800">{getMaskedContactInfo()}</span>
        </p>
        <FormField
          control={control}
          name={fieldName}
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={codeInputId} className="sr-only">Code</FormLabel>
              <FormControl>
                <Input
                  id={codeInputId}
                  placeholder="Enter code"
                  {...field}
                  disabled={!isCodeSent}
                  className="text-base h-10 border-customTeal/30 border"
                  onChange={e => {
                    field.onChange(e);
                    setValue("emailVerificationCode", e.target.value);
                    setValue("phoneVerificationCode", e.target.value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {isCodeSent && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-md text-sm">
            <Check className="h-4 w-4" />
            <span>Code Sent Successfully</span>
          </div>
        )}
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-md text-sm flex items-start gap-2 mt-4">
          <KeyRound className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>
            Verification ensures your identity and keeps your data safe. We handle your info securely.
          </span>
        </div>
        <Button
          type="submit"
          className="w-full mt-4 bg-customTeal hover:bg-customTeal/90 text-white"
          disabled={!isCodeSent}
        >
          Continue
        </Button>
      </div>
    </Card>
  );
}
