"use client";

import React, { useState } from 'react';
import { useRouter, useParams, notFound } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { editProfileformSchema } from '@/schema/auth';

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



// Define relationship options
const relationshipOptions = [
  "Spouse", "Child", "Parent", "Sibling", "Grandparent", 
  "Grandchild", "Partner", "Friend", "Other"
];

export default function EditFamilyMemberPage() {
  const router = useRouter();
  const params = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Find the member by ID
  const member = familyMembers.find(m => m.id === params.id);
  
  // If member not found, show 404 page
  if (!member) {
    notFound();
  }
  
  // Initialize the form with existing member data
  const form = useForm<z.infer<typeof editProfileformSchema>>({
    resolver: zodResolver(editProfileformSchema) as any,
    defaultValues: {
      name: member.name,
      relationship: member.relationship.toLowerCase(),
      dateOfBirth: member.dateOfBirth,
      gender: member.gender.toLowerCase(),
      email: member.email || "",
      phone: member.phone || "",
      hasInsurance: member.insurance?.hasInsurance || false,
      insuranceProvider: member.insurance?.provider || "",
      policyNumber: member.insurance?.policyNumber || "",
    },
  });
  
  // Form submission handler
  async function onSubmit(values: z.infer<typeof editProfileformSchema>) {
    setIsSubmitting(true);
    
    try {
      // In a real application, this would make an API call to update the data
      console.log(values);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      toast.success("Family member updated successfully", {
        description: `${values.name}'s information has been updated.`,
      });
      
      // Navigate back to family member details
      router.push(`/patient/family-member/${params.id}`);
    } catch {
      toast.error("Failed to update family member", {
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
        <h1 className="text-2xl font-bold text-customTeal">Edit Family Member</h1>
        <p className="text-gray-500 mt-1">
          Update {member.name}&apos;s information
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-customTeal">
            Personal Information
          </CardTitle>
          <CardDescription>
            Edit your family member&apos;s personal details below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name Field */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="John Smith" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Relationship Field */}
                <FormField
                  control={form.control}
                  name="relationship"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relationship*</FormLabel>
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
                          {relationshipOptions.map(option => (
                            <SelectItem key={option} value={option.toLowerCase()}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Date of Birth Field */}
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth*</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Gender Field */}
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender*</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address (Optional)</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="email@example.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        For appointment notifications and reminders
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Phone Field */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number (Optional)</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="(555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Insurance Section */}
              <div className="border-t pt-6 mt-6">
                <h3 className="text-lg font-medium text-customTeal mb-4">Insurance Information</h3>
                
                <FormField
                  control={form.control}
                  name="hasInsurance"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 mb-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          This family member has health insurance
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                
                {form.watch("hasInsurance") && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <FormField
                      control={form.control}
                      name="insuranceProvider"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Insurance Provider</FormLabel>
                          <FormControl>
                            <Input placeholder="Aetna, Blue Cross, etc." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="policyNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Policy Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Policy/Member ID" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-4 pt-4">
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
                      <Save className="h-4 w-4 mr-2" /> Save Changes
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