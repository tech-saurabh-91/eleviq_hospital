"use client";

import React, { useState } from "react";
import { Plus, Users, Search, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import FamilyMemberCard from "@/components/reuseable-cards/FamilyMemberCard";
import Link from "next/link";
import { Input } from "@/components/ui/input";

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  dateOfBirth: string;
  gender: string;
  phone?: string;
  email?: string;
  insurance?: {
    hasInsurance: boolean;
    provider?: string;
    policyNumber?: string;
  };
  appointments: {
    total: number;
    upcoming: number;
    past: number;
  };
}

const familyMembers: FamilyMember[] = [
  {
    id: "1",
    name: "John Smith",
    relationship: "Father",
    dateOfBirth: "1985-06-15",
    gender: "Male",
    phone: "555-123-4567",
    email: "john.smith@example.com",
    insurance: {
      hasInsurance: true,
      provider: "Aetna",
      policyNumber: "AE7654321",
    },
    appointments: {
      total: 5,
      upcoming: 1,
      past: 4,
    },
  },
  {
    id: "2",
    email: "emma@gmail.com",
    name: "Emma Smith",
    relationship: "Child",
    dateOfBirth: "2015-03-22",
    gender: "Female",
    insurance: {
      hasInsurance: false,
    },
    appointments: {
      total: 3,
      upcoming: 0,
      past: 3,
    },
  },
];

export default function FamilyMembersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const filteredMembers = familyMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.relationship.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Family Members</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your family members and their health information</p>
        </div>
        <Link href="/patient/family-member/add" className="w-full sm:w-auto">
          <Button className="bg-customTeal hover:bg-customTeal/90 text-white w-full">
            <Plus className="h-4 w-4 mr-2" /> Add Family Member
          </Button>
        </Link>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search by name or relationship..."
          className="pl-10 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredMembers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredMembers.map((member) => (
            <FamilyMemberCard key={member.id} member={member} />
          ))}
        </div>
      ) : (
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
              <UserPlus className="h-4 w-4 mr-2" /> Add Your First Family Member
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
