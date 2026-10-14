/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  FileText,
  Download,
  Search,
  Calendar,
  Users,
  Shield,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMedicalRecords } from "@/hooks/useMedicalRecords";
import { useFamilyMember } from "@/hooks/useFamilyMember";
import api from "@/helper/axios";
import { BASE_URL, PATIENT_INSURANCE_API } from "@/helper/api";
import Link from "next/link";

interface UnifiedDocument {
  id: string;
  title: string;
  type: "medical_record" | "prescription" | "insurance";
  date: string;
  doctorOrIssuer: string;
  patientName: string;
  description: string;
  downloadUrl: string;
  fileType: string;
}

export default function DocumentsPage() {
  const { medicalRecords, loading: recordsLoading, getAllMedicalRecords } =
    useMedicalRecords();
  const { familyMembers, loading: familyLoading, getAllFamilyMembers } =
    useFamilyMember();

  const [insurancePolicies, setInsurancePolicies] = useState<any[]>([]);
  const [insuranceLoading, setInsuranceLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [patientFilter, setPatientFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sortBy] = useState<"date" | "title">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    getAllMedicalRecords();
    getAllFamilyMembers();

    const fetchInsurance = async () => {
      try {
        setInsuranceLoading(true);
        const res = await api.get(PATIENT_INSURANCE_API.GET);
        const data = res.data?.data ?? res.data ?? [];
        setInsurancePolicies(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching insurance documents:", err);
      } finally {
        setInsuranceLoading(false);
      }
    };

    fetchInsurance();
  }, []);

  const unifiedDocuments: UnifiedDocument[] = useMemo(() => {
    const list: UnifiedDocument[] = [];

    // Map clinical records
    if (Array.isArray(medicalRecords)) {
      for (const rec of medicalRecords) {
        const patientName = rec.familyMember
          ? `${rec.familyMember.firstName} ${rec.familyMember.lastName}`
          : "Self";

        const docTitle = rec.assessment
          ? `Clinical Summary: ${rec.assessment.slice(0, 35)}...`
          : `Consultation Record (${rec.consultationDate})`;

        list.push({
          id: rec.clinicalRecordId || rec._id,
          title: docTitle,
          type:
            Array.isArray(rec.medicines) && rec.medicines.length > 0
              ? "prescription"
              : "medical_record",
          date: rec.consultationDate || rec.createdAt?.slice(0, 10) || "",
          doctorOrIssuer: rec.doctor?.username
            ? `Dr. ${rec.doctor.username}`
            : "Hospital Physician",
          patientName,
          description:
            rec.assessment ||
            rec.presentingComplaints ||
            "Clinical consultation & prescription details",
          downloadUrl: `${BASE_URL}/clinical-records/${rec.clinicalRecordId || rec._id}/pdf`,
          fileType: "PDF",
        });
      }
    }

    // Map insurance documents
    if (Array.isArray(insurancePolicies)) {
      for (const pol of insurancePolicies) {
        if (pol.policyDocument || pol.frontCardImage) {
          list.push({
            id: pol._id || pol.policyNumber,
            title: `${pol.insuranceProvider} - Policy Document`,
            type: "insurance",
            date: pol.startDate || pol.createdAt?.slice(0, 10) || "",
            doctorOrIssuer: pol.tpa || pol.insuranceProvider || "Insurer",
            patientName: pol.policyHolderName || "Self",
            description: `Policy #${pol.policyNumber} (${pol.policyType || "Health Insurance"})${pol.sumInsured ? " • ₹" + pol.sumInsured.toLocaleString("en-IN") : ""}`,
            downloadUrl: pol.policyDocument || pol.frontCardImage,
            fileType: pol.policyDocument?.endsWith(".pdf") ? "PDF" : "Image",
          });
        }
      }
    }

    return list;
  }, [medicalRecords, insurancePolicies]);

  // Dynamic unique patient names list
  const patientOptions = useMemo(() => {
    const names = new Set<string>(["Self"]);
    if (Array.isArray(familyMembers)) {
      familyMembers.forEach((fm: any) => {
        const fn = [fm.firstName, fm.lastName].filter(Boolean).join(" ");
        if (fn) names.add(fn);
      });
    }
    unifiedDocuments.forEach((doc) => {
      if (doc.patientName) names.add(doc.patientName);
    });
    return Array.from(names);
  }, [familyMembers, unifiedDocuments]);

  // Filter & sort
  const filteredDocuments = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();

    return unifiedDocuments
      .filter((doc) => {
        const matchesSearch =
          !q ||
          doc.title.toLowerCase().includes(q) ||
          doc.doctorOrIssuer.toLowerCase().includes(q) ||
          doc.description.toLowerCase().includes(q) ||
          doc.patientName.toLowerCase().includes(q);

        const matchesPatient =
          patientFilter === "all" || doc.patientName === patientFilter;

        const matchesType =
          typeFilter === "all" || doc.type === typeFilter;

        return matchesSearch && matchesPatient && matchesType;
      })
      .sort((a, b) => {
        if (sortBy === "date") {
          return sortOrder === "asc"
            ? a.date.localeCompare(b.date)
            : b.date.localeCompare(a.date);
        } else {
          return sortOrder === "asc"
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);
        }
      });
  }, [unifiedDocuments, searchTerm, patientFilter, typeFilter, sortBy, sortOrder]);

  const isLoading = recordsLoading || familyLoading || insuranceLoading;

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "prescription":
        return <Badge className="bg-blue-600">Prescription</Badge>;
      case "medical_record":
        return <Badge className="bg-customTeal">Clinical Record</Badge>;
      case "insurance":
        return <Badge className="bg-emerald-600">Insurance Schedule</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-customTeal">
            Medical & Insurance Documents
          </h1>
          <p className="text-sm text-gray-500">
            View and download your official clinical records, prescriptions, and policy schedules
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by title, doctor, diagnosis, or patient..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <Select value={patientFilter} onValueChange={setPatientFilter}>
            <SelectTrigger className="w-[150px]">
              <Users className="h-4 w-4 mr-2 text-customTeal" />
              <span className="truncate">
                {patientFilter === "all" ? "All Patients" : patientFilter}
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Patients</SelectItem>
              {patientOptions.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[170px]">
              <FileText className="h-4 w-4 mr-2 text-customTeal" />
              <span className="truncate">
                {typeFilter === "all"
                  ? "All Document Types"
                  : typeFilter === "prescription"
                  ? "Prescriptions"
                  : typeFilter === "medical_record"
                  ? "Clinical Records"
                  : "Insurance Schedules"}
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="medical_record">Clinical Records</SelectItem>
              <SelectItem value="prescription">Prescriptions</SelectItem>
              <SelectItem value="insurance">Insurance Schedules</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
            }
          >
            Sort Date: {sortOrder.toUpperCase()}
          </Button>
        </div>
      </div>

      {/* Documents List */}
      {isLoading ? (
        <Card className="p-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-customTeal mb-3" />
          <p className="text-gray-500">Loading your medical documents...</p>
        </Card>
      ) : filteredDocuments.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-800 mb-1">
            No Documents Found
          </h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto mb-4">
            {searchTerm || patientFilter !== "all" || typeFilter !== "all"
              ? "No documents match your search or filter criteria."
              : "You don't have any consultation records or uploaded policy schedules yet."}
          </p>
          <div className="flex justify-center gap-3">
            <Link href="/patient/appointments/new">
              <Button className="bg-customTeal hover:bg-customTeal/90 text-white">
                Book Consultation
              </Button>
            </Link>
            <Link href="/patient/insurance">
              <Button variant="outline">
                <Shield className="w-4 h-4 mr-2 text-customTeal" />
                Add Insurance
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>Document Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Doctor / Issuer</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map((doc) => (
                <TableRow key={`${doc.type}-${doc.id}`}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-customTeal shrink-0" />
                      <div>
                        <p className="text-gray-900">{doc.title}</p>
                        <p className="text-xs text-gray-500 line-clamp-1">
                          {doc.description}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getTypeBadge(doc.type)}</TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {doc.doctorOrIssuer}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {doc.patientName}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500 whitespace-nowrap">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {doc.date || "N/A"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <a
                      href={doc.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        size="sm"
                        variant="outline"
                        className="hover:border-customTeal hover:text-customTeal text-xs"
                      >
                        <Download className="h-3.5 w-3.5 mr-1" />
                        Download {doc.fileType}
                      </Button>
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}