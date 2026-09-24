"use client";

import React from "react";
import {
  User,
  Calendar,
  Phone,
  Mail,
  CreditCard,
  ChevronRight,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import Link from "next/link";
import { Button } from "../ui/button";

const FamilyMemberCard = ({ member }: any) => {
  const fullName = [
    member.firstName,
    member.middleName,
    member.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  const displayName = fullName || "Family Member";

  const insuranceCoverage = member.insuranceCoverage;

  return (
    <Card className="overflow-hidden w-full h-full transition-all hover:shadow-lg border-gray-200 bg-white">
      <CardHeader className="bg-customTeal/5 pb-3">
        <div className="flex items-center space-x-3 min-w-0">
          <div className="bg-customTeal/20 p-2.5 rounded-full flex-shrink-0">
            <User className="h-5 w-5 text-customTeal" />
          </div>

          <div className="min-w-0">
            <CardTitle className="text-base font-semibold text-gray-900 line-clamp-1">
              {displayName}
            </CardTitle>

            <p className="text-xs text-gray-500 mt-0.5 capitalize">
              {member.relationship || "Family Member"}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {/* Personal Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          {/* Date of Birth */}
          {member.dateOfBirth && (
            <div className="flex items-start gap-2 min-w-0">
              <Calendar className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0" />

              <div className="min-w-0">
                <p className="text-xs text-gray-500">Date of Birth</p>

                <p className="font-medium text-sm text-gray-900">
                  {member.dateOfBirth}
                </p>
              </div>
            </div>
          )}

          {/* Phone */}
          {member.phone && (
            <div className="flex items-start gap-2 min-w-0">
              <Phone className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0" />

              <div className="min-w-0">
                <p className="text-xs text-gray-500">Phone</p>

                <p className="font-medium text-sm text-gray-900 truncate">
                  {member.phone}
                </p>
              </div>
            </div>
          )}

          {/* Email */}
          {member.email && (
            <div className="flex items-start gap-2 min-w-0 col-span-full sm:col-span-1">
              <Mail className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0" />

              <div className="min-w-0">
                <p className="text-xs text-gray-500">Email</p>

                <p className="font-medium text-sm text-gray-900 truncate">
                  {member.email}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Insurance Coverage */}
        <div className="pt-2">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="h-4 w-4 text-gray-500 flex-shrink-0" />

            <p className="text-xs text-gray-500">Insurance Coverage</p>
          </div>

          {insuranceCoverage === "own" ? (
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 font-normal text-xs">
              Own Insurance
            </Badge>
          ) : (
            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 font-normal text-xs">
              Primary Patient Insurance
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="bg-gray-50/50 flex justify-end pt-3 border-t border-gray-100">
        {/* View Profile */}
        <Button
          size="sm"
          variant="ghost"
          className="text-customTeal bg-gray-100 hover:bg-gray-200 w-full sm:w-auto text-xs font-medium"
          asChild
        >
          <Link
            href={`/patient/family-member/${member.familyMemberId}`}
          >
            View Profile
            <ChevronRight className="ml-1.5 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FamilyMemberCard;