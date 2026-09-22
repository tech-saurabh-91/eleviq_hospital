/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
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

import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";

enum VerificationMethod {
  EMAIL = "email",
  PHONE = "phone",
}

interface Step5VerificationProps {
  onSendVerificationCode: (
    registrationId: string,
    method: "email" | "phone"
  ) => Promise<void>;

  onResendVerificationCode: (
    registrationId: string
  ) => Promise<void>;

  registrationId: string | null;
}

export function Step5Verification({
  onSendVerificationCode,
  onResendVerificationCode,
  registrationId,
}: Step5VerificationProps) {
  const formContext = useFormContext();

  const {
    control,
    watch,
    setValue,
  } = formContext;

  const verificationMethod = watch("verificationMethod");

  const email = watch("email");
  const phone = watch("primaryPhone");
  const previousEmailRef = useRef(email);
  const previousPhoneRef = useRef(phone);

  useEffect(() => {
    const emailChanged =
      previousEmailRef.current !== email;

    const phoneChanged =
      previousPhoneRef.current !== phone;

    if (emailChanged || phoneChanged) {
      setValue("verificationMethod", null, {
        shouldValidate: true,
        shouldDirty: true,
      });

      setValue("emailVerificationCode", "");

      setValue("phoneVerificationCode", "");

      setIsCodeSent(false);
      setSendError("");
      setResendCooldown(0);
    }

    previousEmailRef.current = email;
    previousPhoneRef.current = phone;
  }, [
    email,
    phone,
    setValue,
  ]);


  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isResendingCode, setIsResendingCode] =
    useState(false);
  const [resendCooldown, setResendCooldown] =
    useState(0);
  const [sendError, setSendError] = useState("");

  useEffect(() => {
    if (resendCooldown <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setResendCooldown((previous) =>
        previous - 1
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

  const codeInputId = useId();

  /*
   * Send verification code when the user selects
   * Email or Phone.
   */
  const handleSelectMethod = async (
    method: VerificationMethod
  ) => {
    if (!registrationId) {
      setSendError(
        "Registration session not found. Please go back and try again."
      );
      return;
    }

    try {
      setIsSendingCode(true);
      setIsCodeSent(false);
      setSendError("");

      setValue("emailVerificationCode", "");
      setValue("phoneVerificationCode", "");

      // Store selected method in React Hook Form
      setValue("verificationMethod", method, {
        shouldValidate: true,
        shouldDirty: true,
      });

      // Call the actual backend API
      await onSendVerificationCode(
        registrationId,
        method
      );

      setIsCodeSent(true);
      setResendCooldown(60);
    } catch (error) {
      console.error(
        "Failed to send verification code:",
        error
      );

      setIsCodeSent(false);

      setSendError(
        "Failed to send verification code. Please try again."
      );
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleResendCode = async () => {
    if (!registrationId) {
      setSendError(
        "Registration session not found. Please go back and try again."
      );
      return;
    }

    if (!verificationMethod) {
      return;
    }

    if (resendCooldown > 0) {
      return;
    }

    try {
      setIsResendingCode(true);
      setSendError("");

      await onResendVerificationCode(
        registrationId
      );

      setValue("emailVerificationCode", "");
      setValue("phoneVerificationCode", "");

      setIsCodeSent(true);
      setResendCooldown(60);
    } catch (error) {
      console.error(
        "Failed to resend verification code:",
        error
      );

      setSendError(
        "Failed to resend verification code. Please try again."
      );
    } finally {
      setIsResendingCode(false);
    }
  };

  /*
   * Mask email / phone before displaying it.
   */
  function getMaskedContactInfo(): string {
    if (
      verificationMethod === VerificationMethod.EMAIL &&
      email
    ) {
      const [user, domain] = email.split("@");

      if (!domain) {
        return email;
      }

      if (user.length <= 2) {
        return `${user.charAt(0)}***@${domain}`;
      }

      return `${user.charAt(0)}***${user.slice(
        -1
      )}@${domain}`;
    }

    if (
      verificationMethod === VerificationMethod.PHONE &&
      phone
    ) {
      return `***-***-${phone.slice(-4)}`;
    }

    return "";
  }

  /*
   * No verification method selected yet.
   */
  if (!verificationMethod) {
    return (
      <Card className="border-customTeal/20 shadow-md overflow-hidden max-w-lg mx-auto mt-8">
        <div className="bg-gradient-to-r from-customTeal to-customTeal/70 h-2 w-full" />

        <div className="p-6 space-y-6">
          <h2 className="text-xl font-semibold text-customTeal mb-2">
            Choose Verification Method
          </h2>

          <p className="text-gray-500 text-sm mb-4">
            Select how &apos;d like to verify your account
          </p>

          <RadioGroup
            value={verificationMethod || ""}
            onValueChange={(value) =>
              handleSelectMethod(
                value as VerificationMethod
              )
            }
            className="space-y-2"
            disabled={isSendingCode}
          >
            {/* Email Verification */}
            <label
              htmlFor="email-method"
              className="flex items-center gap-3 border rounded-md p-4 cursor-pointer transition-colors border-gray-200 hover:border-customTeal/50"
            >
              <RadioGroupItem
                value={VerificationMethod.EMAIL}
                id="email-method"
              />

              <div>
                <div className="font-medium text-gray-800">
                  Email Verification
                </div>

                <p className="text-xs text-gray-500">
                  Receive a code at {email}
                </p>
              </div>
            </label>

            {/* Phone Verification */}
            <label
              htmlFor="phone-method"
              className="flex items-center gap-3 border rounded-md p-4 cursor-pointer transition-colors border-gray-200 hover:border-customTeal/50"
            >
              <RadioGroupItem
                value={VerificationMethod.PHONE}
                id="phone-method"
              />

              <div>
                <div className="font-medium text-gray-800">
                  Phone Verification
                </div>

                <p className="text-xs text-gray-500">
                  Receive a code at {phone}
                </p>
              </div>
            </label>
          </RadioGroup>

          {isSendingCode && (
            <p className="text-sm text-customTeal">
              Sending verification code...
            </p>
          )}

          {sendError && (
            <p className="text-sm text-red-600">
              {sendError}
            </p>
          )}
        </div>
      </Card>
    );
  }

  /*
   * Determine which verification code field
   * should be used.
   */
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

          <h2 className="text-lg font-semibold text-customTeal">
            {title}
          </h2>
        </div>

        <p className="text-gray-600 text-sm mb-2 text-center">
          A code has been sent to{" "}
          <span className="font-medium text-gray-800">
            {getMaskedContactInfo()}
          </span>
        </p>

        <FormField
          control={control}
          name={fieldName}
          render={({ field }) => (
            <FormItem>
              <FormLabel
                htmlFor={codeInputId}
                className="sr-only"
              >
                Code
              </FormLabel>

              <FormControl>
                <Input
                  id={codeInputId}
                  placeholder="Enter code"
                  {...field}
                  disabled={!isCodeSent}
                  className="text-base h-10 border-customTeal/30 border"
                  onChange={(event) => {
                    field.onChange(event);
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

            <span>
              Code Sent Successfully
            </span>
          </div>
        )}

        {isCodeSent && (
          <div className="text-center text-sm">
            {resendCooldown > 0 ? (
              <p className="text-gray-500">
                You can resend the code in{" "}
                <span className="font-medium">
                  {resendCooldown}s
                </span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResendCode}
                disabled={isResendingCode}
                className="text-customTeal font-medium hover:underline disabled:opacity-50"
              >
                {isResendingCode
                  ? "Resending..."
                  : "Didn't receive the code? Resend Code"}
              </button>
            )}
          </div>
        )}

        {sendError && (
          <div className="text-sm text-red-600">
            {sendError}
          </div>
        )}

        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-md text-sm flex items-start gap-2 mt-4">
          <KeyRound className="h-4 w-4 mt-0.5 flex-shrink-0" />

          <span>
            Verification ensures your identity and keeps
            your data safe. We handle your info securely.
          </span>
        </div>

        <Button
          type="submit"
          className="w-full mt-4 bg-customTeal hover:bg-customTeal/90 text-white"
          disabled={!isCodeSent || isSendingCode}
        >
          Continue
        </Button>
      </div>
    </Card>
  );
}