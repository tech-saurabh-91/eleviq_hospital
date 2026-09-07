"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { User, Lock, Eye, EyeOff, AlertTriangle, FileText } from "lucide-react";

export function Step1AccountCreation() {
  const { control, watch } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);
  const termsAccepted = watch("termsAccepted");
  const password = watch("password") || "";

  // Password validation checks
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

  return (
    <div className="space-y-6">
      {/* Terms and Conditions Panel */}
      <Card className="border-customTeal/20 shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-customTeal to-customTeal/70 p-1" />
        <div className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-6 w-6 text-customTeal" />
            <h2 className="text-2xl font-semibold text-customTeal">
              Terms & Conditions
            </h2>
          </div>

          <Alert className="bg-yellow-50 border-yellow-200 mb-4">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              Before proceeding, please read and accept our Terms and
              Conditions.
            </AlertDescription>
          </Alert>

          <div className="h-64 overflow-y-auto border rounded-md p-4 bg-gray-50 mb-6 text-sm text-gray-700">
            <div className="space-y-4">
              <section>
                <h3 className="font-semibold mb-1 text-customTeal">
                  1. Acceptance of Terms
                </h3>
                <p className="text-gray-600">
                  By accessing and using this service, you accept and agree to
                  be bound by the terms and provision of this agreement.
                </p>
              </section>

              <section>
                <h3 className="font-semibold mb-1 text-customTeal">
                  2. Privacy Policy
                </h3>
                <p className="text-gray-600">
                  Your privacy is important to us. We collect and use your
                  personal information in accordance with our Privacy Policy.
                </p>
              </section>

              <section>
                <h3 className="font-semibold mb-1 text-customTeal">
                  3. Medical Information
                </h3>
                <p className="text-gray-600">
                  All medical information provided through this service is for
                  informational purposes only and should not be considered
                  medical advice.
                </p>
              </section>

              <section>
                <h3 className="font-semibold mb-1 text-customTeal">
                  4. Data Security
                </h3>
                <p className="text-gray-600">
                  We implement appropriate security measures to protect your
                  personal information, but no method of transmission over the
                  Internet is 100% secure.
                </p>
              </section>

              <section>
                <h3 className="font-semibold mb-1 text-customTeal">
                  5. User Responsibilities
                </h3>
                <p className="text-gray-600">
                  You are responsible for maintaining the confidentiality of
                  your account information and for all activities that occur
                  under your account.
                </p>
              </section>

              <section>
                <h3 className="font-semibold mb-1 text-customTeal">
                  6. Termination
                </h3>
                <p className="text-gray-600">
                  We reserve the right to terminate or suspend your account and
                  access to our services at any time, without prior notice or
                  liability, for any reason.
                </p>
              </section>

              <section>
                <h3 className="font-semibold mb-1 text-customTeal">
                  7. Changes to Terms
                </h3>
                <p className="text-gray-600">
                  We reserve the right to modify these terms at any time. Your
                  continued use of our services following any changes indicates
                  your acceptance of the new terms.
                </p>
              </section>
            </div>
          </div>

          <FormField
            control={control}
            name="termsAccepted"
            render={({ field }) => (
              <FormItem className="flex items-start space-x-3 space-y-0 bg-customTeal/5 p-4 rounded-md border border-customTeal/20">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="data-[state=checked]:bg-customTeal data-[state=checked]:border-customTeal mt-1"
                  />
                </FormControl>
                <div className="space-y-1">
                  <FormLabel className="text-gray-800 font-medium">
                    I have read and accept the Terms and Conditions
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        </div>
      </Card>

      {/* Account Information */}
      {termsAccepted && (
        <Card className="border-customTeal/20 shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-customTeal to-customTeal/70 p-1" />
          <div className="p-5">
            <h2 className="text-xl font-semibold text-customTeal mb-3">
              Account Information
            </h2>

            <div className="space-y-4">
              {/* Email Field */}
              <FormField
                control={control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">
                      Email Address
                    </FormLabel>
                    <div className="flex border rounded-md overflow-hidden focus-within:ring-1 focus-within:ring-customTeal">
                      <div className="bg-gray-50 border-r px-3 flex items-center">
                        <User className="h-5 w-5 text-gray-500" />
                      </div>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email address"
                          className="border-0 focus-visible:ring-0 h-11"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      We&apos;ll send a verification code to this email
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Password</FormLabel>
                    <div className="flex border rounded-md overflow-hidden focus-within:ring-1 focus-within:ring-customTeal">
                      <div className="bg-gray-50 border-r px-3 flex items-center">
                        <Lock className="h-5 w-5 text-gray-500" />
                      </div>
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a secure password"
                            className="border-0 focus-visible:ring-0 h-11 pr-10"
                            {...field}
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Requirements */}
              <div className="px-4 py-3 bg-gray-50 rounded-md border border-gray-100">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Password must contain:
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li className="flex items-center gap-2">
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        hasMinLength ? "bg-green-500" : "bg-gray-300"
                      }`}
                    ></div>
                    At least 8 characters
                  </li>
                  <li className="flex items-center gap-2">
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        hasUpperCase ? "bg-green-500" : "bg-gray-300"
                      }`}
                    ></div>
                    At least one uppercase letter
                  </li>
                  <li className="flex items-center gap-2">
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        hasNumber ? "bg-green-500" : "bg-gray-300"
                      }`}
                    ></div>
                    At least one number
                  </li>
                  <li className="flex items-center gap-2">
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        hasSpecialChar ? "bg-green-500" : "bg-gray-300"
                      }`}
                    ></div>
                    At least one special character
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      )}

      {!termsAccepted && (
        <Alert className="bg-blue-50 border-blue-200">
          <AlertDescription className="text-blue-800">
            Please accept the Terms and Conditions to proceed with account
            creation.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
