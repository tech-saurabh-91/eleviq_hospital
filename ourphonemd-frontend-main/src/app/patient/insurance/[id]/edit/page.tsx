"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import api from "@/helper/axios";
import { PATIENT_INSURANCE_API } from "@/helper/api";

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

const insuranceTypes = [
  { value: "Private Health Insurance", label: "Private Health Insurance" },
  { value: "Employer-Sponsored / Group", label: "Employer-Sponsored / Group Insurance" },
  { value: "Ayushman Bharat PM-JAY", label: "Ayushman Bharat PM-JAY" },
  { value: "CGHS", label: "CGHS (Central Government Health Scheme)" },
  { value: "ESIC", label: "ESIC (Employees' State Insurance)" },
  { value: "Government Health Scheme", label: "Other State / Government Scheme" },
  { value: "Commercial", label: "Commercial Insurance" },
  { value: "Other", label: "Other" },
];

const policyTypes = [
  { value: "Individual", label: "Individual" },
  { value: "Family Floater", label: "Family Floater" },
  { value: "Group/Employer", label: "Group / Employer" },
  { value: "Government Scheme", label: "Government Scheme" },
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

const relationshipOptions = ["Self", "Spouse", "Child", "Parent", "Other"];

interface InsuranceData {
  _id?: string;
  insuranceType: string;
  insuranceProvider: string;
  customProvider?: string;
  tpa?: string;
  customTpa?: string;
  planName?: string;
  policyType?: string;
  policyNumber: string;
  insuranceId: string;
  policyHolderName?: string;
  subscriberName?: string;
  coverageType: string;
  effectiveDate: string;
  expiryDate?: string;
  sumInsured?: number | string;
  remainingSumInsured?: number | string;
  roomRentLimit?: string;
  copay?: string;
  deductible?: string;
  coverageRestrictions?: string;
  relationship: string;
  isPrimary: boolean;
  employerName?: string;
  employeeId?: string;
  groupNumber?: string;
  schemeName?: string;
  beneficiaryId?: string;
  verificationStatus?: "Pending" | "Verified" | "Rejected" | "Expired";
  verificationRemarks?: string;
  frontCardImage?: { url?: string };
  backCardImage?: { url?: string };
  policyDocument?: { url?: string };
}

export default function EditInsurancePage() {
  const router = useRouter();
  const params = useParams();
  const insuranceId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<InsuranceData | null>(null);

  const [frontCardFile, setFrontCardFile] = useState<File | null>(null);
  const [backCardFile, setBackCardFile] = useState<File | null>(null);
  const [policyDocFile, setPolicyDocFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchInsurance = async () => {
      try {
        setLoading(true);
        const res = await api.get(PATIENT_INSURANCE_API.GET_SINGLE(insuranceId));
        const data = res.data?.data ?? res.data;

        // Format dates for input[type="date"]
        const formattedData: InsuranceData = {
          ...data,
          effectiveDate: data.effectiveDate ? data.effectiveDate.slice(0, 10) : "",
          expiryDate: data.expiryDate ? data.expiryDate.slice(0, 10) : "",
          policyHolderName: data.policyHolderName || data.subscriberName || "",
          policyType: data.policyType || "Individual",
          insuranceType: data.insuranceType || "Private Health Insurance",
        };

        setForm(formattedData);
      } catch (err: any) {
        console.error("Failed to fetch insurance:", err);
        toast.error(err?.response?.data?.message || "Failed to load insurance details.");
        router.push("/patient/insurance");
      } finally {
        setLoading(false);
      }
    };

    if (insuranceId) {
      fetchInsurance();
    }
  }, [insuranceId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    try {
      setIsSubmitting(true);
      const data = new FormData();

      const providerName =
        form.insuranceProvider === "Other" && form.customProvider
          ? form.customProvider.trim()
          : form.insuranceProvider;

      const tpaName =
        form.tpa === "Other" && form.customTpa
          ? form.customTpa.trim()
          : form.tpa;

      data.append("insuranceType", form.insuranceType);
      data.append("insuranceProvider", providerName);
      data.append("insuranceId", form.insuranceId);
      data.append("policyNumber", form.policyNumber);
      data.append("coverageType", form.coverageType);
      data.append("effectiveDate", form.effectiveDate);
      data.append("relationship", form.relationship);
      data.append("isPrimary", String(form.isPrimary));

      if (tpaName) data.append("tpa", tpaName);
      if (form.planName) data.append("planName", form.planName);
      if (form.policyType) data.append("policyType", form.policyType);
      if (form.policyHolderName) {
        data.append("policyHolderName", form.policyHolderName);
        data.append("subscriberName", form.policyHolderName);
      }
      if (form.expiryDate) data.append("expiryDate", form.expiryDate);
      if (form.sumInsured !== undefined && form.sumInsured !== "") {
        data.append("sumInsured", String(form.sumInsured));
      }
      if (form.roomRentLimit) data.append("roomRentLimit", form.roomRentLimit);
      if (form.copay) {
        data.append("copay", form.copay);
        data.append("subscriberCopay", form.copay);
      }
      if (form.deductible) data.append("deductible", form.deductible);
      if (form.coverageRestrictions) {
        data.append("coverageRestrictions", form.coverageRestrictions);
      }
      if (form.employerName) data.append("employerName", form.employerName);
      if (form.employeeId) data.append("employeeId", form.employeeId);
      if (form.groupNumber) data.append("groupNumber", form.groupNumber);
      if (form.schemeName) data.append("schemeName", form.schemeName);
      if (form.beneficiaryId) data.append("beneficiaryId", form.beneficiaryId);

      if (frontCardFile) data.append("frontCardImage", frontCardFile);
      if (backCardFile) data.append("backCardImage", backCardFile);
      if (policyDocFile) data.append("policyDocument", policyDocFile);

      const res = await api.patch(PATIENT_INSURANCE_API.UPDATE(insuranceId), data);

      toast.success(res.data?.message || "Insurance information updated successfully.");
      router.push("/patient/insurance");
    } catch (err: any) {
      console.error("Failed to update insurance:", err);
      toast.error(
        err?.response?.data?.message || "Failed to update insurance information."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-5 py-12 text-center text-gray-500">
        Loading insurance details...
      </div>
    );
  }

  if (!form) return null;

  const isGroupInsurance =
    form.insuranceType === "Employer-Sponsored / Group" ||
    form.policyType === "Group/Employer";

  const isGovtScheme =
    form.insuranceType.includes("PM-JAY") ||
    form.insuranceType === "CGHS" ||
    form.insuranceType === "ESIC" ||
    form.insuranceType.includes("Government");

  return (
    <div className="max-w-5xl mx-auto px-5 py-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Button
            variant="ghost"
            className="text-customTeal mb-2"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <h1 className="text-2xl font-bold text-customTeal">Edit Insurance Policy</h1>
          <p className="text-gray-500 text-sm mt-1">
            Update insurance details for policy {form.policyNumber}
          </p>
        </div>

        {/* Verification Status Badge */}
        {form.verificationStatus && (
          <div className="text-right">
            <span className="text-xs text-gray-500 block mb-1">Verification Status</span>
            <Badge
              variant="outline"
              className={
                form.verificationStatus === "Verified"
                  ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                  : form.verificationStatus === "Rejected"
                  ? "bg-red-100 text-red-800 border-red-300"
                  : "bg-amber-100 text-amber-800 border-amber-300"
              }
            >
              {form.verificationStatus}
            </Badge>
          </div>
        )}
      </div>

      <Card>
        <CardHeader className="bg-customTeal/5">
          <CardTitle className="text-customTeal">Policy Information</CardTitle>
          <CardDescription>
            Update provider, member details, coverage limits, and policy documents
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Insurance Type */}
              <div>
                <Label htmlFor="insuranceType">Insurance Type / Category*</Label>
                <Select
                  value={form.insuranceType}
                  onValueChange={(v) => setForm({ ...form, insuranceType: v })}
                >
                  <SelectTrigger id="insuranceType">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {insuranceTypes.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Policy Type */}
              <div>
                <Label htmlFor="policyType">Policy Type*</Label>
                <Select
                  value={form.policyType || "Individual"}
                  onValueChange={(v) => setForm({ ...form, policyType: v })}
                >
                  <SelectTrigger id="policyType">
                    <SelectValue placeholder="Select policy type" />
                  </SelectTrigger>
                  <SelectContent>
                    {policyTypes.map((pt) => (
                      <SelectItem key={pt.value} value={pt.value}>
                        {pt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Provider */}
              <div>
                <Label htmlFor="provider">Insurance Company / Insurer*</Label>
                <Select
                  value={form.insuranceProvider}
                  onValueChange={(v) => setForm({ ...form, insuranceProvider: v })}
                >
                  <SelectTrigger id="provider">
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {insuranceProviders.map((prov) => (
                      <SelectItem key={prov} value={prov}>
                        {prov}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Custom Provider if Other */}
              {form.insuranceProvider === "Other" && (
                <div>
                  <Label htmlFor="customProvider">Insurer Name*</Label>
                  <Input
                    id="customProvider"
                    value={form.customProvider || ""}
                    onChange={(e) => setForm({ ...form, customProvider: e.target.value })}
                    placeholder="Enter insurer name"
                  />
                </div>
              )}

              {/* TPA */}
              <div>
                <Label htmlFor="tpa">Third-Party Administrator (TPA)</Label>
                <Select
                  value={form.tpa || ""}
                  onValueChange={(v) => setForm({ ...form, tpa: v })}
                >
                  <SelectTrigger id="tpa">
                    <SelectValue placeholder="Select TPA (if applicable)" />
                  </SelectTrigger>
                  <SelectContent>
                    {tpaProviders.map((tpa) => (
                      <SelectItem key={tpa} value={tpa}>
                        {tpa}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Plan Name */}
              <div>
                <Label htmlFor="planName">Plan / Product Name</Label>
                <Input
                  id="planName"
                  value={form.planName || ""}
                  onChange={(e) => setForm({ ...form, planName: e.target.value })}
                  placeholder="e.g. Optima Secure, Star Comprehensive"
                />
              </div>

              {/* Policy Number */}
              <div>
                <Label htmlFor="policyNumber">Policy Number*</Label>
                <Input
                  id="policyNumber"
                  value={form.policyNumber}
                  onChange={(e) => setForm({ ...form, policyNumber: e.target.value })}
                  required
                />
              </div>

              {/* Member ID */}
              <div>
                <Label htmlFor="insuranceId">Member ID / Health Card Number*</Label>
                <Input
                  id="insuranceId"
                  value={form.insuranceId}
                  onChange={(e) => setForm({ ...form, insuranceId: e.target.value })}
                  required
                />
              </div>

              {/* Policyholder Name */}
              <div>
                <Label htmlFor="policyHolderName">Policyholder Name*</Label>
                <Input
                  id="policyHolderName"
                  value={form.policyHolderName || ""}
                  onChange={(e) => setForm({ ...form, policyHolderName: e.target.value })}
                  required
                />
              </div>

              {/* Relationship */}
              <div>
                <Label htmlFor="relationship">Relationship*</Label>
                <Select
                  value={form.relationship}
                  onValueChange={(v) => setForm({ ...form, relationship: v })}
                >
                  <SelectTrigger id="relationship">
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    {relationshipOptions.map((rel) => (
                      <SelectItem key={rel} value={rel}>
                        {rel}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Conditional Group Details */}
            {isGroupInsurance && (
              <div className="border p-4 rounded-lg bg-amber-50/50 border-amber-200">
                <h3 className="font-semibold text-amber-900 mb-3 text-sm">
                  Group / Corporate Policy Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="employerName">Employer Name</Label>
                    <Input
                      id="employerName"
                      value={form.employerName || ""}
                      onChange={(e) => setForm({ ...form, employerName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="employeeId">Employee ID</Label>
                    <Input
                      id="employeeId"
                      value={form.employeeId || ""}
                      onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="groupNumber">Corporate Group Number</Label>
                    <Input
                      id="groupNumber"
                      value={form.groupNumber || ""}
                      onChange={(e) => setForm({ ...form, groupNumber: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Conditional Government Scheme Details */}
            {isGovtScheme && (
              <div className="border p-4 rounded-lg bg-emerald-50/50 border-emerald-200">
                <h3 className="font-semibold text-emerald-900 mb-3 text-sm">
                  Government Health Scheme Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="schemeName">Scheme Name</Label>
                    <Input
                      id="schemeName"
                      value={form.schemeName || ""}
                      onChange={(e) => setForm({ ...form, schemeName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="beneficiaryId">Beneficiary / ABHA / Ration Card ID</Label>
                    <Input
                      id="beneficiaryId"
                      value={form.beneficiaryId || ""}
                      onChange={(e) => setForm({ ...form, beneficiaryId: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Coverage & Validity Section */}
            <div className="border-t pt-4">
              <h3 className="font-semibold text-customTeal mb-4">Coverage & Validity</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="effectiveDate">Start Date*</Label>
                  <Input
                    id="effectiveDate"
                    type="date"
                    value={form.effectiveDate}
                    onChange={(e) => setForm({ ...form, effectiveDate: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={form.expiryDate || ""}
                    onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="sumInsured">Sum Insured (₹ INR)</Label>
                  <Input
                    id="sumInsured"
                    type="number"
                    value={form.sumInsured ?? ""}
                    onChange={(e) => setForm({ ...form, sumInsured: e.target.value })}
                    placeholder="e.g. 500000"
                  />
                </div>

                <div>
                  <Label htmlFor="coverageType">Coverage Type*</Label>
                  <Select
                    value={form.coverageType}
                    onValueChange={(v) => setForm({ ...form, coverageType: v })}
                  >
                    <SelectTrigger id="coverageType">
                      <SelectValue placeholder="Select coverage type" />
                    </SelectTrigger>
                    <SelectContent>
                      {coverageTypes.map((cov) => (
                        <SelectItem key={cov} value={cov}>
                          {cov}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="roomRentLimit">Room Rent Limit</Label>
                  <Select
                    value={form.roomRentLimit || ""}
                    onValueChange={(v) => setForm({ ...form, roomRentLimit: v })}
                  >
                    <SelectTrigger id="roomRentLimit">
                      <SelectValue placeholder="Select room rent limit" />
                    </SelectTrigger>
                    <SelectContent>
                      {roomRentLimits.map((l) => (
                        <SelectItem key={l} value={l}>
                          {l}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="copay">Co-Payment (% or amount)</Label>
                  <Input
                    id="copay"
                    value={form.copay || ""}
                    onChange={(e) => setForm({ ...form, copay: e.target.value })}
                    placeholder="e.g. 10%"
                  />
                </div>

                <div>
                  <Label htmlFor="deductible">Deductible (₹ INR)</Label>
                  <Input
                    id="deductible"
                    value={form.deductible || ""}
                    onChange={(e) => setForm({ ...form, deductible: e.target.value })}
                    placeholder="e.g. 25000"
                  />
                </div>

                <div>
                  <Label htmlFor="coverageRestrictions">Restrictions / Waiting Periods</Label>
                  <Input
                    id="coverageRestrictions"
                    value={form.coverageRestrictions || ""}
                    onChange={(e) => setForm({ ...form, coverageRestrictions: e.target.value })}
                    placeholder="e.g. 2 years PED waiting period"
                  />
                </div>
              </div>
            </div>

            {/* Document Updates */}
            <div className="border-t pt-4">
              <h3 className="font-semibold text-customTeal mb-2">Policy Documents</h3>
              <p className="text-xs text-gray-500 mb-4">
                Upload new cards or policy schedule to replace existing files. (JPG, PNG, GIF, PDF up to 5 MB)
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-xs font-medium">Front of Card</Label>
                  {form.frontCardImage?.url && !frontCardFile && (
                    <p className="text-xs text-emerald-600 mb-1">✓ Current card uploaded</p>
                  )}
                  <Input
                    type="file"
                    accept="image/jpeg,image/png,image/gif"
                    onChange={(e) => setFrontCardFile(e.target.files?.[0] || null)}
                  />
                </div>

                <div>
                  <Label className="text-xs font-medium">Back of Card</Label>
                  {form.backCardImage?.url && !backCardFile && (
                    <p className="text-xs text-emerald-600 mb-1">✓ Current card uploaded</p>
                  )}
                  <Input
                    type="file"
                    accept="image/jpeg,image/png,image/gif"
                    onChange={(e) => setBackCardFile(e.target.files?.[0] || null)}
                  />
                </div>

                <div>
                  <Label className="text-xs font-medium">Policy Document / Schedule</Label>
                  {form.policyDocument?.url && !policyDocFile && (
                    <p className="text-xs text-emerald-600 mb-1">✓ Current policy schedule on file</p>
                  )}
                  <Input
                    type="file"
                    accept="image/jpeg,image/png,image/gif,application/pdf"
                    onChange={(e) => setPolicyDocFile(e.target.files?.[0] || null)}
                  />
                </div>
              </div>
            </div>

            {/* Primary Policy Flag */}
            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id="primary-insurance"
                checked={form.isPrimary}
                onChange={(e) => setForm({ ...form, isPrimary: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-customTeal focus:ring-customTeal"
              />
              <Label htmlFor="primary-insurance" className="cursor-pointer text-sm">
                Make this the primary insurance policy
              </Label>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
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
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "Saving Changes..."
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" /> Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}