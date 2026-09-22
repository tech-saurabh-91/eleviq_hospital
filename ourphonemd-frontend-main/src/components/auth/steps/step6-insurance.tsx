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
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { PATIENT_REGISTRATION_API } from "@/helper/api";
import { CheckCircle2 } from "lucide-react";

export function Step6Insurance({
  registrationId,
}: {
  registrationId: string | null;
}) {
  const formContext = useFormContext();

  const control = formContext?.control;

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!control) {
    return (
      <Card className="max-w-5xl mx-auto mt-4 p-4 border-customTeal/20 shadow-md">
        <p className="text-center text-red-500">
          Form context not available. Please try again.
        </p>
      </Card>
    );
  }

  const handleSubmit = formContext.handleSubmit(async (data) => {
    if (!registrationId) {
      alert(
        "Registration session not found. Please go back and try again."
      );
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();

      /*
       * Required registration insurance fields
       */
      formData.append(
        "insuranceType",
        data.insuranceType
      );

      formData.append(
        "insuranceProvider",
        data.insuranceProvider
      );

      formData.append(
        "insuranceId",
        data.insuranceId
      );

      formData.append(
        "policyNumber",
        data.policyNumber
      );

      formData.append(
        "coverageType",
        data.coverageType
      );

      formData.append(
        "effectiveDate",
        data.effectiveDate
      );

      /*
       * Optional fields
       */
      formData.append(
        "groupNumber",
        data.groupNumber || ""
      );

      formData.append(
        "ediPayer",
        data.ediPayer || ""
      );

      /*
       * Primary insurance
       */
      formData.append(
        "isPrimary",
        data.isPrimary ? "true" : "false"
      );

      /*
       * Front insurance card
       */
      if (
        data.frontCardImage instanceof File
      ) {
        formData.append(
          "frontCardImage",
          data.frontCardImage
        );
      }

      /*
       * Back insurance card
       */
      if (
        data.backCardImage instanceof File
      ) {
        formData.append(
          "backCardImage",
          data.backCardImage
        );
      }

      const response = await fetch(
        PATIENT_REGISTRATION_API.INSURANCE(registrationId),
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
          "Failed to save insurance"
        );
      }

      console.log(
        "Registration insurance saved:",
        result
      );

      setIsSubmitted(true);
    } catch (error) {
      console.error(
        "Insurance submission failed:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to save insurance"
      );
    } finally {
      setIsSubmitting(false);
    }
  });

  /*
   * Success screen
   */
  if (isSubmitted) {
    return (
      <Card className="max-w-5xl mx-auto mt-4 p-8 border-customTeal/20 shadow-md text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-green-600 mb-4" />

        <h2 className="text-2xl font-semibold text-customTeal mb-2">
          Insurance Details Added
        </h2>

        <p className="text-gray-700">
          Your insurance information has been
          saved successfully.
        </p>

        <p className="text-sm text-gray-500 mt-2">
          Your patient account is now ready.
        </p>
      </Card>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-8">
      <Card className="p-8 border-customTeal/20 shadow-md">

        <h2 className="text-xl font-semibold text-customTeal mb-6">
          Insurance Policy Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Insurance Type */}
          <FormField
            control={control}
            name="insuranceType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Insurance Type
                </FormLabel>

                <Select
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select insurance type" />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent>
                    <SelectItem value="commercial">
                      Commercial
                    </SelectItem>

                    <SelectItem value="medicaid">
                      Medicaid
                    </SelectItem>

                    <SelectItem value="medicare">
                      Medicare
                    </SelectItem>

                    <SelectItem value="other">
                      Other
                    </SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Insurance Provider */}
          <FormField
            control={control}
            name="insuranceProvider"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Insurance Provider
                </FormLabel>

                <FormControl>
                  <Input
                    placeholder="Enter insurance provider"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Insurance ID */}
          <FormField
            control={control}
            name="insuranceId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Insurance ID
                </FormLabel>

                <FormControl>
                  <Input
                    placeholder="Enter insurance ID"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Policy Number */}
          <FormField
            control={control}
            name="policyNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Policy Number
                </FormLabel>

                <FormControl>
                  <Input
                    placeholder="Enter policy number"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Group Number */}
          <FormField
            control={control}
            name="groupNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Group Number
                  <span className="text-gray-400 ml-1">
                    (Optional)
                  </span>
                </FormLabel>

                <FormControl>
                  <Input
                    placeholder="Enter group number"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Coverage Type */}
          <FormField
            control={control}
            name="coverageType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Coverage Type
                </FormLabel>

                <Select
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select coverage type" />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent>
                    <SelectItem value="medical">
                      Medical
                    </SelectItem>

                    <SelectItem value="primary">
                      Primary
                    </SelectItem>

                    <SelectItem value="secondary">
                      Secondary
                    </SelectItem>

                    <SelectItem value="other">
                      Other
                    </SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Effective Date */}
          <FormField
            control={control}
            name="effectiveDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Effective Date
                </FormLabel>

                <FormControl>
                  <Input
                    type="date"
                    max={
                      new Date()
                        .toISOString()
                        .split("T")[0]
                    }
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* EDI Payer */}
          <FormField
            control={control}
            name="ediPayer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  EDI Payer
                  <span className="text-gray-400 ml-1">
                    (Optional)
                  </span>
                </FormLabel>

                <FormControl>
                  <Input
                    placeholder="Enter EDI payer"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Front Card */}
          <FormField
            control={control}
            name="frontCardImage"
            render={({
              field: {
                onChange,
                value,
                ...field
              },
            }) => (
              <FormItem>
                <FormLabel>
                  Upload Front Card
                  <span className="text-gray-400 ml-1">
                    (Optional)
                  </span>
                </FormLabel>

                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    {...field}
                    value={undefined}
                    onChange={(event) => {
                      const file =
                        event.target.files?.[0];

                      onChange(file);
                    }}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Back Card */}
          <FormField
            control={control}
            name="backCardImage"
            render={({
              field: {
                onChange,
                value,
                ...field
              },
            }) => (
              <FormItem>
                <FormLabel>
                  Upload Back Card
                  <span className="text-gray-400 ml-1">
                    (Optional)
                  </span>
                </FormLabel>

                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    {...field}
                    value={undefined}
                    onChange={(event) => {
                      const file =
                        event.target.files?.[0];

                      onChange(file);
                    }}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

        </div>

        {/* Primary Insurance */}
        <div className="mt-6 border rounded-md p-4">
          <FormField
            control={control}
            name="isPrimary"
            render={({ field }) => (
              <FormItem className="flex items-center gap-3 space-y-0">

                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value || false}
                    onChange={(event) =>
                      field.onChange(
                        event.target.checked
                      )
                    }
                    className="h-4 w-4"
                  />
                </FormControl>

                <div>
                  <FormLabel className="cursor-pointer">
                    This is my primary insurance
                  </FormLabel>

                  <p className="text-xs text-gray-500 mt-1">
                    Primary insurance will be used as
                    the main insurance record.
                  </p>
                </div>

              </FormItem>
            )}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end mt-8 gap-4">

          <Button
            type="button"
            variant="outline"
            className="border-customTeal/20 text-customTeal"
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-customTeal hover:bg-customTeal/90 text-white"
          >
            {isSubmitting
              ? "Saving..."
              : "Save Insurance"}
          </Button>

        </div>

      </Card>
    </div>
  );
}