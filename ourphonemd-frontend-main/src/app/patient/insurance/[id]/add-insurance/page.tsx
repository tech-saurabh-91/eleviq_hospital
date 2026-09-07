
"use client";

import React, { useState } from 'react';
import { useRouter, useParams, notFound } from 'next/navigation';
import { ArrowLeft, CreditCard, Save, Info } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { insuranceFormSchema } from '@/schema/insurance';

// Sample data - in a real app, you would fetch this from an API
const familyMembers = [
  {
    id: "1",
    name: "John Smith",
    relationship: "Father",
    dateOfBirth: "1985-06-15",
    gender: "Male",
    phone: "555-123-4567",
    email: "john.smith@example.com",
    insurance: {
      hasInsurance: true,
      provider: "Aetna",
      policyNumber: "AE7654321"
    },
    appointments: {
      total: 5,
      upcoming: 1,
      past: 4
    }
  },
  {
    id: "2",
    email: "emma@gmail.com",
    name: "Emma Smith",
    relationship: "Child",
    dateOfBirth: "2015-03-22",
    gender: "Female",
    insurance: {
      hasInsurance: false
    },
    appointments: {
      total: 3,
      upcoming: 0,
      past: 3
    }
  }
];

// Common insurance providers
const insuranceProviders = [
  "Aetna", "Anthem", "Blue Cross Blue Shield", "Cigna", "Humana", 
  "Kaiser Permanente", "Medicare", "Medicaid", "UnitedHealthcare"
];



export default function AddInsurancePage() {
  const router = useRouter();
  const params = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCustomProvider, setShowCustomProvider] = useState(false);
  
  // Find the member by ID
  const member = familyMembers.find(m => m.id === params.id);
  
  // If member not found, show 404 page
  if (!member) {
    notFound();
  }
  
  // If member already has insurance, redirect to edit page
  if (member.insurance?.hasInsurance) {
    router.push(`/patient/family-member/${params.id}/edit`);
  }
  
  // Initialize the form
  const form = useForm<z.infer<typeof insuranceFormSchema>>({
    resolver: zodResolver(insuranceFormSchema),
    defaultValues: {
      provider: "",
      customProvider: "",
      policyNumber: "",
      groupNumber: "",
      policyHolderName: member.name, // Default to member's name
      relationshipToMember: "self",
      startDate: "",
    },
  });
  
  // Watch provider to show/hide custom provider field
  const selectedProvider = form.watch("provider");
  
  React.useEffect(() => {
    setShowCustomProvider(selectedProvider === "other");
  }, [selectedProvider]);
  
  // Form submission handler
  async function onSubmit(values: z.infer<typeof insuranceFormSchema>) {
    setIsSubmitting(true);
    
    try {
      // Determine the actual provider name (custom or selected)
      const providerName = values.provider === "other" ? values.customProvider : values.provider;
      
      // In a real application, this would make an API call to update the data
      console.log({
        ...values,
        provider: providerName,
      });
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      toast.success("Insurance added successfully", {
        description: `Insurance information has been added for ${member?.name}.`,
      });
      
      // Navigate back to family member details
      router.push(`/patient/family-member/${params.id}`);
    } catch  {
      toast.error("Failed to add insurance information", {
        description: "Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Handle cancel button
  const handleCancel = () => {
    router.back();
  };
  
  return (
    <div className="max-w-5xl m-auto  py-3 px-4">

      <div className="mb-6">
        <Button 
          variant="ghost" 
          className="text-customTeal mb-4" 
          onClick={handleCancel}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <h1 className="text-2xl font-bold text-customTeal">Add Insurance Information</h1>
        <p className="text-gray-500 mt-1">
          Add insurance details for {member.name}
        </p>
      </div>
      
      <Alert className="mb-6 bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-500" />
        <AlertTitle className="text-blue-700">Why add insurance information?</AlertTitle>
        <AlertDescription className="text-blue-600">
          Adding insurance information helps streamline your family member&apos;s healthcare experience, enabling faster check-ins and accurate billing.
        </AlertDescription>
      </Alert>
      
      <Card>
        <CardHeader className="bg-customTeal/5">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-customTeal">Insurance Details</CardTitle>
              <CardDescription>
                Enter your family member&apos;s insurance information
              </CardDescription>
            </div>
            <div className="bg-customTeal/20 p-3 rounded-full">
              <CreditCard className="h-6 w-6 text-customTeal" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Insurance Provider Field */}
                <FormField
                  control={form.control}
                  name="provider"
                  render={({ field }) => (
                    <FormItem className="col-span-2 md:col-span-1">
                      <FormLabel>Insurance Provider*</FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value);
                        }} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select insurance provider" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {/* Use index in the key to ensure uniqueness, and use a value-based scheme that ensures uniqueness */}
                          {insuranceProviders.map((provider, index) => (
                            <SelectItem 
                              key={`provider-${index}`} 
                              value={`provider-${provider.toLowerCase().replace(/\s+/g, '-')}`}
                            >
                              {provider}
                            </SelectItem>
                          ))}
                          {/* Special "Other" option with a unique key and value */}
                          <SelectItem key="custom-provider" value="other">
                            Other
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Custom Provider Field - shown only when "Other" is selected */}
                {showCustomProvider && (
                  <FormField
                    control={form.control}
                    name="customProvider"
                    render={({ field }) => (
                      <FormItem className="col-span-2 md:col-span-1">
                        <FormLabel>Custom Provider Name*</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter insurance provider name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                {/* Policy Number Field */}
                <FormField
                  control={form.control}
                  name="policyNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Policy/Member ID*</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., ABC123456789" {...field} />
                      </FormControl>
                      <FormDescription>
                        Found on your insurance card
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Group Number Field */}
                <FormField
                  control={form.control}
                  name="groupNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Group Number (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., GRP1234567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Policy Holder Name Field */}
                <FormField
                  control={form.control}
                  name="policyHolderName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Policy Holder Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="Full name of policy holder" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Relationship to Member Field */}
                <FormField
                  control={form.control}
                  name="relationshipToMember"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relationship to Policy Holder*</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select relationship" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="self">Self</SelectItem>
                          <SelectItem value="spouse">Spouse</SelectItem>
                          <SelectItem value="parent">Parent</SelectItem>
                          <SelectItem value="child">Child</SelectItem>
                          <SelectItem value="other-relation">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Coverage Start Date Field */}
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Coverage Start Date (Optional)</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex justify-end space-x-4 pt-4 border-t mt-8">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-customTeal hover:bg-customTeal/90 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>Saving...</>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" /> Save Insurance Information
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
