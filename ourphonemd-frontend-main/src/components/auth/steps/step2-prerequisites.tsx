"use client";

import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useId } from "react";

export function Step2Prerequisites() {
  // Generate IDs first to avoid conditional hook calls
  const insuranceCardId = useId();
  const pharmacyInfoId = useId();
  const medicalRecordsId = useId();
  const emergencyContactId = useId();
  
  // Try to get the form context, but handle the case when it's not available
  const formContext = useFormContext();
  const control = formContext?.control;
  
  if (!formContext) {
    return (
      <div className="p-4 border rounded-md bg-red-50 border-red-200">
        <p className="text-center text-red-500">Form context not available. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pre-Registration Checklist</CardTitle>
          <CardDescription>
            Please confirm that you have the following information ready before proceeding:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={control}
            name="hasInsuranceCard"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    id={insuranceCardId}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel htmlFor={insuranceCardId}>Insurance Card</FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Your current insurance card with policy details
                  </p>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="hasPharmacyInfo"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    id={pharmacyInfoId}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel htmlFor={pharmacyInfoId}>Current Pharmacy Information</FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Name, address, and phone number of your preferred pharmacy
                  </p>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="hasMedicalRecords"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    id={medicalRecordsId}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel htmlFor={medicalRecordsId}>Previous Medical Records</FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Any relevant medical history or previous treatment records
                  </p>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="hasEmergencyContact"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    id={emergencyContactId}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel htmlFor={emergencyContactId}>Emergency Contact Information</FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Name, relationship, and contact details of your emergency contact
                  </p>
                </div>
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
} 