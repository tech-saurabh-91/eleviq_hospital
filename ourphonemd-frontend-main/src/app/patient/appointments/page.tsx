/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState } from "react";
import Link from 'next/link';
import {
  CalendarPlus,
  CalendarClock,
  Clock,
  Calendar,
  ChevronRight,
  VideoIcon,
  MapPin,
  User,
  FileText,
  CreditCard,
  ArrowRight
} from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useAppointments } from '@/hooks/useAppointments';
import { Skeleton } from '@/components/ui/skeleton';
import { AppointmentStatus } from "@/types/appoiment";

export default function AppointmentsPage() {
  const { appointments, loading, getAllAppointments } = useAppointments();
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

  useEffect(() => {
    getAllAppointments();
  }, []);



  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.BOOKED:
        return (
          <Badge className="bg-yellow-500">
            Booked
          </Badge>
        );

      case AppointmentStatus.VERIFIED:
        return (
          <Badge className="bg-blue-500">
            Verified
          </Badge>
        );

      case AppointmentStatus.CONFIRMED:
        return (
          <Badge className="bg-green-500">
            Confirmed
          </Badge>
        );

      default:
        return (
          <Badge className="bg-gray-500">
            {status}
          </Badge>
        );
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
        <p className="text-gray-500 mt-1">Manage your healthcare appointments</p>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Link href="/patient/appointments/new">
          <Card className="hover:border-customTeal cursor-pointer transition-colors h-[200px] flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Schedule New Appointment</CardTitle>
              <CalendarPlus className="h-6 w-6 text-customTeal" />
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground">Book a new appointment with available healthcare providers</p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="outline" className="w-full bg-customTeal text-white hover:bg-customTeal/90">
                Book Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </Link>

        <Link href="/patient/appointments/calendar">
          <Card className="hover:border-customTeal cursor-pointer transition-colors h-[200px] flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">View Calendar</CardTitle>
              <CalendarClock className="h-6 w-6 text-customTeal" />
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground">View and manage all your scheduled appointments in calendar view</p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="outline" className="w-full bg-customTeal text-white hover:bg-customTeal/90">
                Open Calendar <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </Link>
      </div>

      {/* Upcoming Appointments Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Upcoming Appointments</h2>
          <Link href="/patient/appointments/calendar">
            <Button variant="ghost" size="sm" className="gap-1">
              View All
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <Card key={i} className="overflow-hidden">
                <div className="h-2 bg-gray-200"></div>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {appointments.map((appointment) => (
              <Card
                key={appointment.appointmentId}
                className="overflow-hidden"
              >
                <div className="h-2 bg-customTeal" />

                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">

                    {/* Doctor Avatar */}
                    <Avatar className="h-12 w-12 border">
                      <AvatarFallback>
                        {appointment.doctor?.username
                          ?.charAt(0)
                          ?.toUpperCase() || "D"}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">

                      {/* Doctor + Status */}
                      <div className="flex justify-between w-full mb-2">
                        <div>
                          <h3 className="font-medium">
                            {appointment.doctor?.username || "Doctor"}
                          </h3>

                          <p className="text-sm text-muted-foreground">
                            {appointment.appointmentType || "Appointment"}
                          </p>
                        </div>

                        {getStatusBadge(appointment.status)}
                      </div>

                      {/* Appointment Information */}
                      <div className="grid grid-cols-2 gap-y-2 text-sm mt-3">

                        {/* Date */}
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-500" />

                          <span>
                            {appointment.appointmentDate
                              ? format(
                                new Date(
                                  `${appointment.appointmentDate}T00:00:00`
                                ),
                                "EEE, MMM d, yyyy"
                              )
                              : "N/A"}
                          </span>
                        </div>

                        {/* Time */}
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-gray-500" />

                          <span>
                            {appointment.startTime} - {appointment.endTime}
                          </span>
                        </div>

                        {/* Doctor Mobile */}
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-gray-500" />

                          <span>
                            {appointment.doctor?.mobile || "N/A"}
                          </span>
                        </div>

                        {/* Appointment For */}
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-gray-500" />

                          <span>
                            {appointment.appointmentFor?.type === "FAMILY"
                              ? appointment.appointmentFor?.name ||
                              "Family Member"
                              : "Self"}
                          </span>
                        </div>
                      </div>

                      {/* Visit Reason */}
                      {appointment.visitReason && (
                        <p className="text-sm text-gray-500 mt-3">
                          <span className="font-medium text-gray-700">
                            Reason:
                          </span>{" "}
                          {appointment.visitReason}
                        </p>
                      )}

                      {/* Actions */}
                      <div className="flex space-x-2 mt-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setSelectedAppointment(appointment)
                          }
                        >
                          View Details
                        </Button>
                      </div>

                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && appointments.length === 0 && (
          <Card className="p-6 py-8 text-center">
            <div className="flex flex-col items-center">
              <Calendar className="h-12 w-12 text-gray-300 mb-3" />
              <h3 className="text-lg font-medium mb-1">No Upcoming Appointments</h3>
              <p className="text-sm text-gray-500 mb-4">You don&apos;t have any scheduled appointments at the moment.</p>
              <Link href="/patient/appointments/new">
                <Button variant="outline">
                  <CalendarPlus className="h-4 w-4 mr-2 text-customTeal" />
                  Schedule an Appointment
                </Button>
              </Link>
            </div>
          </Card>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="hover:border-primary cursor-pointer transition-colors">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="bg-customTeal/10 p-3 rounded-full">
              <VideoIcon className="h-6 w-6 text-customTeal" />
            </div>
            <div>
              <h3 className="font-medium">Video Appointments</h3>
              <p className="text-sm text-gray-500">Meet with providers online</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-primary cursor-pointer transition-colors">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="bg-customTeal/10 p-3 rounded-full">
              <Clock className="h-6 w-6 text-customTeal" />
            </div>
            <div>
              <h3 className="font-medium">Appointment History</h3>
              <p className="text-sm text-gray-500">View past appointments</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-primary cursor-pointer transition-colors">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="bg-customTeal/10 p-3 rounded-full">
              <MapPin className="h-6 w-6 text-customTeal" />
            </div>
            <div>
              <h3 className="font-medium">Office Locations</h3>
              <p className="text-sm text-gray-500">Find nearest clinic</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog
        open={!!selectedAppointment}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedAppointment(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
            <DialogDescription>
              View your appointment information.
            </DialogDescription>
          </DialogHeader>

          {selectedAppointment && (
            <div className="space-y-5">

              {/* Doctor */}
              <div>
                <p className="text-sm text-gray-500 mb-1">
                  Doctor
                </p>

                <p className="font-medium">
                  {selectedAppointment.doctor?.username ||
                    "Doctor"}
                </p>

                {selectedAppointment.doctor?.mobile && (
                  <p className="text-sm text-gray-500">
                    {selectedAppointment.doctor.mobile}
                  </p>
                )}
              </div>

              {/* Appointment For */}
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-customTeal mt-0.5" />

                <div>
                  <p className="text-sm text-gray-500">
                    Appointment For
                  </p>

                  <p className="font-medium">
                    {selectedAppointment.appointmentFor?.type ===
                      "FAMILY"
                      ? selectedAppointment.appointmentFor?.name ||
                      "Family Member"
                      : "Myself"}
                  </p>
                </div>
              </div>

              {/* Date */}
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-customTeal mt-0.5" />

                <div>
                  <p className="text-sm text-gray-500">
                    Appointment Date
                  </p>

                  <p className="font-medium">
                    {selectedAppointment.appointmentDate
                      ? format(
                        new Date(
                          `${selectedAppointment.appointmentDate}T00:00:00`
                        ),
                        "EEE, MMM d, yyyy"
                      )
                      : "N/A"}
                  </p>
                </div>
              </div>

              {/* Time */}
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-customTeal mt-0.5" />

                <div>
                  <p className="text-sm text-gray-500">
                    Time
                  </p>

                  <p className="font-medium">
                    {selectedAppointment.startTime} -{" "}
                    {selectedAppointment.endTime}
                  </p>
                </div>
              </div>

              {/* Appointment Type */}
              <div>
                <p className="text-sm text-gray-500">
                  Appointment Type
                </p>

                <p className="font-medium">
                  {selectedAppointment.appointmentType || "N/A"}
                </p>
              </div>

              {/* Status */}
              <div>
                <p className="text-sm text-gray-500 mb-1">
                  Status
                </p>

                {getStatusBadge(selectedAppointment.status)}
              </div>

              {/* Visit Reason */}
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-customTeal mt-0.5" />

                <div>
                  <p className="text-sm text-gray-500">
                    Reason for Visit
                  </p>

                  <p className="font-medium">
                    {selectedAppointment.visitReason || "Not provided"}
                  </p>
                </div>
              </div>

              {/* Payment */}
              <div className="flex items-start gap-3">
                <CreditCard className="h-5 w-5 text-customTeal mt-0.5" />

                <div>
                  <p className="text-sm text-gray-500">
                    Payment
                  </p>

                  <p className="font-medium">
                    {selectedAppointment.payment?.status || "N/A"}
                  </p>
                </div>
              </div>

            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSelectedAppointment(null)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}