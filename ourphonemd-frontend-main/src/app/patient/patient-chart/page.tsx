/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@/context/userContext";
import { useMedicalRecords } from "@/hooks/useMedicalRecords";
import { useAppointments } from "@/hooks/useAppointments";
import { useFamilyMember } from "@/hooks/useFamilyMember";
import api from "@/helper/axios";
import { BASE_URL, PATIENT_INSURANCE_API } from "@/helper/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Activity,
  Calendar as CalendarIcon,
  FileText,
  Heart,
  Shield,
  Stethoscope,
  Users,
  Clock,
  Download,
  Plus,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

export default function PatientChartPage() {
  const { user } = useUser();
  const { medicalRecords, loading: recordsLoading, getAllMedicalRecords } =
    useMedicalRecords();
  const { appointments, getAllAppointments } =
    useAppointments();
  const { familyMembers, loading: familyLoading, getAllFamilyMembers } =
    useFamilyMember();

  const [insuranceList, setInsuranceList] = useState<any[]>([]);

  useEffect(() => {
    getAllMedicalRecords();
    getAllAppointments();
    getAllFamilyMembers();

    const fetchInsurance = async () => {
      try {
        const res = await api.get(PATIENT_INSURANCE_API.GET);
        const data = res.data?.data ?? res.data ?? [];
        setInsuranceList(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching insurance in chart:", err);
      }
    };

    fetchInsurance();
  }, []);

  const primaryInsurance = insuranceList.find((p) => p.isPrimary) || insuranceList[0];

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase() || "P";
  };

  const calculateAge = (dobString?: string) => {
    if (!dobString) return null;
    const dob = new Date(dobString);
    if (Number.isNaN(dob.getTime())) return null;
    const diff = Date.now() - dob.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const age = calculateAge(user?.dateOfBirth);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-6">
      {/* Patient Demographic Banner */}
      <Card className="border-customTeal/30 bg-gradient-to-r from-teal-50/50 to-white shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="h-20 w-20 border-2 border-customTeal">
              <AvatarImage src={user?.avatar || "/placeholder-avatar.jpg"} alt={user?.firstName} />
              <AvatarFallback className="text-xl bg-customTeal text-white font-bold">
                {getInitials(user?.firstName, user?.lastName)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center md:text-left space-y-1">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <h1 className="text-2xl font-bold text-gray-900">
                  {user?.firstName} {user?.middleName ? user.middleName + " " : ""}{user?.lastName}
                </h1>
                <Badge className="bg-customTeal">UHID: {user?.id?.slice(0, 10) || "PATIENT"}</Badge>
                {user?.gender && (
                  <Badge variant="outline" className="capitalize">
                    {user.gender.toLowerCase()}
                  </Badge>
                )}
                {age !== null && (
                  <Badge variant="secondary">{age} Years Old</Badge>
                )}
              </div>

              <p className="text-sm text-gray-600">
                DOB: {user?.dateOfBirth ? format(new Date(user.dateOfBirth), "dd MMM yyyy") : "N/A"} • Phone: {user?.phoneNumber || "N/A"} • Email: {user?.email || "N/A"}
              </p>
              <p className="text-xs text-gray-500">
                Address: {[user?.address, user?.city, user?.state, user?.zipCode].filter(Boolean).join(", ") || "No address on file"}
              </p>
            </div>

            <div className="flex gap-2">
              <Link href="/patient/appointments/new">
                <Button className="bg-customTeal hover:bg-customTeal/90 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  New Appointment
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Snapshot Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Blood Group & Allergies */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-500" />
              Blood & Allergies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {user?.bloodType && user.bloodType !== "unknown" ? user.bloodType : "Not Tested"}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Allergies:{" "}
              <span className="font-medium text-gray-700">
                {user?.allergies && user.allergies.length > 0 ? user.allergies.join(", ") : "None reported"}
              </span>
            </p>
          </CardContent>
        </Card>

        {/* Primary Insurance */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600" />
              Primary Health Insurance
            </CardTitle>
          </CardHeader>
          <CardContent>
            {primaryInsurance ? (
              <div>
                <p className="text-base font-bold text-gray-900 truncate">
                  {primaryInsurance.insuranceProvider}
                </p>
                <p className="text-xs text-gray-500">
                  Policy #{primaryInsurance.policyNumber}
                </p>
                <p className="text-xs font-semibold text-emerald-700 mt-1">
                  {primaryInsurance.sumInsured ? `SI: ₹${primaryInsurance.sumInsured.toLocaleString("en-IN")}` : "Coverage Active"}
                </p>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-500">No policy on file</p>
                <Link href="/patient/insurance" className="text-xs text-customTeal font-medium hover:underline">
                  + Add Indian Insurance
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Family Dependents */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              Family Dependents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {familyLoading ? "..." : familyMembers.length}
            </div>
            <Link href="/patient/family-member" className="text-xs text-blue-600 hover:underline">
              View registered dependents
            </Link>
          </CardContent>
        </Card>

        {/* Consultations */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-600" />
              Recorded Consultations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {recordsLoading ? "..." : medicalRecords.length}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Active clinical records
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Appointments Overview */}
      {appointments.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base text-gray-800">
              <CalendarIcon className="w-4 h-4 text-customTeal" />
              Scheduled Appointments ({appointments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {appointments.slice(0, 4).map((apt: any) => (
                <div key={apt.appointmentId} className="border p-3 rounded-lg flex justify-between items-center bg-gray-50/50">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {apt.doctor?.username ? `Dr. ${apt.doctor.username}` : "Doctor"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {apt.appointmentDate} at {apt.startTime} ({apt.appointmentType})
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {apt.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Clinical Consultation History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-customTeal">
            <Stethoscope className="w-5 h-5 text-customTeal" />
            Clinical Notes & Prescriptions History
          </CardTitle>
          <CardDescription>
            Official consultations recorded by hospital doctors
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recordsLoading ? (
            <p className="text-gray-500 py-6 text-center">Loading clinical history...</p>
          ) : medicalRecords.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <FileText className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-600 font-medium">No clinical records found</p>
              <p className="text-sm text-gray-400">
                Consultation notes and digital prescriptions will appear here once finalized by attending doctors.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {medicalRecords.map((record: any) => (
                <div
                  key={record.clinicalRecordId || record._id}
                  className="p-4 border rounded-lg hover:border-customTeal/50 transition-colors bg-white shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">
                          {record.doctor?.username ? `Dr. ${record.doctor.username}` : "Doctor"}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {record.consultationDate}
                        </Badge>
                        {record.familyMember && (
                          <Badge variant="secondary" className="text-xs">
                            Patient: {record.familyMember.firstName} {record.familyMember.lastName} ({record.familyMember.relationship})
                          </Badge>
                        )}
                      </div>
                    </div>

                    <a
                      href={`${BASE_URL}/clinical-records/${record.clinicalRecordId || record._id}/pdf`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button size="sm" variant="outline" className="text-xs">
                        <Download className="w-3.5 h-3.5 mr-1" />
                        Download PDF
                      </Button>
                    </a>
                  </div>

                  {record.assessment && (
                    <div className="text-sm mt-2">
                      <span className="font-medium text-gray-700">Diagnosis / Assessment: </span>
                      <span className="text-gray-600">{record.assessment}</span>
                    </div>
                  )}

                  {Array.isArray(record.medicines) && record.medicines.length > 0 && (
                    <div className="mt-3 bg-teal-50/50 p-3 rounded-md">
                      <p className="text-xs font-bold text-customTeal uppercase mb-1">
                        Prescribed Medications ({record.medicines.length})
                      </p>
                      <ul className="text-xs text-gray-700 list-disc list-inside space-y-0.5">
                        {record.medicines.map((med: any, idx: number) => (
                          <li key={idx}>
                            <span className="font-medium">{med.name}</span> — {med.dosage} ({med.frequency}, {med.duration})
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {record.followUp?.date && (
                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-customTeal" />
                      Follow-up scheduled on: <span className="font-medium">{record.followUp.date}</span>
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
