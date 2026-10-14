"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CreditCard,
  FileCheck,
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
import { Badge } from "@/components/ui/badge";

import { toast } from "sonner";

import api from "@/helper/axios";
import {
  PATIENT_FAMILY_API,
  PATIENT_INSURANCE_API,
} from "@/helper/api";

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

interface FamilyMember {
  familyMemberId: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  relationship: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  phone: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
}

interface InsuranceFile {
  file: File | null;
  preview: string;
  name?: string;
}

/* -------------------------------------------------------------------------- */
/* CONSTANTS                                                                  */
/* -------------------------------------------------------------------------- */

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_CARD_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
];

const ALLOWED_DOC_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "application/pdf",
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
  "Reliance General Insurance",
  "SBI General Insurance",
  "Other",
];

const insuranceTypes = [
  {
    value: "Private Health Insurance",
    label: "Private Health Insurance",
  },
  {
    value: "Employer-Sponsored / Group",
    label: "Employer-Sponsored / Group Insurance",
  },
  {
    value: "Ayushman Bharat PM-JAY",
    label: "Ayushman Bharat PM-JAY",
  },
  {
    value: "CGHS",
    label: "CGHS (Central Government Health Scheme)",
  },
  {
    value: "ESIC",
    label: "ESIC (Employees' State Insurance)",
  },
  {
    value: "Government Health Scheme",
    label: "Other State / Government Scheme",
  },
  {
    value: "Commercial",
    label: "Commercial Insurance",
  },
  {
    value: "Other",
    label: "Other",
  },
];

const tpaProviders = [
  "Medi Assist Insurance TPA",
  "Vidal Health TPA",
  "MDIndia Health Insurance TPA",
  "Paramount Health Services & Insurance TPA",
  "Heritage Health Insurance TPA",
  "Raksha Health Insurance TPA",
  "Family Health Plan Insurance TPA (FHPL)",
  "Dedicated Healthcare Services TPA",
  "None / Direct Settlement",
  "Other",
];

const policyTypes = [
  { value: "Individual", label: "Individual" },
  { value: "Family Floater", label: "Family Floater" },
  { value: "Group/Employer", label: "Group / Employer" },
  { value: "Government Scheme", label: "Government Scheme" },
];

const coverageTypes = [
  "Hospitalization",
  "Comprehensive Medical",
  "Critical Illness",
  "Maternity & Newborn",
  "Day Care Treatments",
  "Dental",
  "Vision",
  "Other",
];

const roomRentLimits = [
  "No Capping / Standard Room",
  "1% of Sum Insured per day",
  "2% of Sum Insured per day",
  "Single Private AC Room",
  "Twin Sharing / Semi-Private",
  "General Ward",
  "Other / Custom Limit",
];

const relationshipOptions = [
  { value: "Self", label: "Self" },
  { value: "Spouse", label: "Spouse" },
  { value: "Child", label: "Child" },
  { value: "Parent", label: "Parent" },
  { value: "Other", label: "Other" },
];

/* -------------------------------------------------------------------------- */
/* VALIDATION SCHEMA                                                          */
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

    tpa: z.string().optional(),
    customTpa: z.string().optional(),

    planName: z.string().optional(),

    policyType: z
      .string()
      .min(1, "Policy type is required"),

    insuranceId: z
      .string()
      .trim()
      .min(1, "Insurance member ID / card number is required")
      .max(100, "Insurance member ID is too long"),

    policyNumber: z
      .string()
      .trim()
      .min(1, "Policy number is required")
      .max(100, "Policy number is too long"),

    policyHolderName: z
      .string()
      .trim()
      .min(1, "Policyholder name is required")
      .max(150, "Policyholder name is too long"),

    coverageType: z
      .string()
      .min(1, "Coverage type is required"),

    effectiveDate: z
      .string()
      .min(1, "Policy start date is required"),

    expiryDate: z.string().optional(),

    sumInsured: z.string().optional(),
    remainingSumInsured: z.string().optional(),
    roomRentLimit: z.string().optional(),
    copay: z.string().optional(),
    deductible: z.string().optional(),
    coverageRestrictions: z.string().optional(),

    relationship: z
      .string()
      .min(1, "Relationship is required"),

    isPrimary: z.boolean(),

    // Group / Corporate Insurance
    employerName: z.string().optional(),
    employeeId: z.string().optional(),
    groupNumber: z.string().optional(),

    // Government Scheme
    schemeName: z.string().optional(),
    beneficiaryId: z.string().optional(),

    // Legacy US fields
    ediPayer: z.string().optional(),
    subscriberName: z.string().optional(),
    subscriberCopay: z.string().optional(),
    subscriberSsn: z.string().optional(),
    subscriberDateOfBirth: z.string().optional(),
    subscriberAddress: z.string().optional(),
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

    if (data.tpa === "Other" && !data.customTpa?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["customTpa"],
        message: "TPA name is required",
      });
    }

    if (data.effectiveDate) {
      const selectedDate = new Date(`${data.effectiveDate}T00:00:00`);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate > today) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["effectiveDate"],
          message: "Insurance effective date cannot be in the future",
        });
      }
    }

    if (data.expiryDate && data.effectiveDate) {
      const start = new Date(`${data.effectiveDate}T00:00:00`);
      const end = new Date(`${data.expiryDate}T00:00:00`);

      if (end < start) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["expiryDate"],
          message: "Policy expiry date cannot be earlier than start date",
        });
      }
    }

    const isGroup =
      data.insuranceType === "Employer-Sponsored / Group" ||
      data.policyType === "Group/Employer";

    if (isGroup && !data.employerName?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["employerName"],
        message: "Employer name is required for corporate/group insurance",
      });
    }
  });

type InsuranceFormValues = z.infer<typeof insuranceFormSchema>;

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

const validateFile = (file: File, isDocument = false) => {
  const allowed = isDocument ? ALLOWED_DOC_TYPES : ALLOWED_CARD_TYPES;

  if (!allowed.includes(file.type)) {
    return isDocument
      ? "Only JPG, PNG, GIF images or PDF documents are allowed."
      : "Only JPG, PNG, and GIF images are allowed for insurance cards.";
  }

  if (file.size > MAX_FILE_SIZE) {
    return "File must be 5 MB or smaller.";
  }

  return null;
};

/* -------------------------------------------------------------------------- */
/* PAGE COMPONENT                                                             */
/* -------------------------------------------------------------------------- */

export default function AddInsurancePage() {
  const router = useRouter();
  const params = useParams();

  const familyMemberId = String(params.id || "");

  const [member, setMember] = useState<FamilyMember | null>(null);
  const [loadingMember, setLoadingMember] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [frontCard, setFrontCard] = useState<InsuranceFile>({
    file: null,
    preview: "",
  });

  const [backCard, setBackCard] = useState<InsuranceFile>({
    file: null,
    preview: "",
  });

  const [policyDoc, setPolicyDoc] = useState<InsuranceFile>({
    file: null,
    preview: "",
    name: "",
  });

  const form = useForm<InsuranceFormValues>({
    resolver: zodResolver(insuranceFormSchema),
    defaultValues: {
      insuranceType: "Private Health Insurance",
      insuranceProvider: "",
      customProvider: "",
      tpa: "",
      customTpa: "",
      planName: "",
      policyType: "Individual",
      insuranceId: "",
      policyNumber: "",
      policyHolderName: "",
      coverageType: "Hospitalization",
      effectiveDate: "",
      expiryDate: "",
      sumInsured: "",
      remainingSumInsured: "",
      roomRentLimit: "",
      copay: "",
      deductible: "",
      coverageRestrictions: "",
      relationship: "Self",
      isPrimary: false,
      employerName: "",
      employeeId: "",
      groupNumber: "",
      schemeName: "",
      beneficiaryId: "",
      ediPayer: "",
      subscriberName: "",
      subscriberCopay: "",
      subscriberSsn: "",
      subscriberDateOfBirth: "",
      subscriberAddress: "",
    },
  });

  const insuranceType = form.watch("insuranceType");
  const insuranceProvider = form.watch("insuranceProvider");
  const selectedTpa = form.watch("tpa");
  const policyType = form.watch("policyType");

  const isGroupInsurance = useMemo(() => {
    return (
      insuranceType === "Employer-Sponsored / Group" ||
      policyType === "Group/Employer"
    );
  }, [insuranceType, policyType]);

  const isGovtScheme = useMemo(() => {
    return (
      insuranceType === "Ayushman Bharat PM-JAY" ||
      insuranceType === "CGHS" ||
      insuranceType === "ESIC" ||
      insuranceType === "Government Health Scheme" ||
      policyType === "Government Scheme"
    );
  }, [insuranceType, policyType]);

  /* ------------------------------------------------------------------------ */
  /* FETCH FAMILY MEMBER                                                      */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    let isMounted = true;

    const fetchFamilyMember = async () => {
      try {
        setLoadingMember(true);
        const response = await api.get(
          PATIENT_FAMILY_API.GET_SINGLE(familyMemberId)
        );

        const data = response.data?.data ?? response.data;

        if (isMounted) {
          setMember(data);
          const name = getFullName(data);
          if (name) {
            form.setValue("policyHolderName", name);
            form.setValue("subscriberName", name);
          }
        }
      } catch (error: any) {
        console.error("Failed to fetch family member:", error);
        if (isMounted) {
          toast.error(
            error?.response?.data?.message || "Failed to load family member."
          );
          router.push("/patient/family-member");
        }
      } finally {
        if (isMounted) {
          setLoadingMember(false);
        }
      }
    };

    if (familyMemberId) {
      fetchFamilyMember();
    }

    return () => {
      isMounted = false;
    };
  }, [familyMemberId, router, form]);

  /* ------------------------------------------------------------------------ */
  /* FILE HANDLING                                                            */
  /* ------------------------------------------------------------------------ */

  const handleCardChange = (file: File | null, side: "front" | "back") => {
    if (!file) return;

    const validationError = validateFile(file, false);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    const preview = URL.createObjectURL(file);

    if (side === "front") {
      if (frontCard.preview) URL.revokeObjectURL(frontCard.preview);
      setFrontCard({ file, preview });
    } else {
      if (backCard.preview) URL.revokeObjectURL(backCard.preview);
      setBackCard({ file, preview });
    }
  };

  const handleDocChange = (file: File | null) => {
    if (!file) return;

    const validationError = validateFile(file, true);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    const preview = file.type.startsWith("image/")
      ? URL.createObjectURL(file)
      : "";

    if (policyDoc.preview) URL.revokeObjectURL(policyDoc.preview);
    setPolicyDoc({ file, preview, name: file.name });
  };

  const removeFile = (type: "front" | "back" | "doc") => {
    if (type === "front") {
      if (frontCard.preview) URL.revokeObjectURL(frontCard.preview);
      setFrontCard({ file: null, preview: "" });
    } else if (type === "back") {
      if (backCard.preview) URL.revokeObjectURL(backCard.preview);
      setBackCard({ file: null, preview: "" });
    } else {
      if (policyDoc.preview) URL.revokeObjectURL(policyDoc.preview);
      setPolicyDoc({ file: null, preview: "", name: "" });
    }
  };

  useEffect(() => {
    return () => {
      if (frontCard.preview) URL.revokeObjectURL(frontCard.preview);
      if (backCard.preview) URL.revokeObjectURL(backCard.preview);
      if (policyDoc.preview) URL.revokeObjectURL(policyDoc.preview);
    };
  }, [frontCard.preview, backCard.preview, policyDoc.preview]);

  /* ------------------------------------------------------------------------ */
  /* SUBMIT                                                                    */
  /* ------------------------------------------------------------------------ */

  const onSubmit = async (values: InsuranceFormValues) => {
    if (!familyMemberId) {
      toast.error("Family member ID is missing.");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = new FormData();

      const providerName =
        values.insuranceProvider === "Other"
          ? values.customProvider?.trim()
          : values.insuranceProvider;

      const tpaName =
        values.tpa === "Other" ? values.customTpa?.trim() : values.tpa;

      data.append("insuranceType", values.insuranceType);
      data.append("insuranceProvider", providerName || "");
      data.append("insuranceId", values.insuranceId.trim());
      data.append("policyNumber", values.policyNumber.trim());
      data.append("coverageType", values.coverageType);
      data.append("effectiveDate", values.effectiveDate);
      data.append("relationship", values.relationship);
      data.append("familyMemberId", familyMemberId);
      data.append("isPrimary", String(values.isPrimary));

      // Indian HMS Fields
      if (tpaName?.trim()) data.append("tpa", tpaName.trim());
      if (values.planName?.trim()) data.append("planName", values.planName.trim());
      if (values.policyType) data.append("policyType", values.policyType);
      if (values.policyHolderName?.trim()) {
        data.append("policyHolderName", values.policyHolderName.trim());
        data.append("subscriberName", values.policyHolderName.trim());
      }
      if (values.expiryDate) data.append("expiryDate", values.expiryDate);
      if (values.sumInsured?.trim()) data.append("sumInsured", values.sumInsured.trim());
      if (values.remainingSumInsured?.trim()) {
        data.append("remainingSumInsured", values.remainingSumInsured.trim());
      }
      if (values.roomRentLimit?.trim()) {
        data.append("roomRentLimit", values.roomRentLimit.trim());
      }
      if (values.copay?.trim()) {
        data.append("copay", values.copay.trim());
        data.append("subscriberCopay", values.copay.trim());
      }
      if (values.deductible?.trim()) {
        data.append("deductible", values.deductible.trim());
      }
      if (values.coverageRestrictions?.trim()) {
        data.append("coverageRestrictions", values.coverageRestrictions.trim());
      }

      // Group fields
      if (values.employerName?.trim()) {
        data.append("employerName", values.employerName.trim());
      }
      if (values.employeeId?.trim()) {
        data.append("employeeId", values.employeeId.trim());
      }
      if (values.groupNumber?.trim()) {
        data.append("groupNumber", values.groupNumber.trim());
      }

      // Government scheme fields
      if (values.schemeName?.trim() || isGovtScheme) {
        data.append("schemeName", values.schemeName?.trim() || values.insuranceType);
      }
      if (values.beneficiaryId?.trim()) {
        data.append("beneficiaryId", values.beneficiaryId.trim());
      }

      // Files
      if (frontCard.file) data.append("frontCardImage", frontCard.file);
      if (backCard.file) data.append("backCardImage", backCard.file);
      if (policyDoc.file) data.append("policyDocument", policyDoc.file);

      const response = await api.post(PATIENT_INSURANCE_API.CREATE, data);

      toast.success(
        response.data?.message || "Insurance information registered successfully."
      );

      router.push(`/patient/family-member/${familyMemberId}`);
    } catch (error: any) {
      console.error("Insurance creation failed:", error);
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.errors?.[0]?.message ||
        "Failed to add insurance information.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingMember) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[300px]">
          <p className="text-gray-500">Loading family member...</p>
        </div>
      </div>
    );
  }

  const memberName = getFullName(member) || "Family Member";

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

      {/* Verification Notice */}
      <Alert className="mb-6 bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-500" />
        <AlertTitle className="text-blue-700">
          Indian HMS Cashless & Reimbursement Workflow
        </AlertTitle>
        <AlertDescription className="text-blue-600">
          Registered insurance details are submitted with a <strong>Pending</strong> verification status. Our hospital TPA / billing desk will verify policy limits and pre-authorization before admission or cashless discharge.
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
                Enter {memberName}&apos;s policy, insurer, and coverage details
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
              {/* ------------------------------------------------------------ */}
              {/* SECTION 1: PROVIDER & POLICY DETAILS                          */}
              {/* ------------------------------------------------------------ */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Insurance Type */}
                <FormField
                  control={form.control}
                  name="insuranceType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Insurance Type / Category*</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={(val) => {
                          field.onChange(val);
                          if (val === "Employer-Sponsored / Group") {
                            form.setValue("policyType", "Group/Employer");
                          } else if (
                            val.includes("PM-JAY") ||
                            val === "CGHS" ||
                            val === "ESIC" ||
                            val.includes("Government")
                          ) {
                            form.setValue("policyType", "Government Scheme");
                            form.setValue("schemeName", val);
                          }
                        }}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select insurance type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {insuranceTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Policy Type */}
                <FormField
                  control={form.control}
                  name="policyType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Policy Type*</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select policy type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {policyTypes.map((pt) => (
                            <SelectItem key={pt.value} value={pt.value}>
                              {pt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Insurance Provider */}
                <FormField
                  control={form.control}
                  name="insuranceProvider"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Insurance Company / Insurer*</FormLabel>
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
                          {insuranceProviders.map((provider) => (
                            <SelectItem key={provider} value={provider}>
                              {provider}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Custom Provider if Other */}
                {insuranceProvider === "Other" && (
                  <FormField
                    control={form.control}
                    name="customProvider"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Insurer Name*</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter insurer name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Third-Party Administrator (TPA) */}
                <FormField
                  control={form.control}
                  name="tpa"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Third-Party Administrator (TPA)</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select TPA (if applicable)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {tpaProviders.map((tpa) => (
                            <SelectItem key={tpa} value={tpa}>
                              {tpa}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Applicable for cashless claims processing.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Custom TPA */}
                {selectedTpa === "Other" && (
                  <FormField
                    control={form.control}
                    name="customTpa"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>TPA Name*</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter TPA name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Plan / Product Name */}
                <FormField
                  control={form.control}
                  name="planName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plan / Product Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Optima Secure, Star Comprehensive"
                          {...field}
                        />
                      </FormControl>
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
                      <FormLabel>Policy Number*</FormLabel>
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

                {/* Member ID / Health Card Number */}
                <FormField
                  control={form.control}
                  name="insuranceId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Member ID / Health Card Number*</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter member / card ID"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Member or UHID shown on your insurance card.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Policyholder Name */}
                <FormField
                  control={form.control}
                  name="policyHolderName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Policyholder / Proposer Name*</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Name of primary insured"
                          {...field}
                        />
                      </FormControl>
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
                      <FormLabel>Relationship to Policyholder*</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={(val) => {
                          field.onChange(val);
                          if (val === "Self" && member) {
                            form.setValue("policyHolderName", memberName);
                          }
                        }}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select relationship" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {relationshipOptions.map((rel) => (
                            <SelectItem key={rel.value} value={rel.value}>
                              {rel.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* ------------------------------------------------------------ */}
              {/* SECTION 2: CONDITIONAL EMPLOYER / GOVT DETAILS                */}
              {/* ------------------------------------------------------------ */}
              {isGroupInsurance && (
                <div className="border-t pt-6 bg-amber-50/50 p-4 rounded-lg border border-amber-200">
                  <h3 className="text-md font-semibold text-amber-900 mb-3">
                    Corporate / Employer-Sponsored Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="employerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Employer / Company Name*</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. Infosys, TCS, Wipro"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="employeeId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Employee ID</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. EMP-12345"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="groupNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Corporate Policy / Group No.</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. GRP-998877"
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

              {isGovtScheme && (
                <div className="border-t pt-6 bg-emerald-50/50 p-4 rounded-lg border border-emerald-200">
                  <h3 className="text-md font-semibold text-emerald-900 mb-3">
                    Government Health Scheme Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="schemeName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Scheme Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. Ayushman Bharat PM-JAY / MJPJAY"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="beneficiaryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Beneficiary / ABHA / Ration Card ID</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. PMJAY-XXXX-XXXX or ABHA ID"
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

              {/* ------------------------------------------------------------ */}
              {/* SECTION 3: POLICY COVERAGE & VALIDITY                         */}
              {/* ------------------------------------------------------------ */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-customTeal mb-4">
                  Coverage & Validity
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Effective Date (Start) */}
                  <FormField
                    control={form.control}
                    name="effectiveDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Policy Start Date*</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormDescription>Cannot be a future date.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Expiry Date */}
                  <FormField
                    control={form.control}
                    name="expiryDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Policy Expiry Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormDescription>Valid till date on policy schedule.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Sum Insured in INR */}
                  <FormField
                    control={form.control}
                    name="sumInsured"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sum Insured (₹ INR)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g. 500000"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>Total medical cover per policy year.</FormDescription>
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
                        <FormLabel>Coverage Type*</FormLabel>
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
                            {coverageTypes.map((cov) => (
                              <SelectItem key={cov} value={cov}>
                                {cov}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Room Rent Limit */}
                  <FormField
                    control={form.control}
                    name="roomRentLimit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Room Rent Limit / Capping</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select room rent limit" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {roomRentLimits.map((limit) => (
                              <SelectItem key={limit} value={limit}>
                                {limit}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Affects proportionate room deduction during billing.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Co-Pay */}
                  <FormField
                    control={form.control}
                    name="copay"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Co-Payment (% or amount)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. 10% or None"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Deductible */}
                  <FormField
                    control={form.control}
                    name="deductible"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deductible (₹ INR)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. 25000"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Coverage Restrictions / Remarks */}
                  <FormField
                    control={form.control}
                    name="coverageRestrictions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Restrictions / Waiting Period Remarks</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. 2 yrs pre-existing disease waiting period"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* ------------------------------------------------------------ */}
              {/* SECTION 4: INSURANCE DOCUMENTS                                */}
              {/* ------------------------------------------------------------ */}
              <div className="border-t pt-6">
                <div className="mb-5">
                  <h2 className="text-lg font-semibold text-customTeal">
                    Insurance Documents
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Upload health card and policy schedule for faster cashless verification. Maximum 5 MB per file.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Front Card */}
                  <div className="space-y-3">
                    <label htmlFor="frontCardImage" className="text-sm font-medium">
                      Front of Card
                    </label>

                    {frontCard.preview ? (
                      <div className="relative overflow-hidden rounded-lg border bg-gray-50">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={frontCard.preview}
                          alt="Front card preview"
                          className="h-44 w-full object-contain"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute right-2 top-2"
                          onClick={() => removeFile("front")}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <label
                        htmlFor="frontCardImage"
                        className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 text-center hover:bg-gray-100"
                      >
                        <Upload className="h-7 w-7 text-gray-400 mb-2" />
                        <span className="text-sm font-medium">Upload front of card</span>
                        <span className="text-xs text-gray-500 mt-1">JPG, PNG, GIF up to 5 MB</span>
                      </label>
                    )}

                    <input
                      id="frontCardImage"
                      type="file"
                      accept="image/jpeg,image/png,image/gif"
                      className="hidden"
                      onChange={(e) => {
                        handleCardChange(e.target.files?.[0] || null, "front");
                        e.currentTarget.value = "";
                      }}
                    />
                  </div>

                  {/* Back Card */}
                  <div className="space-y-3">
                    <label htmlFor="backCardImage" className="text-sm font-medium">
                      Back of Card
                    </label>

                    {backCard.preview ? (
                      <div className="relative overflow-hidden rounded-lg border bg-gray-50">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={backCard.preview}
                          alt="Back card preview"
                          className="h-44 w-full object-contain"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute right-2 top-2"
                          onClick={() => removeFile("back")}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <label
                        htmlFor="backCardImage"
                        className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 text-center hover:bg-gray-100"
                      >
                        <FileText className="h-7 w-7 text-gray-400 mb-2" />
                        <span className="text-sm font-medium">Upload back of card</span>
                        <span className="text-xs text-gray-500 mt-1">JPG, PNG, GIF up to 5 MB</span>
                      </label>
                    )}

                    <input
                      id="backCardImage"
                      type="file"
                      accept="image/jpeg,image/png,image/gif"
                      className="hidden"
                      onChange={(e) => {
                        handleCardChange(e.target.files?.[0] || null, "back");
                        e.currentTarget.value = "";
                      }}
                    />
                  </div>

                  {/* Policy Document / Schedule */}
                  <div className="space-y-3">
                    <label htmlFor="policyDocument" className="text-sm font-medium">
                      Policy Document / Schedule
                    </label>

                    {policyDoc.file ? (
                      <div className="relative overflow-hidden rounded-lg border bg-gray-50 p-3 min-h-36 flex flex-col justify-center items-center">
                        <FileCheck className="h-10 w-10 text-emerald-600 mb-2" />
                        <p className="text-xs font-semibold text-center truncate max-w-full px-2">
                          {policyDoc.name}
                        </p>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute right-2 top-2"
                          onClick={() => removeFile("doc")}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <label
                        htmlFor="policyDocument"
                        className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 text-center hover:bg-gray-100"
                      >
                        <FileText className="h-7 w-7 text-gray-400 mb-2" />
                        <span className="text-sm font-medium">Upload Policy Schedule</span>
                        <span className="text-xs text-gray-500 mt-1">PDF, JPG, PNG up to 5 MB</span>
                      </label>
                    )}

                    <input
                      id="policyDocument"
                      type="file"
                      accept="image/jpeg,image/png,image/gif,application/pdf"
                      className="hidden"
                      onChange={(e) => {
                        handleDocChange(e.target.files?.[0] || null);
                        e.currentTarget.value = "";
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* ------------------------------------------------------------ */}
              {/* SECTION 5: PRIMARY INSURANCE                                  */}
              {/* ------------------------------------------------------------ */}
              <FormField
                control={form.control}
                name="isPrimary"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-gray-50/50">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-customTeal focus:ring-customTeal"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Make this the primary insurance</FormLabel>
                      <FormDescription>
                        If selected, any existing primary insurance for {memberName} will automatically be set as secondary.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              {/* Verification status indicator */}
              <div className="flex items-center gap-2 p-3 bg-slate-50 border rounded-md text-xs text-slate-600">
                <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                  Initial Status: Pending
                </Badge>
                <span>Newly added policies will be verified by the hospital billing department prior to cashless approval.</span>
              </div>

              {/* ------------------------------------------------------------ */}
              {/* ACTIONS                                                      */}
              {/* ------------------------------------------------------------ */}
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
                  disabled={isSubmitting || loadingMember}
                >
                  {isSubmitting ? (
                    "Saving Insurance..."
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