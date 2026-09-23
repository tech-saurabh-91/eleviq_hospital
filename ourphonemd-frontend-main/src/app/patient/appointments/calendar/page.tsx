"use client";

import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
} from "react";

import {
  Calendar,
  dateFnsLocalizer,
} from "react-big-calendar";

import {
  format,
  parse,
  startOfWeek,
  getDay,
} from "date-fns";

import { enUS } from "date-fns/locale";

import "react-big-calendar/lib/css/react-big-calendar.css";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Badge } from "@/components/ui/badge";

import { Input } from "@/components/ui/input";

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Clock,
  Search,
  Filter,
  UserRound,
  VideoIcon,
  Plus,
  MapPin,
  Calendar as CalendarIconSolid,
  ChevronLeft,
} from "lucide-react";

import Link from "next/link";

import { useAppointments } from "@/hooks/useAppointments";

import { toast } from "sonner";

import {
  AppointmentStatus,
} from "@/types/appoiment";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

/* -------------------------------------------------------------------------- */
/* Calendar Event Component                                                   */
/* -------------------------------------------------------------------------- */

const EventComponent = ({
  event,
}: {
  event: any;
}) => {
  const isTelemedicine =
    event.resource?.appointmentType === "TELEMEDICINE";

  return (
    <div className="flex flex-col h-full p-1 overflow-hidden">
      <div className="text-xs font-medium truncate">
        {event.title}
      </div>

      <div className="text-xs text-gray-500 truncate">
        {format(event.start, "h:mm a")} -{" "}
        {format(event.end, "h:mm a")}
      </div>

      {isTelemedicine && (
        <div className="flex items-center mt-1">
          <VideoIcon className="h-3 w-3 text-customTeal mr-1" />

          <span className="text-xs">
            Video
          </span>
        </div>
      )}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function AppointmentsCalendarPage() {
  const {
    appointments,
    error,
    getAllAppointments,
    getAvailableAppointmentSlots,
    rescheduleAppointment,
  } = useAppointments();

  const [selectedView, setSelectedView] =
    useState("month");

  const [searchQuery, setSearchQuery] =
    useState("");

  const [selectedAppointment, setSelectedAppointment] =
    useState<any>(null);

  const [filterType, setFilterType] =
    useState("all");

  const [rescheduleOpen, setRescheduleOpen] =
    useState(false);

  const [rescheduleDate, setRescheduleDate] =
    useState("");

  const [rescheduleSlots, setRescheduleSlots] =
    useState<
      {
        startTime: string;
        endTime: string;
        available: boolean;
      }[]
    >([]);

  const [selectedRescheduleTime, setSelectedRescheduleTime] =
    useState("");

  const [rescheduleLoading, setRescheduleLoading] =
    useState(false);

  /* ------------------------------------------------------------------------ */
  /* Load appointments                                                        */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    getAllAppointments();
  }, []);

  /* ------------------------------------------------------------------------ */
  /* Error handling                                                           */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  /* ------------------------------------------------------------------------ */
  /* Calendar handlers                                                        */
  /* ------------------------------------------------------------------------ */

  const handleViewChange = (view: string) => {
    setSelectedView(view);
  };

  const handleSelectEvent = useCallback(
    (event: any) => {
      setSelectedAppointment(event);
    },
    []
  );

  const handleFilterChange = (value: string) => {
    setFilterType(value);
  };

  /* ------------------------------------------------------------------------ */
  /* Convert backend appointments into calendar events                       */
  /* ------------------------------------------------------------------------ */

  const calendarEvents = useMemo(() => {
    return appointments.map((appointment) => ({
      id: appointment.appointmentId,

      title: appointment.doctor?.username
        ? `Dr. ${appointment.doctor.username}`
        : "Appointment",

      start: new Date(
        `${appointment.appointmentDate}T${appointment.startTime}`
      ),

      end: new Date(
        `${appointment.appointmentDate}T${appointment.endTime}`
      ),

      resource: appointment,
    }));
  }, [appointments]);

  /* ------------------------------------------------------------------------ */
  /* Search + filter                                                          */
  /* ------------------------------------------------------------------------ */

  const filteredAppointments = useMemo(() => {
    const search = searchQuery
      .trim()
      .toLowerCase();

    return calendarEvents.filter((event) => {
      const appointment = event.resource;

      const doctorName =
        appointment.doctor?.username || "";

      const appointmentFor =
        appointment.appointmentFor?.type === "FAMILY"
          ? [
            appointment.appointmentFor?.firstName,
            appointment.appointmentFor?.middleName,
            appointment.appointmentFor?.lastName,
          ]
            .filter(Boolean)
            .join(" ") || "Family Member"
          : "Self";

      const visitReason =
        appointment.visitReason || "";

      const appointmentType =
        appointment.appointmentType || "";

      const matchesSearch =
        !search ||
        event.title
          .toLowerCase()
          .includes(search) ||
        doctorName
          .toLowerCase()
          .includes(search) ||
        appointmentFor
          .toLowerCase()
          .includes(search) ||
        visitReason
          .toLowerCase()
          .includes(search) ||
        appointmentType
          .toLowerCase()
          .includes(search);

      const matchesFilter =
        filterType === "all" ||
        filterType === appointmentType;

      return (
        matchesSearch &&
        matchesFilter
      );
    });
  }, [
    calendarEvents,
    searchQuery,
    filterType,
  ]);

  /* ------------------------------------------------------------------------ */
  /* Status badge                                                             */
  /* ------------------------------------------------------------------------ */

  const getStatusBadge = (
    status: AppointmentStatus
  ) => {
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

  const openReschedule = () => {
    const appointment =
      selectedAppointment?.resource;

    if (!appointment) {
      return;
    }

    if (appointment.status !== AppointmentStatus.CONFIRMED) {
      toast.error(
        "Only confirmed appointments can be rescheduled."
      );

      return;
    }

    setRescheduleDate("");
    setRescheduleSlots([]);
    setSelectedRescheduleTime("");
    setRescheduleOpen(true);
  };

  const loadRescheduleSlots = async (
    date: string
  ) => {
    const appointment =
      selectedAppointment?.resource;

    if (!appointment || !date) {
      return;
    }

    setSelectedRescheduleTime("");

    const slots =
      await getAvailableAppointmentSlots(
        appointment.doctor?.doctorId,
        date
      );

    setRescheduleSlots(
      (slots || []).filter(
        (slot: {
          startTime: string;
          endTime: string;
          available: boolean;
        }) => slot.available
      )
    );
  };

  const handleReschedule = async () => {
    const appointment =
      selectedAppointment?.resource;

    if (!appointment) {
      return;
    }

    if (
      !rescheduleDate ||
      !selectedRescheduleTime
    ) {
      toast.error(
        "Please select a date and time."
      );

      return;
    }

    try {
      setRescheduleLoading(true);

      await rescheduleAppointment(
        appointment.appointmentId,
        {
          appointmentDate: rescheduleDate,
          startTime: selectedRescheduleTime,
        }
      );

      toast.success(
        "Appointment rescheduled successfully."
      );

      setRescheduleOpen(false);
      setSelectedAppointment(null);

      await getAllAppointments();
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "Failed to reschedule appointment.";

      toast.error(message);
    } finally {
      setRescheduleLoading(false);
    }
  };

  /* ------------------------------------------------------------------------ */
  /* Render                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">

      {/* Back */}
      <div className="mb-6">
        <Link
          href="/patient/appointments"
          className="flex items-center text-gray-600 hover:text-customTeal"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />

          <span>
            Back to Appointments
          </span>
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            My Appointments
          </h1>

          <p className="text-gray-500 mt-1">
            View, schedule and manage your healthcare appointments
          </p>
        </div>

        {/* Search / Filter / New */}
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">

          {/* Search */}
          <div className="relative flex-grow">

            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

            <Input
              placeholder="Search appointments..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(e.target.value)
              }
            />
          </div>

          {/* Filter */}
          <Select
            value={filterType}
            onValueChange={handleFilterChange}
          >
            <SelectTrigger className="w-full sm:w-[200px]">

              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />

                <SelectValue placeholder="Filter by type" />
              </div>

            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">
                All Appointments
              </SelectItem>

              <SelectItem value="SCHEDULED">
                Scheduled
              </SelectItem>

              <SelectItem value="EMERGENCY">
                Emergency
              </SelectItem>
            </SelectContent>
          </Select>
            {/* New Appointment */}
            <Link href="/patient/appointments/new">

              <Button className="w-full bg-customTeal sm:w-auto">

                <Plus className="h-4 w-4 mr-2 text-white" />

                New Appointment

              </Button>

            </Link>

        </div>
      </div>

      {/* Calendar */}
      <Card>

        <CardHeader className="pb-3">

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">

            <CardTitle>
              Appointment Calendar
            </CardTitle>

            <div className="flex gap-2">

              <Button
                variant={
                  selectedView === "month"
                    ? "default"
                    : "outline"
                }
                onClick={() =>
                  handleViewChange("month")
                }
                className={
                  selectedView === "month"
                    ? "bg-customTeal"
                    : ""
                }
              >
                Month
              </Button>

              <Button
                variant={
                  selectedView === "week"
                    ? "default"
                    : "outline"
                }
                onClick={() =>
                  handleViewChange("week")
                }
                className={
                  selectedView === "week"
                    ? "bg-customTeal"
                    : ""
                }
              >
                Week
              </Button>

              <Button
                variant={
                  selectedView === "day"
                    ? "default"
                    : "outline"
                }
                onClick={() =>
                  handleViewChange("day")
                }
                className={
                  selectedView === "day"
                    ? "bg-customTeal"
                    : ""
                }
              >
                Day
              </Button>

            </div>

          </div>

        </CardHeader>

        <CardContent>

          <div className="h-[600px]">

            <Calendar
              localizer={localizer}
              events={filteredAppointments}
              startAccessor="start"
              endAccessor="end"
              view={selectedView as any}
              onView={handleViewChange}
              onSelectEvent={handleSelectEvent}
              components={{
                event: EventComponent,
              }}
              eventPropGetter={(event) => ({
                className:
                  `${event.resource?.appointmentType ===
                    "TELEMEDICINE"
                    ? "bg-customTeal/10 border-customTeal"
                    : "bg-blue-50 border-blue-200"
                  } border rounded-md`,
              })}
            />

          </div>

        </CardContent>

      </Card>

      {/* -------------------------------------------------------------------- */}
      {/* Appointment Details Dialog                                           */}
      {/* -------------------------------------------------------------------- */}

      <Dialog
        open={!!selectedAppointment}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedAppointment(null);
          }
        }}
      >

        <DialogContent className="sm:max-w-[500px]">

          <DialogHeader>

            <DialogTitle>
              Appointment Details
            </DialogTitle>

            <DialogDescription>
              View your appointment details.
            </DialogDescription>

          </DialogHeader>

          {selectedAppointment && (
            <div className="space-y-5">

              {/* Doctor */}
              <div className="flex items-start gap-4">

                <Avatar className="h-12 w-12">

                  <AvatarFallback>
                    {selectedAppointment.resource?.doctor?.username
                      ?.charAt(0)
                      ?.toUpperCase() || "D"}
                  </AvatarFallback>

                </Avatar>

                <div>

                  <h3 className="font-medium">
                    {selectedAppointment.resource?.doctor?.username ||
                      "Doctor"}
                  </h3>

                  {selectedAppointment.resource?.doctor?.mobile && (
                    <p className="text-sm text-gray-500">
                      {selectedAppointment.resource.doctor.mobile}
                    </p>
                  )}

                  <p className="text-sm text-gray-500 mt-1">
                    {selectedAppointment.resource?.appointmentType ||
                      "Appointment"}
                  </p>

                  <div className="mt-2">
                    {getStatusBadge(
                      selectedAppointment.resource
                        ?.status as AppointmentStatus
                    )}
                  </div>

                </div>

              </div>

              {/* Appointment Information */}
              <div className="grid grid-cols-2 gap-4 text-sm">

                {/* Date */}
                <div className="flex items-center">

                  <CalendarIconSolid className="h-4 w-4 mr-2 text-gray-500" />

                  <span>
                    {format(
                      selectedAppointment.start,
                      "EEE, MMM d, yyyy"
                    )}
                  </span>

                </div>

                {/* Time */}
                <div className="flex items-center">

                  <Clock className="h-4 w-4 mr-2 text-gray-500" />

                  <span>
                    {format(
                      selectedAppointment.start,
                      "h:mm a"
                    )}
                    {" - "}
                    {format(
                      selectedAppointment.end,
                      "h:mm a"
                    )}
                  </span>

                </div>

                {/* Appointment For */}
                <div className="flex items-center">
                  <UserRound className="h-4 w-4 mr-2 text-gray-500" />

                  <span>
                    {selectedAppointment.resource?.appointmentFor?.type === "FAMILY"
                      ? selectedAppointment.resource?.appointmentFor?.name || "Family Member"
                      : "Self"}
                  </span>
                </div>

                {/* Appointment Type */}
                <div className="flex items-center">

                  {selectedAppointment.resource
                    ?.appointmentType ===
                    "TELEMEDICINE" ? (
                    <>
                      <VideoIcon className="h-4 w-4 mr-2 text-customTeal" />

                      <span>
                        Video Call
                      </span>
                    </>
                  ) : (
                    <>
                      <MapPin className="h-4 w-4 mr-2 text-customTeal" />

                      <span>
                        In-person
                      </span>
                    </>
                  )}

                </div>

              </div>

              {/* Reason */}
              <div className="pt-4 border-t">

                <h4 className="font-medium mb-2">
                  Reason for Visit
                </h4>

                <p className="text-sm text-gray-600">
                  {selectedAppointment.resource
                    ?.visitReason ||
                    "Not provided"}
                </p>

              </div>

              {/* Payment */}
              <div className="pt-4 border-t">

                <h4 className="font-medium mb-2">
                  Payment
                </h4>

                <p className="text-sm text-gray-600">
                  {selectedAppointment.resource
                    ?.payment?.status ||
                    "Not available"}
                </p>

              </div>

              {/* Actions */}
              <DialogFooter>

                {selectedAppointment.resource
                  ?.appointmentType ===
                  "TELEMEDICINE" && (
                    <Button className="bg-customTeal">

                      <VideoIcon className="h-4 w-4 mr-2" />

                      Join Call

                    </Button>
                  )}

                <Button
                  variant="outline"
                  onClick={openReschedule}
                >
                  Reschedule
                </Button>

                <Button variant="destructive">
                  Cancel Appointment
                </Button>

              </DialogFooter>

            </div>
          )}

        </DialogContent>

      </Dialog>

      <Dialog
        open={rescheduleOpen}
        onOpenChange={setRescheduleOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              Reschedule Appointment
            </DialogTitle>

            <DialogDescription>
              Select a new date and available time.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                New Date
              </label>

              <Input
                type="date"
                value={rescheduleDate}
                min={
                  new Date()
                    .toISOString()
                    .split("T")[0]
                }
                onChange={async (e) => {
                  const date = e.target.value;

                  setRescheduleDate(date);

                  if (date) {
                    await loadRescheduleSlots(
                      date
                    );
                  }
                }}
              />
            </div>

            {rescheduleDate && (
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Available Time
                </label>

                {rescheduleSlots.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    No available slots for this date.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {rescheduleSlots.map(
                      (slot) => (
                        <Button
                          key={slot.startTime}
                          type="button"
                          variant={
                            selectedRescheduleTime ===
                              slot.startTime
                              ? "default"
                              : "outline"
                          }
                          className={
                            selectedRescheduleTime ===
                              slot.startTime
                              ? "bg-customTeal"
                              : ""
                          }
                          onClick={() =>
                            setSelectedRescheduleTime(
                              slot.startTime
                            )
                          }
                        >
                          {slot.startTime} -{" "}
                          {slot.endTime}
                        </Button>
                      )
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setRescheduleOpen(false)
              }
              disabled={rescheduleLoading}
            >
              Cancel
            </Button>

            <Button
              className="bg-customTeal"
              onClick={handleReschedule}
              disabled={
                rescheduleLoading ||
                !rescheduleDate ||
                !selectedRescheduleTime
              }
            >
              {rescheduleLoading
                ? "Rescheduling..."
                : "Confirm Reschedule"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}