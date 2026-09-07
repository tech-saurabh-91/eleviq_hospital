"use client";

import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

export function Step6Insurance() {
  // Try to get the form context, but handle the case when it's not available
  const formContext = useFormContext();
  const control = formContext?.control;
  const [isSubmitted, setIsSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    formContext.handleSubmit((data) => {
      console.log('Form data:', data);
      setIsSubmitted(true);
    })(e);
  }

  if (isSubmitted) {
    return (
      <Card className="max-w-5xl mx-auto mt-4 p-4 border-customTeal/20 shadow-md text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-green-600 mb-4" />
        <h2 className="text-2xl font-semibold text-customTeal mb-2">Insurance Details Added</h2>
        <p className="text-gray-700">Your insurance information has been saved successfully. You can now proceed to your dashboard.</p>
      </Card>
    );
  }

  // Return a simplified version if no form context
  if (!control) {
    return (
      <Card className="max-w-5xl mx-auto mt-4 p-4 border-customTeal/20 shadow-md">
        <p className="text-center text-red-500">Form context not available. Please try again.</p>
      </Card>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-8 space-y-6">
      <Card className="p-8 border-customTeal/20 shadow-md">
        <h2 className="text-xl font-semibold text-customTeal mb-6">Insurance Policy Information</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <FormField
            control={control}
            name="userType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select user type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="self">Self</SelectItem>
                    <SelectItem value="dependent">Dependent</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="memberName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Member Name</FormLabel>
                <FormControl>
                  <Input placeholder="Select member name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="insuranceProvider"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Insurance Provider</FormLabel>
                <FormControl>
                  <Input placeholder="Enter insurance provider" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="insuranceId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Insurance ID</FormLabel>
                <FormControl>
                  <Input placeholder="Enter insurance ID" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="frontCard"
            render={({ field: { onChange, ...field } }) => (
              <FormItem>
                <FormLabel>Upload Front Card</FormLabel>
                <FormControl>
                  <Input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      onChange(file);
                    }}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="backCard"
            render={({ field: { onChange, ...field } }) => (
              <FormItem>
                <FormLabel>Upload Back Card</FormLabel>
                <FormControl>
                  <Input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      onChange(file);
                    }}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="groupNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Group Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter group number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="effectiveDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Effective Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="subscriberName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subscriber Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter subscriber name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="subscriberDob"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subscriber DOB</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="subscriberSsn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subscriber SSN</FormLabel>
                <FormControl>
                  <Input 
                    type="text"
                    placeholder="Enter subscriber SSN" 
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="subscriberCopay"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subscriber Copay</FormLabel>
                <FormControl>
                  <Input placeholder="Enter subscriber copay" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="subscriberAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subscriber Address</FormLabel>
                <FormControl>
                  <Input placeholder="Enter subscriber address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="ediPayer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>EDI Payer</FormLabel>
                <FormControl>
                  <Input placeholder="Enter EDI payer" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="memberId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Member ID</FormLabel>
                <FormControl>
                  <Input placeholder="Enter member ID" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="policyHolderName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Policy Holder Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter policy holder name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end mt-8 gap-4">
          <Button type="button" variant="outline" className="border-customTeal/20 text-customTeal">Cancel</Button>
          <Button type="submit" className="bg-customTeal hover:bg-customTeal/90 text-white" onClick={handleSubmit}>Save Insurance</Button>
        </div>
      </Card>
    </div>
  );
} 