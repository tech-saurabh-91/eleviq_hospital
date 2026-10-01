"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CreditCard,
  FileText,
  Info,
  Save,
  Upload,
  X,
} from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

import { toast } from "sonner";

import api from "@/helper/axios";
import {
  PATIENT_INSURANCE_API,
} from "@/helper/api";

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

interface InsuranceFile {
  file: File | null;
  preview: string;
}

/* -------------------------------------------------------------------------- */
/* CONSTANTS                                                                  */
/* -------------------------------------------------------------------------- */

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
];

const insuranceProviders = [
  "Star Health and Allied Insurance",
  "Niva Bupa Health Insurance",
  "Care Health Insurance",
  "HDFC ERGO Health Insurance",
  "ICICI Lombard General Insurance",
  "Aditya Birla Health Insurance",
  "ManipalCigna Health Insurance",
  "Tata AIG General Insurance",
  "Bajaj Allianz General Insurance",
  "New India Assurance",
  "National Insurance Company",
  "United India Insurance",
  "Oriental Insurance",
  "Other",
];

const insuranceTypes = [
  {
    value: "Government",
    label: "Government Health Scheme",
  },
  {
    value: "Ayushman Bharat PM-JAY",
    label: "Ayushman Bharat PM-JAY",
  },
  {
    value: "CGHS",
    label: "CGHS",
  },
  {
    value: "ESIC",
    label: "ESIC",
  },
  {
    value: "Commercial",
    label: "Private / Commercial Insurance",
  },
  {
    value: "Other",
    label: "Other",
  },
];

const coverageTypes = [
  "Medical",
  "Hospitalization",
  "Maternity",
  "Critical Illness",
  "Dental",
  "Vision",
  "Other",
];

const relationshipOptions = [
  {
    value: "Self",
    label: "Self",
  },
  {
    value: "Spouse",
    label: "Spouse",
  },
  {
    value: "Child",
    label: "Child",
  },
  {
    value: "Parent",
    label: "Parent",
  },
  {
    value: "Other",
    label: "Other",
  },
];
/* -------------------------------------------------------------------------- */
/* VALIDATION                                                                 */
/* -------------------------------------------------------------------------- */

const insuranceFormSchema = z
  .object({
    insuranceType: z
      .string()
      .min(1, "Insurance type is required"),

    insuranceProvider: z
      .string()
      .min(1, "Insurance provider is required"),

    customProvider: z.string().optional(),

    insuranceId: z
      .string()
      .trim()
      .min(1, "Insurance member ID is required")
      .max(100, "Insurance member ID is too long"),

    policyNumber: z
      .string()
      .trim()
      .min(1, "Policy number is required")
      .max(100, "Policy number is too long"),

    groupNumber: z
      .string()
      .trim()
      .max(100, "Group number is too long")
      .optional(),

    ediPayer: z
      .string()
      .trim()
      .max(100, "EDI payer is too long")
      .optional(),

    coverageType: z
      .string()
      .min(1, "Coverage type is required"),

    effectiveDate: z
      .string()
      .min(1, "Effective date is required"),

    relationship: z
      .string()
      .min(1, "Relationship is required"),

    isPrimary: z.boolean(),

    subscriberName: z
      .string()
      .trim()
      .max(150, "Subscriber name is too long")
      .optional(),

    subscriberCopay: z
      .string()
      .trim()
      .max(50, "Subscriber copay is too long")
      .optional(),

    subscriberSsn: z
      .string()
      .trim()
      .max(20, "Subscriber SSN is too long")
      .optional(),

    subscriberDateOfBirth: z
      .string()
      .optional(),

    subscriberAddress: z
      .string()
      .trim()
      .max(300, "Subscriber address is too long")
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.insuranceProvider === "Other" &&
      !data.customProvider?.trim()
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["customProvider"],
        message: "Insurance provider name is required",
      });
    }

    if (data.effectiveDate) {
      const selectedDate = new Date(
        `${data.effectiveDate}T00:00:00`
      );

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate > today) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["effectiveDate"],
          message:
            "Insurance effective date cannot be in the future",
        });
      }
    }

    /*
     * Backend requires subscriber information for:
     * - commercial
     * - non-medicaid
     *
     * We mirror that rule here so the user gets the error
     * before making the API request.
     */
    const normalizedType = data.insuranceType.toLowerCase();

    const requiresSubscriber =
      normalizedType.includes("commercial") ||
      normalizedType.includes("non-medicaid");

    if (requiresSubscriber) {
      if (!data.subscriberName?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["subscriberName"],
          message: "Subscriber name is required",
        });
      }

      if (!data.subscriberSsn?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["subscriberSsn"],
          message: "Subscriber SSN is required",
        });
      }

      if (!data.subscriberDateOfBirth) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["subscriberDateOfBirth"],
          message: "Subscriber date of birth is required",
        });
      }

      if (!data.subscriberAddress?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["subscriberAddress"],
          message: "Subscriber address is required",
        });
      }
    }
  });

type InsuranceFormValues = z.infer<
  typeof insuranceFormSchema
>;

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

const getFullName = (member: FamilyMember | null) => {
  if (!member) return "";

  return [
    member.firstName,
    member.middleName,
    member.lastName,
  ]
    .filter(Boolean)
    .join(" ");
};

const validateInsuranceFile = (file: File) => {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return "Only JPG, PNG, and GIF images are allowed.";
  }

  if (file.size > MAX_FILE_SIZE) {
    return "Insurance card image must be 5 MB or smaller.";
  }

  return null;
};

/* -------------------------------------------------------------------------- */
/* PAGE                                                                       */
/* -------------------------------------------------------------------------- */

export default function AddInsurancePage() {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [frontCard, setFrontCard] =
    useState<InsuranceFile>({
      file: null,
      preview: "",
    });

  const [backCard, setBackCard] =
    useState<InsuranceFile>({
      file: null,
      preview: "",
    });

  const form = useForm<InsuranceFormValues>({
    resolver: zodResolver(insuranceFormSchema),

    defaultValues: {
      insuranceType: "",
      insuranceProvider: "",
      customProvider: "",
      insuranceId: "",
      policyNumber: "",
      groupNumber: "",
      ediPayer: "",
      coverageType: "",
      effectiveDate: "",
      relationship: "self",
      isPrimary: false,
      subscriberName: "",
      subscriberCopay: "",
      subscriberSsn: "",
      subscriberDateOfBirth: "",
      subscriberAddress: "",
    },
  });

  const insuranceType = form.watch("insuranceType");
  const insuranceProvider = form.watch(
    "insuranceProvider"
  );

  const requiresSubscriber = useMemo(() => {
    const normalizedType =
      insuranceType?.toLowerCase() || "";

    return (
      normalizedType.includes("commercial") ||
      normalizedType.includes("non-medicaid")
    );
  }, [insuranceType]);

 
  /* ------------------------------------------------------------------------ */
  /* FILE HANDLING                                                            */
  /* ------------------------------------------------------------------------ */

  const handleFileChange = (
    file: File | null,
    side: "front" | "back"
  ) => {
    if (!file) return;

    const validationError =
      validateInsuranceFile(file);

    if (validationError) {
      toast.error(validationError);
      return;
    }

    const preview = URL.createObjectURL(file);

    if (side === "front") {
      if (frontCard.preview) {
        URL.revokeObjectURL(frontCard.preview);
      }

      setFrontCard({
        file,
        preview,
      });
    } else {
      if (backCard.preview) {
        URL.revokeObjectURL(backCard.preview);
      }

      setBackCard({
        file,
        preview,
      });
    }
  };

  const removeFile = (
    side: "front" | "back"
  ) => {
    if (side === "front") {
      if (frontCard.preview) {
        URL.revokeObjectURL(frontCard.preview);
      }

      setFrontCard({
        file: null,
        preview: "",
      });
    } else {
      if (backCard.preview) {
        URL.revokeObjectURL(backCard.preview);
      }

      setBackCard({
        file: null,
        preview: "",
      });
    }
  };

  /* ------------------------------------------------------------------------ */
  /* CLEANUP PREVIEWS                                                         */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    return () => {
      if (frontCard.preview) {
        URL.revokeObjectURL(frontCard.preview);
      }

      if (backCard.preview) {
        URL.revokeObjectURL(backCard.preview);
      }
    };
  }, []);

  /* ------------------------------------------------------------------------ */
  /* SUBMIT                                                                    */
  /* ------------------------------------------------------------------------ */

  const onSubmit = async (
    values: InsuranceFormValues
  ) => {
    if (!familyMemberId) {
      toast.error("Family member ID is missing.");
      return;
    }

    if (!member) {
      toast.error("Family member information is unavailable.");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = new FormData();

      const providerName =
        values.insuranceProvider === "Other"
          ? values.customProvider?.trim()
          : values.insuranceProvider;

      data.append(
        "insuranceType",
        values.insuranceType
      );

      data.append(
        "insuranceProvider",
        providerName || ""
      );

      data.append(
        "insuranceId",
        values.insuranceId.trim()
      );

      data.append(
        "policyNumber",
        values.policyNumber.trim()
      );

      if (values.groupNumber?.trim()) {
        data.append(
          "groupNumber",
          values.groupNumber.trim()
        );
      }

      if (values.ediPayer?.trim()) {
        data.append(
          "ediPayer",
          values.ediPayer.trim()
        );
      }

      data.append(
        "coverageType",
        values.coverageType
      );

      data.append(
        "effectiveDate",
        values.effectiveDate
      );

      data.append(
        "relationship",
        values.relationship
      );

      data.append(
        "familyMemberId",
        familyMemberId
      );

      data.append(
        "isPrimary",
        String(values.isPrimary)
      );

      if (values.subscriberName?.trim()) {
        data.append(
          "subscriberName",
          values.subscriberName.trim()
        );
      }

      if (values.subscriberCopay?.trim()) {
        data.append(
          "subscriberCopay",
          values.subscriberCopay.trim()
        );
      }

      if (values.subscriberSsn?.trim()) {
        data.append(
          "subscriberSsn",
          values.subscriberSsn.trim()
        );
      }

      if (values.subscriberDateOfBirth) {
        data.append(
          "subscriberDateOfBirth",
          values.subscriberDateOfBirth
        );
      }

      if (values.subscriberAddress?.trim()) {
        data.append(
          "subscriberAddress",
          values.subscriberAddress.trim()
        );
      }

      if (frontCard.file) {
        data.append(
          "frontCardImage",
          frontCard.file
        );
      }

      if (backCard.file) {
        data.append(
          "backCardImage",
          backCard.file
        );
      }

      const response = await api.post(
        PATIENT_INSURANCE_API.CREATE,
        data
      );

      toast.success(
        response.data?.message ||
          "Insurance added successfully."
      );

      router.push("/patient/insurance");
    } catch (error: any) {
      console.error(
        "Insurance creation failed:",
        error
      );

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.errors?.[0]
          ?.message ||
        "Failed to add insurance information.";

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ------------------------------------------------------------------------ */
  /* LOADING                                                                   */
  /* ------------------------------------------------------------------------ */

  if (loadingMember) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[300px]">
          <p className="text-gray-500">
            Loading family member...
          </p>
        </div>
      </div>
    );
  }

  if (!member) {
    return null;
  }

  const memberName = getFullName(member);

  /* ------------------------------------------------------------------------ */
  /* UI                                                                        */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="max-w-5xl mx-auto py-3 px-4">
      {/* Header */}
      <div className="mb-6">
        <Button
          type="button"
          variant="ghost"
          className="text-customTeal mb-4"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <h1 className="text-2xl font-bold text-customTeal">
          Add Insurance Information
        </h1>

        <p className="text-gray-500 mt-1">
          Add insurance details for {memberName}
        </p>
      </div>

      {/* Information */}
      <Alert className="mb-6 bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-500" />

        <AlertTitle className="text-blue-700">
          Why add insurance information?
        </AlertTitle>

        <AlertDescription className="text-blue-600">
          Adding insurance information helps
          streamline your family member&apos;s
          healthcare experience, enabling faster
          check-ins and accurate billing.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader className="bg-customTeal/5">
          <div className="flex justify-between items-start gap-4">
            <div>
              <CardTitle className="text-customTeal">
                Insurance Details
              </CardTitle>

              <CardDescription>
                Enter your insurance information
              </CardDescription>
            </div>

            <div className="bg-customTeal/20 p-3 rounded-full shrink-0">
              <CreditCard className="h-6 w-6 text-customTeal" />
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              {/* ---------------------------------------------------------------- */}
              {/* BASIC INSURANCE INFORMATION                                     */}
              {/* ---------------------------------------------------------------- */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Insurance Type */}
                <FormField
                  control={form.control}
                  name="insuranceType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Insurance Type*
                      </FormLabel>

                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select insurance type" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          {insuranceTypes.map(
                            (type) => (
                              <SelectItem
                                key={type.value}
                                value={type.value}
                              >
                                {type.label}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Provider */}
                <FormField
                  control={form.control}
                  name="insuranceProvider"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Insurance Provider*
                      </FormLabel>

                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select insurance provider" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          {insuranceProviders.map(
                            (provider) => (
                              <SelectItem
                                key={provider}
                                value={provider}
                              >
                                {provider}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Custom Provider */}
                {insuranceProvider ===
                  "Other" && (
                  <FormField
                    control={form.control}
                    name="customProvider"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Provider Name*
                        </FormLabel>

                        <FormControl>
                          <Input
                            placeholder="Enter insurance provider name"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Insurance Member ID */}
                <FormField
                  control={form.control}
                  name="insuranceId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Insurance Member ID*
                      </FormLabel>

                      <FormControl>
                        <Input
                          placeholder="Enter member ID"
                          {...field}
                        />
                      </FormControl>

                      <FormDescription>
                        Member ID shown on the insurance
                        card.
                      </FormDescription>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Policy Number */}
                <FormField
                  control={form.control}
                  name="policyNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Policy Number*
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
                  control={form.control}
                  name="groupNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Group Number
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

                {/* EDI Payer */}
                <FormField
                  control={form.control}
                  name="ediPayer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        EDI Payer
                      </FormLabel>

                      <FormControl>
                        <Input
                          placeholder="Enter EDI payer"
                          {...field}
                        />
                      </FormControl>

                      <FormDescription>
                        Optional payer identifier.
                      </FormDescription>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Coverage Type */}
                <FormField
                  control={form.control}
                  name="coverageType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Coverage Type*
                      </FormLabel>

                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select coverage type" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          {coverageTypes.map(
                            (coverage) => (
                              <SelectItem
                                key={coverage}
                                value={coverage}
                              >
                                {coverage}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Effective Date */}
                <FormField
                  control={form.control}
                  name="effectiveDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Effective Date*
                      </FormLabel>

                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                        />
                      </FormControl>

                      <FormDescription>
                        Cannot be a future date.
                      </FormDescription>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Relationship */}
                <FormField
                  control={form.control}
                  name="relationship"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Relationship to Subscriber*
                      </FormLabel>

                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);

                          if (
                            value === "self" &&
                            member
                          ) {
                            form.setValue(
                              "subscriberName",
                              memberName
                            );

                            form.setValue(
                              "subscriberDateOfBirth",
                              member.dateOfBirth
                            );

                            const address = [
                              member.address
                                ?.street,
                              member.address?.city,
                              member.address?.state,
                              member.address?.zipCode,
                            ]
                              .filter(Boolean)
                              .join(", ");

                            form.setValue(
                              "subscriberAddress",
                              address
                            );
                          }
                        }}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select relationship" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          {relationshipOptions.map(
                            (relationship) => (
                              <SelectItem
                                key={
                                  relationship.value
                                }
                                value={
                                  relationship.value
                                }
                              >
                                {relationship.label}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* ---------------------------------------------------------------- */}
              {/* SUBSCRIBER INFORMATION                                          */}
              {/* ---------------------------------------------------------------- */}

              {requiresSubscriber && (
                <div className="border-t pt-6">
                  <div className="mb-5">
                    <h2 className="text-lg font-semibold text-customTeal">
                      Subscriber Information
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      Required for commercial insurance.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Subscriber Name */}
                    <FormField
                      control={form.control}
                      name="subscriberName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Subscriber Name*
                          </FormLabel>

                          <FormControl>
                            <Input
                              placeholder="Enter subscriber full name"
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Subscriber DOB */}
                    <FormField
                      control={form.control}
                      name="subscriberDateOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Subscriber Date of Birth*
                          </FormLabel>

                          <FormControl>
                            <Input
                              type="date"
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Subscriber SSN */}
                    <FormField
                      control={form.control}
                      name="subscriberSsn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Subscriber SSN*
                          </FormLabel>

                          <FormControl>
                            <Input
                              type="password"
                              autoComplete="off"
                              placeholder="Enter subscriber SSN"
                              {...field}
                            />
                          </FormControl>

                          <FormDescription>
                            Sensitive information. Store
                            and transmit only when required.
                          </FormDescription>

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Subscriber Copay */}
                    <FormField
                      control={form.control}
                      name="subscriberCopay"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Subscriber Copay
                          </FormLabel>

                          <FormControl>
                            <Input
                              placeholder="Enter copay amount"
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Subscriber Address */}
                    <FormField
                      control={form.control}
                      name="subscriberAddress"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>
                            Subscriber Address*
                          </FormLabel>

                          <FormControl>
                            <Input
                              placeholder="Enter subscriber address"
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {/* ---------------------------------------------------------------- */}
              {/* INSURANCE CARD IMAGES                                            */}
              {/* ---------------------------------------------------------------- */}

              <div className="border-t pt-6">
                <div className="mb-5">
                  <h2 className="text-lg font-semibold text-customTeal">
                    Insurance Card
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Upload the front and back of the
                    insurance card. JPG, PNG, or GIF,
                    maximum 5 MB per image.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Front */}
                  <div className="space-y-3">
                    <label
                      htmlFor="frontCardImage"
                      className="text-sm font-medium"
                    >
                      Front of Card
                    </label>

                    {frontCard.preview ? (
                      <div className="relative overflow-hidden rounded-lg border bg-gray-50">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={frontCard.preview}
                          alt="Insurance card front preview"
                          className="h-56 w-full object-contain"
                        />

                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute right-2 top-2"
                          onClick={() =>
                            removeFile("front")
                          }
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <label
                        htmlFor="frontCardImage"
                        className="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 text-center hover:bg-gray-100"
                      >
                        <Upload className="h-8 w-8 text-gray-400 mb-2" />

                        <span className="text-sm font-medium">
                          Upload front of card
                        </span>

                        <span className="text-xs text-gray-500 mt-1">
                          JPG, PNG, GIF up to 5 MB
                        </span>
                      </label>
                    )}

                    <input
                      id="frontCardImage"
                      type="file"
                      accept="image/jpeg,image/png,image/gif"
                      className="hidden"
                      onChange={(event) => {
                        const file =
                          event.target.files?.[0] ||
                          null;

                        handleFileChange(
                          file,
                          "front"
                        );

                        event.currentTarget.value =
                          "";
                      }}
                    />
                  </div>

                  {/* Back */}
                  <div className="space-y-3">
                    <label
                      htmlFor="backCardImage"
                      className="text-sm font-medium"
                    >
                      Back of Card
                    </label>

                    {backCard.preview ? (
                      <div className="relative overflow-hidden rounded-lg border bg-gray-50">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={backCard.preview}
                          alt="Insurance card back preview"
                          className="h-56 w-full object-contain"
                        />

                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute right-2 top-2"
                          onClick={() =>
                            removeFile("back")
                          }
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <label
                        htmlFor="backCardImage"
                        className="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 text-center hover:bg-gray-100"
                      >
                        <FileText className="h-8 w-8 text-gray-400 mb-2" />

                        <span className="text-sm font-medium">
                          Upload back of card
                        </span>

                        <span className="text-xs text-gray-500 mt-1">
                          JPG, PNG, GIF up to 5 MB
                        </span>
                      </label>
                    )}

                    <input
                      id="backCardImage"
                      type="file"
                      accept="image/jpeg,image/png,image/gif"
                      className="hidden"
                      onChange={(event) => {
                        const file =
                          event.target.files?.[0] ||
                          null;

                        handleFileChange(
                          file,
                          "back"
                        );

                        event.currentTarget.value =
                          "";
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* ---------------------------------------------------------------- */}
              {/* PRIMARY                                                           */}
              {/* ---------------------------------------------------------------- */}

              <FormField
                control={form.control}
                name="isPrimary"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-customTeal focus:ring-customTeal"
                      />
                    </FormControl>

                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Make this the primary insurance
                      </FormLabel>

                      <FormDescription>
                        If selected, any existing primary
                        insurance for this family member
                        will no longer be primary.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              {/* ---------------------------------------------------------------- */}
              {/* ACTIONS                                                           */}
              {/* ---------------------------------------------------------------- */}

              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  className="bg-customTeal hover:bg-customTeal/90 text-white"
                  disabled={
                    isSubmitting ||
                    loadingMember
                  }
                >
                  {isSubmitting ? (
                    "Saving..."
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Insurance Information
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