"use client";

import React, { useState } from "react";
import { ArrowLeft, Save, UserPlus, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFamilyMember } from "@/hooks/useFamilyMember";
import {
  formatFamilyDateInput,
  isValidPastFamilyDate,
} from "@/lib/family-member";

const relationshipOptions = [
  { value: "father", label: "Father" },
  { value: "mother", label: "Mother" },
  { value: "son", label: "Son" },
  { value: "daughter", label: "Daughter" },
  { value: "husband", label: "Husband" },
  { value: "wife", label: "Wife" },
  { value: "brother", label: "Brother" },
  { value: "sister", label: "Sister" },
  { value: "grandfather", label: "Grandfather" },
  { value: "grandmother", label: "Grandmother" },
  { value: "grandson", label: "Grandson" },
  { value: "granddaughter", label: "Granddaughter" },
  { value: "guardian", label: "Guardian" },
  { value: "other", label: "Other" },
];

const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

const initialForm = {
  firstName: "",
  middleName: "",
  lastName: "",
  relationship: "",
  dateOfBirth: "",
  gender: "",
  insuranceCoverage: "patient",
};

export default function AddFamilyMemberPage() {
  const router = useRouter();

  const { createFamilyMember, loading } = useFamilyMember();

  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");

  const [createdFamilyMemberId, setCreatedFamilyMemberId] =
    useState<string | null>(null);

  const [showInsurancePrompt, setShowInsurancePrompt] =
    useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "dateOfBirth" ? formatFamilyDateInput(value) : value,
    }));
  };

  const validateForm = () => {
    const firstName = form.firstName.trim();
    const middleName = form.middleName.trim();
    const lastName = form.lastName.trim();

    if (!firstName) {
      return "First name is required";
    }

    if (firstName.length > 50) {
      return "First name must be 50 characters or less";
    }

    if (!/^[A-Za-zÀ-ÿ\u0900-\u097F\s.'-]+$/.test(firstName)) {
      return "First name contains invalid characters";
    }

    if (middleName.length > 50) {
      return "Middle name must be 50 characters or less";
    }

    if (
      middleName &&
      !/^[A-Za-zÀ-ÿ\u0900-\u097F\s.'-]*$/.test(middleName)
    ) {
      return "Middle name contains invalid characters";
    }

    if (!lastName) {
      return "Last name is required";
    }

    if (lastName.length > 50) {
      return "Last name must be 50 characters or less";
    }

    if (!/^[A-Za-zÀ-ÿ\u0900-\u097F\s.'-]+$/.test(lastName)) {
      return "Last name contains invalid characters";
    }

    if (!form.relationship) {
      return "Relationship is required";
    }

    if (!form.dateOfBirth) {
      return "Date of birth is required";
    }

    if (!isValidPastFamilyDate(form.dateOfBirth)) {
      return "Enter a valid past date in DD/MM/YYYY format";
    }

    if (!form.gender) {
      return "Gender is required";
    }

    return "";
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const payload = {
        firstName: form.firstName.trim(),

        ...(form.middleName.trim()
          ? {
            middleName: form.middleName.trim(),
          }
          : {}),

        lastName: form.lastName.trim(),

        relationship: form.relationship,

        dateOfBirth: form.dateOfBirth,

        gender: form.gender,

        insuranceCoverage:
          form.insuranceCoverage,
      };

      const createdMember = await createFamilyMember(payload);

      const familyMemberId =
        createdMember?.familyMemberId ??
        createdMember?._id ??
        createdMember?.id;

      if (
        form.insuranceCoverage === "own" &&
        familyMemberId
      ) {
        setCreatedFamilyMemberId(familyMemberId);
        setShowInsurancePrompt(true);
        return;
      }

      router.push("/patient/family-member");
    } catch (error: any) {
      console.error(
        "Error creating family member:",
        error
      );

      const backendMessage =
        error?.response?.data?.message;

      setError(
        backendMessage ||
        "Failed to create family member. Please try again."
      );
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Back */}
      <Link
        href="/patient/family-member"
        className="inline-flex items-center gap-2 text-sm text-customTeal hover:underline mb-5"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Family Members
      </Link>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-customTeal/10 p-2.5 rounded-full">
            <UserPlus className="h-5 w-5 text-customTeal" />
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-customTeal">
              Add Family Member
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Add a family member to your account to manage
              their appointments and medical records.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Inherited Contact & Address Notice */}
          <div className="mx-5 sm:mx-6 mt-6 p-4 rounded-lg bg-teal-50/70 border border-teal-200 flex items-start gap-3">
            <div className="p-1.5 rounded-full bg-customTeal/10 text-customTeal mt-0.5 shrink-0">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div className="text-sm">
              <p className="font-semibold text-gray-900">
                Contact & Address Details Automatically Inherited
              </p>
              <p className="text-gray-600 mt-0.5 text-xs">
                Email address, phone number, and residential address will be automatically linked from your registered patient profile. You can customize them individually anytime after adding this family member.
              </p>
            </div>
          </div>

          {/* Personal Information */}
          <section className="p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-customTeal mb-1">
              Personal Information
            </h2>

            <p className="text-sm text-gray-500 mb-6">
              Enter the family member&apos;s personal details.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  First Name *
                </label>

                <Input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="Enter first name"
                />
              </div>

              {/* Middle Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Middle Name
                </label>

                <Input
                  name="middleName"
                  value={form.middleName}
                  onChange={handleChange}
                  placeholder="Enter middle name"
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Last Name *
                </label>

                <Input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Enter last name"
                />
              </div>

              {/* Relationship */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Relationship *
                </label>

                <select
                  name="relationship"
                  value={form.relationship}
                  onChange={handleChange}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="">
                    Select relationship
                  </option>

                  {relationshipOptions.map(
                    (relationship) => (
                      <option
                        key={relationship.value}
                        value={relationship.value}
                      >
                        {relationship.label}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* DOB */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Date of Birth *
                </label>

                <Input
                  type="text"
                  name="dateOfBirth"
                  value={form.dateOfBirth}
                  onChange={handleChange}
                  placeholder="DD/MM/YYYY"
                  inputMode="numeric"
                  maxLength={10}
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Gender *
                </label>

                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="">
                    Select gender
                  </option>

                  {genderOptions.map((gender) => (
                    <option
                      key={gender.value}
                      value={gender.value}
                    >
                      {gender.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <div className="border-t" />

          {/* Insurance */}
          <section className="p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-customTeal mb-1">
              Insurance Coverage
            </h2>

            <p className="text-sm text-gray-500 mb-5">
              Choose how this family member will be covered.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Patient insurance */}
              <label
                className={`cursor-pointer rounded-lg border p-4 transition-colors ${form.insuranceCoverage === "patient"
                  ? "border-customTeal bg-customTeal/5"
                  : "border-gray-200 hover:border-gray-300"
                  }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="insuranceCoverage"
                    value="patient"
                    checked={
                      form.insuranceCoverage ===
                      "patient"
                    }
                    onChange={handleChange}
                    className="mt-1"
                  />

                  <div>
                    <p className="font-medium text-gray-900">
                      Use Primary Patient&apos;s Insurance
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      This family member will use the primary
                      patient&apos;s insurance coverage.
                    </p>
                  </div>
                </div>
              </label>

              {/* Own insurance */}
              <label
                className={`cursor-pointer rounded-lg border p-4 transition-colors ${form.insuranceCoverage === "own"
                  ? "border-customTeal bg-customTeal/5"
                  : "border-gray-200 hover:border-gray-300"
                  }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="insuranceCoverage"
                    value="own"
                    checked={
                      form.insuranceCoverage === "own"
                    }
                    onChange={handleChange}
                    className="mt-1"
                  />

                  <div>
                    <p className="font-medium text-gray-900">
                      Use Own Insurance
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      This family member will have their own
                      insurance coverage.
                    </p>
                  </div>
                </div>
              </label>
            </div>
          </section>

          {/* Error */}
          {error && (
            <div className="mx-5 sm:mx-6 mb-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="border-t bg-gray-50/50 p-4 sm:p-5">
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                disabled={loading}
                onClick={() =>
                  router.push(
                    "/patient/family-member"
                  )
                }
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-customTeal hover:bg-customTeal/90 text-white"
              >
                <Save className="h-4 w-4 mr-2" />

                {loading
                  ? "Saving..."
                  : "Save Family Member"}
              </Button>
            </div>
          </div>
        </div>
      </form>

      {showInsurancePrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-customTeal">
                Family Member Added Successfully
              </h2>

              <p className="mt-2 text-sm text-gray-600">
                This family member has their own insurance.
                Would you like to add their insurance details now?
              </p>

              <div className="mt-6 flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    router.push("/patient/family-member")
                  }
                >
                  Skip for now
                </Button>

                <Button
                  type="button"
                  className="bg-customTeal hover:bg-customTeal/90 text-white"
                  onClick={() => {
                    if (!createdFamilyMemberId) return;

                    router.push(
                      `/patient/insurance/${createdFamilyMemberId}/add-insurance`
                    );
                  }}
                >
                  Add Insurance
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
