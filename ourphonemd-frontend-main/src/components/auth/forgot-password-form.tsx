"use client";

import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { User, Mail, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { forgotPasswordSchema } from "@/schema/auth";
import { ForgotPasswordFormValues } from "@/types/auth.type";





export default function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true);
    // In a real app, you would handle sending password reset email here
    console.log("Forgot password data:", data);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1000);
  };

  if (isSubmitted) {
    return (
      <Card className="shadow-none border-0 overflow-hidden">
        <CardContent className="p-3 py-6">
          <Alert className="bg-customTeal/10 border-customTeal">
            <Mail className="h-5 w-5 text-customTeal" />
            <AlertTitle className="text-customTeal font-medium">Check your inbox</AlertTitle>
            <AlertDescription className="text-gray-600">
              We&apos;ve sent you an email with instructions to reset your password.
            </AlertDescription>
          </Alert>
          
          <div className="mt-6 text-center">
            <Link
              href="/signin"
              className="inline-flex items-center justify-center w-full h-11 border border-customTeal text-customTeal font-medium rounded-md hover:bg-customTeal/5"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-none border-0 overflow-hidden">
      <CardContent className="p-6">
        <FormProvider {...form}>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <div className="flex border rounded-md overflow-hidden focus-within:ring-1 focus-within:ring-customTeal">
                    <div className="bg-gray-50 border-r px-3 flex items-center">
                      <User className="h-5 w-5 text-gray-500" />
                    </div>
                    <FormControl>
                      <Input
                        placeholder="Email Address"
                        type="email"
                        className="border-0 focus-visible:ring-0 h-11"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full h-11 bg-customTeal hover:bg-teal-700 text-white font-medium text-lg shadow-none"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "RESET PASSWORD"}
            </Button>
            
            <Link href="/signin" className="block mt-4">
              <Button 
                type="button" 
                variant="outline" 
                className="w-full font-medium border-customTeal text-customTeal hover:bg-customTeal/5 hover:text-customTeal"
              >
                BACK TO LOGIN
              </Button>
            </Link>
          </form>
        </Form>
        </FormProvider>
      </CardContent>
    </Card>
  );
} 