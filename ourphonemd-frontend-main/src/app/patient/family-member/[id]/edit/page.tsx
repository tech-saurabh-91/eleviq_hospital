"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import { PATIENT_FAMILY_API } from "@/helper/api";
import api from "@/helper/axios";

const relationshipOptions = [
  "father",
  "mother",
  "son",
  "daughter",
  "husband",
  "wife",
  "brother",
  "sister",
  "grandfather",
  "grandmother",
  "grandson",
  "granddaughter",
  "guardian",
  "other",
];

const formatRelationship = (value: string) => {
  return value
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const convertBackendDateToInput = (date: string) => {
  if (!date) return "";

  const parts = date.split("/");

  if (parts.length === 3) {
    const [month, day, year] = parts;

    return `${year}-${month.padStart(2, "0")}-${day.padStart(
      2,
      "0"
    )}`;
  }

  return date;
};

const convertInputDateToBackend = (date: string) => {
  if (!date) return "";

  const [year, month, day] = date.split("-");

  return `${month}/${day}/${year}`;
};

export default function EditFamilyMemberPage() {
  const router = useRouter();
  const params = useParams();

  const familyMemberId = params?.id as string;

  const [member, setMember] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    relationship: "",
    dateOfBirth: "",
    gender: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    insuranceCoverage: "patient",
  });

  useEffect(() => {
    if (!familyMemberId) return;

    const fetchFamilyMember = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          PATIENT_FAMILY_API.GET_SINGLE(familyMemberId)
        );

        const data = response.data?.data ?? response.data;

        setMember(data);

        setFormData({
          firstName: data.firstName || "",
          middleName: data.middleName || "",
          lastName: data.lastName || "",
          relationship: data.relationship || "",
          dateOfBirth: convertBackendDateToInput(
            data.dateOfBirth || ""
          ),
          gender: data.gender || "",
          email: data.email || "",
          phone: data.phone || "",
          street: data.address?.street || "",
          city: data.address?.city || "",
          state: data.address?.state || "",
          zipCode: data.address?.zipCode || "",
          insuranceCoverage:
            data.insuranceCoverage || "patient",
        });
      } catch (error: any) {
        console.error(
          "Error fetching family member:",
          error
        );

        setError(
          error?.response?.data?.message ||
          "Failed to fetch family member"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFamilyMember();
  }, [familyMemberId]);

  const handleChange = (
    field: string,
    value: string
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const validateForm = () => {
    const firstName = formData.firstName.trim();
    const middleName = formData.middleName.trim();
    const lastName = formData.lastName.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();
    const street = formData.street.trim();
    const city = formData.city.trim();
    const state = formData.state.trim();
    const zipCode = formData.zipCode.trim();

    if (!firstName) {
      return "First name is required.";
    }

    if (firstName.length > 50) {
      return "First name must be 50 characters or less.";
    }

    if (!/^[A-Za-zÀ-ÿ\s'-]+$/.test(firstName)) {
      return "First name contains invalid characters.";
    }

    if (middleName.length > 50) {
      return "Middle name must be 50 characters or less.";
    }

    if (
      middleName &&
      !/^[A-Za-zÀ-ÿ\s'-]+$/.test(middleName)
    ) {
      return "Middle name contains invalid characters.";
    }

    if (!lastName) {
      return "Last name is required.";
    }

    if (lastName.length > 50) {
      return "Last name must be 50 characters or less.";
    }

    if (!/^[A-Za-zÀ-ÿ\s'-]+$/.test(lastName)) {
      return "Last name contains invalid characters.";
    }

    if (!formData.relationship) {
      return "Relationship is required.";
    }

    if (!formData.dateOfBirth) {
      return "Date of birth is required.";
    }

    const selectedDate = new Date(formData.dateOfBirth);
    const today = new Date();

    if (selectedDate > today) {
      return "Date of birth cannot be in the future.";
    }

    if (!formData.gender) {
      return "Gender is required.";
    }

    if (!email) {
      return "Email is required.";
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return "Please enter a valid email address.";
    }

    if (!phone) {
      return "Phone number is required.";
    }

    if (!/^\+?[0-9]{10,15}$/.test(phone)) {
      return "Phone number must contain 10 to 15 digits.";
    }

    if (!street) {
      return "Street address is required.";
    }

    if (street.length > 200) {
      return "Street address must be 200 characters or less.";
    }

    if (!city) {
      return "City is required.";
    }

    if (city.length > 100) {
      return "City must be 100 characters or less.";
    }

    if (!state) {
      return "State is required.";
    }

    if (state.length > 100) {
      return "State must be 100 characters or less.";
    }

    if (!zipCode) {
      return "PIN code is required.";
    }

    if (!/^[0-9]{6}$/.test(zipCode)) {
      return "PIN code must contain 6 digits.";
    }

    return "";
  };

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      toast.error(validationError);
      return;
    }

    setSaving(true);

    try {
      const payload = {
        firstName: formData.firstName.trim(),
        middleName: formData.middleName.trim(),
        lastName: formData.lastName.trim(),
        relationship: formData.relationship,
        dateOfBirth: convertInputDateToBackend(
          formData.dateOfBirth
        ),
        gender: formData.gender,
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: {
          street: formData.street.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          zipCode: formData.zipCode.trim(),
        },
        insuranceCoverage:
          formData.insuranceCoverage,
      };

      await api.patch(
        PATIENT_FAMILY_API.UPDATE(familyMemberId),
        payload
      );

      toast.success(
        "Family member updated successfully."
      );

      router.push(
        `/patient/family-member/${familyMemberId}`
      );
    } catch (error: any) {
      console.error(
        "Failed to update family member:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
        "Failed to update family member."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-10 px-4">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-customTeal mr-2" />
          <p className="text-gray-500">
            Loading family member...
          </p>
        </div>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="max-w-5xl mx-auto py-10 px-4">
        <Button
          variant="ghost"
          className="text-customTeal mb-4"
          onClick={() =>
            router.push("/patient/family-member")
          }
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-red-500">
              {error || "Family member not found"}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          className="text-customTeal mb-4"
          onClick={() =>
            router.push(
              `/patient/family-member/${familyMemberId}`
            )
          }
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Profile
        </Button>

        <h1 className="text-2xl font-bold text-customTeal">
          Edit Family Member
        </h1>

        <p className="text-gray-500 mt-1">
          Update {member.firstName} {member.lastName}&apos;s
          information
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-customTeal">
            Personal Information
          </CardTitle>

          <CardDescription>
            Update the family member&apos;s personal and
            contact information.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="space-y-8"
          >
            {/* Name */}
            <div>
              <h3 className="text-lg font-medium text-customTeal mb-4">
                Basic Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label>First Name *</Label>
                  <Input
                    className="mt-2"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleChange(
                        "firstName",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div>
                  <Label>Middle Name</Label>
                  <Input
                    className="mt-2"
                    value={formData.middleName}
                    onChange={(e) =>
                      handleChange(
                        "middleName",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div>
                  <Label>Last Name *</Label>
                  <Input
                    className="mt-2"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleChange(
                        "lastName",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
            </div>

            {/* Relationship / DOB / Gender */}
            <div>
              <h3 className="text-lg font-medium text-customTeal mb-4">
                Personal Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label>Relationship *</Label>

                  <Select
                    value={formData.relationship}
                    onValueChange={(value) =>
                      handleChange(
                        "relationship",
                        value
                      )
                    }
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>

                    <SelectContent>
                      {relationshipOptions.map(
                        (relationship) => (
                          <SelectItem
                            key={relationship}
                            value={relationship}
                          >
                            {formatRelationship(
                              relationship
                            )}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Date of Birth *</Label>

                  <Input
                    className="mt-2"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) =>
                      handleChange(
                        "dateOfBirth",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div>
                  <Label>Gender *</Label>

                  <Select
                    value={formData.gender}
                    onValueChange={(value) =>
                      handleChange("gender", value)
                    }
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="male">
                        Male
                      </SelectItem>

                      <SelectItem value="female">
                        Female
                      </SelectItem>

                      <SelectItem value="other">
                        Other
                      </SelectItem>

                      <SelectItem value="prefer-not-to-say">
                        Prefer not to say
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-medium text-customTeal mb-4">
                Contact Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Email *</Label>

                  <Input
                    className="mt-2"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      handleChange(
                        "email",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div>
                  <Label>Phone *</Label>

                  <Input
                    className="mt-2"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      handleChange(
                        "phone",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <h3 className="text-lg font-medium text-customTeal mb-4">
                Address
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Label>Street *</Label>

                  <Input
                    className="mt-2"
                    value={formData.street}
                    onChange={(e) =>
                      handleChange(
                        "street",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div>
                  <Label>City *</Label>

                  <Input
                    className="mt-2"
                    value={formData.city}
                    onChange={(e) =>
                      handleChange(
                        "city",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div>
                  <Label>State *</Label>

                  <Input
                    className="mt-2"
                    value={formData.state}
                    onChange={(e) =>
                      handleChange(
                        "state",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div>
                  <Label>PIN Code *</Label>

                  <Input
                    className="mt-2"
                    value={formData.zipCode}
                    onChange={(e) =>
                      handleChange(
                        "zipCode",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
            </div>

            {/* Insurance */}
            <div>
              <h3 className="text-lg font-medium text-customTeal mb-4">
                Insurance Coverage
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() =>
                    handleChange(
                      "insuranceCoverage",
                      "patient"
                    )
                  }
                  className={`border rounded-lg p-4 text-left transition ${formData.insuranceCoverage ===
                    "patient"
                    ? "border-customTeal bg-customTeal/5"
                    : "border-gray-200"
                    }`}
                >
                  <p className="font-medium">
                    Primary Patient Insurance
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    Uses the primary patient&apos;s
                    insurance.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleChange(
                      "insuranceCoverage",
                      "own"
                    )
                  }
                  className={`border rounded-lg p-4 text-left transition ${formData.insuranceCoverage === "own"
                    ? "border-customTeal bg-customTeal/5"
                    : "border-gray-200"
                    }`}
                >
                  <p className="font-medium">
                    Own Insurance
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    Family member has their own
                    insurance.
                  </p>
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  router.push(
                    `/patient/family-member/${familyMemberId}`
                  )
                }
                disabled={saving}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                className="bg-customTeal hover:bg-customTeal/90 text-white"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
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