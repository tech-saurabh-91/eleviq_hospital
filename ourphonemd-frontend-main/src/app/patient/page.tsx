"use client";

import React, { useEffect, useMemo } from "react";
import { Calendar, Users, FileText } from "lucide-react";
import Link from "next/link";

import DashboardCard from "@/components/reuseable-cards/PatientDashboardCard";

import { useAppointments } from "@/hooks/useAppointments";
import { useFamilyMember } from "@/hooks/useFamilyMember";
import { useMedicalRecords } from "@/hooks/useMedicalRecords";

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

  // =========================
  // Fetch dashboard data
  // =========================

  useEffect(() => {
    getAllAppointments();
    getAllFamilyMembers();
    getAllMedicalRecords();
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
    medicalRecordsLoading;

  // =========================
  // Dashboard data
  // =========================

  const dashboardData = {
    upcomingAppointments: upcomingAppointments.length,
    familyMembers: familyMembers.length,
    previousVisits: medicalRecords.length,
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

        {/* Previous Visits */}
        <DashboardCard
          icon={<FileText className="w-6 h-6" />}
          title="Previous Visits"
          count={
            dashboardLoading
              ? "..."
              : dashboardData.previousVisits
          }
          linkTo="/patient/visits"
          color="bg-purple-500"
        />

        {/* Support */}
        <div className="bg-gradient-to-br from-customTeal to-blue-400 rounded-xl shadow-sm p-6 text-white flex flex-col justify-between">
          <p className="text-lg font-semibold">
            Need assistance?
          </p>

          <p className="text-sm opacity-90 mb-4">
            Our support team is available 24/7
          </p>

          <Link
            href="/patient/support"
            className="bg-white text-customTeal py-2 px-4 rounded-md text-sm font-medium hover:bg-opacity-90 transition-colors self-start"
          >
            Contact Support
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="bg-customTeal/10 p-4 border-b">
          <h2 className="text-lg font-semibold text-customTeal">
            Quick Actions
          </h2>
        </div>

        <div className="grid grid-cols-2 divide-y sm:divide-y-0 sm:divide-x">
          <Link
            href="/patient/appointments/new"
            className="p-4 hover:bg-gray-50 transition-colors flex items-center gap-3"
          >
            <Calendar className="text-customTeal w-5 h-5" />

            <span>Book New Appointment</span>
          </Link>

          <Link
            href="/patient/family-member/new"
            className="p-4 hover:bg-gray-50 transition-colors flex items-center gap-3"
          >
            <Users className="text-customTeal w-5 h-5" />

            <span>Add Family Member</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PatientHome;