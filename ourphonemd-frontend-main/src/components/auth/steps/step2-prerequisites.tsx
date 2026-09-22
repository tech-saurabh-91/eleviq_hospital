"use client";

import { useFormContext } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function Step2Prerequisites() {
  const formContext = useFormContext();

  if (!formContext) {
    return (
      <div className="p-4 border rounded-md bg-red-50 border-red-200">
        <p className="text-center text-red-500">
          Form context not available. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Before You Continue</CardTitle>
          <CardDescription>
            Please have the following information ready for your patient
            registration.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium">Personal Information</h4>
            <p className="text-sm text-muted-foreground">
              Full name, date of birth, gender, mobile number, and email
              address.
            </p>
          </div>

          <div>
            <h4 className="font-medium">Address & Contact Details</h4>
            <p className="text-sm text-muted-foreground">
              Current address and other contact information.
            </p>
          </div>

          <div>
            <h4 className="font-medium">Emergency Contact</h4>
            <p className="text-sm text-muted-foreground">
              Name, relationship, and contact details of your emergency
              contact.
            </p>
          </div>

          <div>
            <h4 className="font-medium">Insurance Information</h4>
            <p className="text-sm text-muted-foreground">
              Insurance provider and policy details, if applicable.
            </p>
          </div>

          <div>
            <h4 className="font-medium">Identification Information</h4>
            <p className="text-sm text-muted-foreground">
              Valid identification details, if required during registration.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}