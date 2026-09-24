"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Plus, Users, Search, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import FamilyMemberCard from "@/components/reuseable-cards/FamilyMemberCard";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { useFamilyMember } from "@/hooks/useFamilyMember";

export default function FamilyMembersPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const {
    familyMembers,
    loading,
    error,
    getAllFamilyMembers,
  } = useFamilyMember();

  useEffect(() => {
    getAllFamilyMembers();
  }, []);

  const filteredMembers = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    if (!search) {
      return familyMembers;
    }

    return familyMembers.filter((member: any) => {
      const fullName = [
        member.firstName,
        member.middleName,
        member.lastName,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const relationship = String(
        member.relationship || ""
      ).toLowerCase();

      return (
        fullName.includes(search) ||
        relationship.includes(search)
      );
    });
  }, [familyMembers, searchTerm]);

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Family Members
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Manage your family members and their health information
          </p>
        </div>

        <Link
          href="/patient/family-member/add"
          className="w-full sm:w-auto"
        >
          <Button className="bg-customTeal hover:bg-customTeal/90 text-white w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Family Member
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

        <Input
          placeholder="Search by name or relationship..."
          className="pl-10 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Loading */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            Loading family members...
          </p>
        </div>
      ) : error ? (
        /* Error */
        <div className="text-center py-12 bg-red-50 rounded-xl border border-red-100">
          <p className="text-red-600">
            {error}
          </p>
        </div>
      ) : filteredMembers.length > 0 ? (
        /* Family Members */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredMembers.map((member: any) => (
            <FamilyMemberCard
              key={member.id || member._id}
              member={member}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100">
          <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />

          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No family members found
          </h3>

          {searchTerm ? (
            <p className="text-gray-500 mb-4">
              No family members match your search criteria.
            </p>
          ) : (
            <p className="text-gray-500 mb-4">
              You haven&apos;t added any family members yet.
            </p>
          )}

          <Link href="/patient/family-member/add">
            <Button className="bg-customTeal hover:bg-customTeal/90 text-white">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Your First Family Member
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}