"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Calendar, Users, FileText, Shield } from "lucide-react";
import Link from "next/link";

import DashboardCard from "@/components/reuseable-cards/PatientDashboardCard";

import { useAppointments } from "@/hooks/useAppointments";
import { useFamilyMember } from "@/hooks/useFamilyMember";
import { useMedicalRecords } from "@/hooks/useMedicalRecords";
import api from "@/helper/axios";
import { PATIENT_INSURANCE_API } from "@/helper/api";

const PatientHome = () => {
  // =========================
  // Backend data
  // =========================

  const {
    appointments,
    loading: appointmentsLoading,
    getAllAppointments,
  } = useAppointments();

  const {
    familyMembers,
    loading: familyLoading,
    getAllFamilyMembers,
  } = useFamilyMember();

  const {
    medicalRecords,
    loading: medicalRecordsLoading,
    getAllMedicalRecords,
  } = useMedicalRecords();

  const [insuranceCount, setInsuranceCount] = useState<number | null>(null);
  const [insuranceLoading, setInsuranceLoading] = useState(false);

  // =========================
  // Fetch dashboard data
  // =========================

  useEffect(() => {
    getAllAppointments();
    getAllFamilyMembers();
    getAllMedicalRecords();

    const fetchInsuranceCount = async () => {
      try {
        setInsuranceLoading(true);
        const res = await api.get(PATIENT_INSURANCE_API.GET);
        const data = res.data?.data ?? res.data ?? [];
        setInsuranceCount(Array.isArray(data) ? data.length : 0);
      } catch (err) {
        console.error("Error fetching insurance count:", err);
        setInsuranceCount(0);
      } finally {
        setInsuranceLoading(false);
      }
    };

    fetchInsuranceCount();
  }, []);

  // =========================
  // Calculate upcoming appointments
  // =========================

  const upcomingAppointments = useMemo(() => {
    const now = new Date();

    return appointments.filter((appointment: any) => {
      if (!appointment.appointmentDate || !appointment.startTime) {
        return false;
      }

      const appointmentDateTime = new Date(
        `${appointment.appointmentDate}T${appointment.startTime}`
      );

      return (
        appointmentDateTime > now &&
        ["BOOKED", "VERIFIED", "CONFIRMED"].includes(
          appointment.status
        )
      );
    });
  }, [appointments]);

  // =========================
  // Dashboard loading state
  // =========================

  const dashboardLoading =
    appointmentsLoading ||
    familyLoading ||
    medicalRecordsLoading ||
    insuranceLoading;

  // =========================
  // Dashboard data
  // =========================

  const dashboardData = {
    upcomingAppointments: upcomingAppointments.length,
    familyMembers: familyMembers.length,
    previousVisits: medicalRecords.length,
    insurancePolicies: insuranceCount !== null ? insuranceCount : 0,
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-customTeal">
        Patient Dashboard
      </h1>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">

        {/* Upcoming Appointments */}
        <DashboardCard
          icon={<Calendar className="w-6 h-6" />}
          title="Upcoming Appointments"
          count={
            dashboardLoading
              ? "..."
              : dashboardData.upcomingAppointments
          }
          linkTo="/patient/appointments"
          color="bg-customTeal"
        />

        {/* Family Members */}
        <DashboardCard
          icon={<Users className="w-6 h-6" />}
          title="My Family"
          count={
            dashboardLoading
              ? "..."
              : dashboardData.familyMembers
          }
          linkTo="/patient/family-member"
          color="bg-blue-500"
        />

        {/* Clinical Records & Visits */}
        <DashboardCard
          icon={<FileText className="w-6 h-6" />}
          title="Clinical Records"
          count={
            dashboardLoading
              ? "..."
              : dashboardData.previousVisits
          }
          linkTo="/patient/documents"
          color="bg-purple-500"
        />

        {/* Insurance Policies */}
        <DashboardCard
          icon={<Shield className="w-6 h-6" />}
          title="Health Insurance"
          count={
            dashboardLoading
              ? "..."
              : dashboardData.insurancePolicies
          }
          linkTo="/patient/insurance"
          color="bg-emerald-600"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="bg-customTeal/10 p-4 border-b">
          <h2 className="text-lg font-semibold text-customTeal">
            Quick Actions
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x">
          <Link
            href="/patient/appointments/new"
            className="p-4 hover:bg-gray-50 transition-colors flex items-center gap-3"
          >
            <Calendar className="text-customTeal w-5 h-5" />
            <span className="font-medium">Book New Appointment</span>
          </Link>

          <Link
            href="/patient/family-member/add"
            className="p-4 hover:bg-gray-50 transition-colors flex items-center gap-3"
          >
            <Users className="text-customTeal w-5 h-5" />
            <span className="font-medium">Add Family Member</span>
          </Link>

          <Link
            href="/patient/insurance"
            className="p-4 hover:bg-gray-50 transition-colors flex items-center gap-3"
          >
            <Shield className="text-customTeal w-5 h-5" />
            <span className="font-medium">Manage Health Insurance</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PatientHome;