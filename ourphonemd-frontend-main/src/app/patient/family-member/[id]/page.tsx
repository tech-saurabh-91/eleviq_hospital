"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  CreditCard,
  Edit,
  Calendar,
  MapPin,
  AlertCircle,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { PATIENT_FAMILY_API } from "@/helper/api";
import api from "@/helper/axios";

export default function FamilyMemberDetailsPage() {
  const params = useParams();
  const familyMemberId = params?.id as string;

  const [member, setMember] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

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
      } catch (error: any) {
        console.error("Error fetching family member:", error);

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

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${[
        member?.firstName,
        member?.middleName,
        member?.lastName,
      ]
        .filter(Boolean)
        .join(" ")}?`
    );

    if (!confirmed) return;

    try {
      setDeleting(true);

      await api.delete(
        PATIENT_FAMILY_API.DELETE(familyMemberId)
      );

      window.location.href = "/patient/family-member";
    } catch (error: any) {
      console.error("Error deleting family member:", error);

      setError(
        error?.response?.data?.message ||
        "Failed to delete family member"
      );

      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-500">Loading family member...</p>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/patient/family-member">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>

          <h1 className="text-2xl font-bold text-customTeal">
            Family Member
          </h1>
        </div>

        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />

            <p className="text-red-500">
              {error || "Family member not found"}
            </p>

            <Button
              className="mt-4 bg-customTeal hover:bg-customTeal/90"
              asChild
            >
              <Link href="/patient/family-member">
                Back to Family Members
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const fullName = [
    member.firstName,
    member.middleName,
    member.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  const insuranceCoverage = member.insuranceCoverage;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/patient/family-member">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>

          <div>
            <h1 className="text-2xl font-bold text-customTeal">
              {fullName}
            </h1>

            <Badge className="mt-1 bg-blue-100 text-blue-700 hover:bg-blue-100 capitalize">
              {member.relationship}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="text-customTeal border-customTeal"
            asChild
          >
            <Link
              href={`/patient/family-member/${member.familyMemberId}/edit`}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Link>
          </Button>

          <Button
            variant="outline"
            onClick={handleDelete}
            disabled={deleting}
            className="text-red-600 border-red-300 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="space-y-4">
          {/* Personal Information */}
          <Card>
            <CardHeader className="bg-customTeal/5 pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">
                    Personal Information
                  </CardTitle>

                  <CardDescription>
                    Basic details and contact information
                  </CardDescription>
                </div>

                <div className="bg-customTeal/20 p-3 rounded-full">
                  <User className="h-6 w-6 text-customTeal" />
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                {/* Date of Birth */}
                <div>
                  <p className="text-sm text-gray-500">
                    Date of Birth
                  </p>

                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-gray-400" />

                    <p className="font-medium">
                      {member.dateOfBirth}
                    </p>
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <p className="text-sm text-gray-500">
                    Gender
                  </p>

                  <p className="font-medium mt-1">
                    {member.gender}
                  </p>
                </div>

                {/* Phone */}
                {member.phone && (
                  <div className="col-span-2 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />

                    <div>
                      <p className="text-sm text-gray-500">
                        Phone
                      </p>

                      <p className="font-medium">
                        {member.phone}
                      </p>
                    </div>
                  </div>
                )}

                {/* Email */}
                {member.email && (
                  <div className="col-span-2 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />

                    <div>
                      <p className="text-sm text-gray-500">
                        Email
                      </p>

                      <p className="font-medium break-all">
                        {member.email}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Address */}
          {member.address && (
            <Card>
              <CardHeader className="bg-customTeal/5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-customTeal/20 p-3 rounded-full">
                    <MapPin className="h-5 w-5 text-customTeal" />
                  </div>

                  <div>
                    <CardTitle className="text-lg">
                      Address
                    </CardTitle>

                    <CardDescription>
                      Contact address
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-6">
                <p className="font-medium">
                  {member.address.street}
                </p>

                <p className="text-gray-600">
                  {member.address.city}, {member.address.state}
                </p>

                <p className="text-gray-600">
                  {member.address.zipCode}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Insurance */}
          <Card>
            <CardHeader className="bg-customTeal/5 pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">
                    Insurance
                  </CardTitle>

                  <CardDescription>
                    Insurance coverage
                  </CardDescription>
                </div>

                <div className="bg-customTeal/20 p-3 rounded-full">
                  <CreditCard className="h-6 w-6 text-customTeal" />
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              {insuranceCoverage === "own" ? (
                <div>
                  <p className="text-sm text-gray-500 mb-2">
                    Coverage
                  </p>

                  <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                    Own Insurance
                  </Badge>

                  <div className="mt-4">
                    <Button
                      type="button"
                      size="sm"
                      className="bg-customTeal hover:bg-customTeal/90 text-white"
                      asChild
                    >
                      <Link
                        href={`/patient/insurance/${member.familyMemberId}/add-insurance`}
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Add Insurance
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-500 mb-2">
                    Coverage
                  </p>

                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                    Primary Patient Insurance
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Quick Actions
              </CardTitle>
            </CardHeader>

            <CardContent className="p-0">
              <Link
                href={`/patient/appointments/new?familyMemberId=${member.familyMemberId}`}
                className="p-4 hover:bg-gray-50 transition-colors flex items-center gap-3"
              >
                <Calendar className="text-customTeal w-4 h-4" />

                <span>Book Appointment</span>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Family Member Profile
              </CardTitle>

              <CardDescription>
                Complete information for {fullName}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">
                    First Name
                  </p>
                  <p className="font-medium mt-1">
                    {member.firstName}
                  </p>
                </div>

                {member.middleName && (
                  <div>
                    <p className="text-sm text-gray-500">
                      Middle Name
                    </p>
                    <p className="font-medium mt-1">
                      {member.middleName}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-500">
                    Last Name
                  </p>
                  <p className="font-medium mt-1">
                    {member.lastName}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Relationship
                  </p>
                  <p className="font-medium mt-1 capitalize">
                    {member.relationship}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Gender
                  </p>
                  <p className="font-medium mt-1">
                    {member.gender}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Status
                  </p>

                  <Badge
                    className={
                      member.status === "active"
                        ? "bg-green-100 text-green-700 hover:bg-green-100 mt-1"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-100 mt-1"
                    }
                  >
                    {member.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}