"use client";

import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
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

import { Textarea } from "@/components/ui/textarea";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Label } from "@/components/ui/label";

import { useForm } from "react-hook-form";

import {
  AppointmentType,
} from "@/types/appoiment";

import {
  useAppointments,
} from "@/hooks/useAppointments";

import {
  useFamilyMember,
} from "@/hooks/useFamilyMember";

interface AppointmentFormValues {
  appointmentType: string;
  patientType: "self" | "family";
  familyMemberId: string;
  doctorId: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  reason: string;
}

const appointmentTypes = [
  {
    value: "SCHEDULED",
    label: "Scheduled",
  },
  {
    value: "EMERGENCY",
    label: "Emergency",
  },
];

export default function NewAppointmentPage() {
  const router = useRouter();

  const {
    createAppointment,
    getAvailableDoctors,
    getAvailableAppointmentSlots,
  } = useAppointments();

  const {
    familyMembers,
    getAllFamilyMembers,
  } = useFamilyMember();

  const [step, setStep] = useState(1);

  const [doctors, setDoctors] = useState<any[]>([]);

  const [availableSlots, setAvailableSlots] = useState<any[]>([]);

  const [loadingDoctors, setLoadingDoctors] = useState(false);

  const [loadingSlots, setLoadingSlots] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const form = useForm<AppointmentFormValues>({
    defaultValues: {
      appointmentType: "SCHEDULED",
      patientType: "self",
      familyMemberId: "",
      doctorId: "",
      appointmentDate: "",
      startTime: "",
      endTime: "",
      reason: "",
    },
  });

  const patientType = form.watch("patientType");
  const doctorId = form.watch("doctorId");
  const appointmentDate = form.watch("appointmentDate");
  const selectedSlot = form.watch("startTime");

  // --------------------------------------------------
  // Load doctors + family members
  // --------------------------------------------------

  useEffect(() => {
    const loadInitialData = async () => {
      setLoadingDoctors(true);

      try {
        const doctorData = await getAvailableDoctors();

        setDoctors(Array.isArray(doctorData) ? doctorData : []);

        await getAllFamilyMembers();
      } catch (error) {
        console.error("Error loading appointment data:", error);
        toast.error("Failed to load appointment information.");
      } finally {
        setLoadingDoctors(false);
      }
    };

    loadInitialData();
  }, []);

  // --------------------------------------------------
  // Load slots when doctor + date are selected
  // --------------------------------------------------

  useEffect(() => {
    const loadSlots = async () => {
      if (!doctorId || !appointmentDate) {
        setAvailableSlots([]);
        return;
      }

      setLoadingSlots(true);

      try {
        const slots = await getAvailableAppointmentSlots(
          doctorId,
          appointmentDate
        );

        setAvailableSlots(
          Array.isArray(slots)
            ? slots.filter((slot: any) => slot.available !== false)
            : []
        );

        form.setValue("startTime", "");
        form.setValue("endTime", "");
      } catch (error) {
        console.error("Error loading appointment slots:", error);
        setAvailableSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };

    loadSlots();
  }, [doctorId, appointmentDate]);

  // --------------------------------------------------
  // Select slot
  // --------------------------------------------------

  const handleSlotChange = (startTime: string) => {
    form.setValue("startTime", startTime);

    const selected = availableSlots.find(
      (slot: any) => slot.startTime === startTime
    );

    if (selected) {
      form.setValue("endTime", selected.endTime);
    }
  };

  // --------------------------------------------------
  // Step validation
  // --------------------------------------------------

  const nextStep = async () => {
    if (step === 1) {
      const valid = await form.trigger([
        "appointmentType",
        "patientType",
      ]);

      if (!valid) return;

      if (
        patientType === "family" &&
        !form.getValues("familyMemberId")
      ) {
        toast.error("Please select a family member.");
        return;
      }

      setStep(2);
      return;
    }

    if (step === 2) {
      const valid = await form.trigger([
        "doctorId",
        "appointmentDate",
        "startTime",
        "reason",
      ]);

      if (!valid) return;

      if (!form.getValues("endTime")) {
        toast.error("Please select an available time slot.");
        return;
      }

      setStep(3);
      return;
    }

    setStep(step + 1);
  };

  const previousStep = () => {
    setStep((current) => Math.max(1, current - 1));
  };

  // --------------------------------------------------
  // Submit appointment
  // --------------------------------------------------

  const handleSubmit = async () => {
    const values = form.getValues();

    if (!values.doctorId) {
      toast.error("Please select a doctor.");
      return;
    }

    if (!values.appointmentDate) {
      toast.error("Please select an appointment date.");
      return;
    }

    if (!values.startTime || !values.endTime) {
      toast.error("Please select an available time slot.");
      return;
    }

    if (!values.reason.trim()) {
      toast.error("Please enter the reason for the visit.");
      return;
    }

    setSubmitting(true);

    try {
      const appointmentData = {
        doctorId: values.doctorId,
        appointmentType: values.appointmentType,
        appointmentDate: values.appointmentDate,
        startTime: values.startTime,
        visitReason: values.reason.trim(),
        ...(values.patientType === "family" &&
          values.familyMemberId
          ? {
            familyMemberId:
              values.familyMemberId,
          }
          : {}),
      };

      await createAppointment(appointmentData);

      toast.success("Appointment booked successfully.");

      router.push("/patient/appointments");
    } catch (error: any) {
      console.error("Appointment creation failed:", error);

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to book appointment. Please try again.";

      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  // --------------------------------------------------
  // Family member display helper
  // --------------------------------------------------

  const getFamilyMemberName = (member: any) => {
    if (member.name) return member.name;

    return [
      member.firstName,
      member.middleName,
      member.lastName,
    ]
      .filter(Boolean)
      .join(" ");
  };

  // --------------------------------------------------
  // Doctor display helper
  // --------------------------------------------------

  const getDoctorName = (doctor: any) => {
    return doctor.username || doctor.name || "Doctor";
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <Link
          href="/patient/appointments"
          className="flex items-center text-gray-600 hover:text-customTeal"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          <span>Back to Appointments</span>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-customTeal">
            Book an Appointment
          </CardTitle>

          <CardDescription>
            Select a doctor, date and available appointment time.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Step indicator */}

          <div className="flex items-center mb-8">
            {[1, 2, 3].map((number) => (
              <React.Fragment key={number}>
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= number
                    ? "bg-customTeal text-white"
                    : "bg-gray-200 text-gray-500"
                    }`}
                >
                  {number}
                </div>

                {number < 3 && (
                  <div
                    className={`h-1 flex-1 mx-2 ${step > number
                      ? "bg-customTeal"
                      : "bg-gray-200"
                      }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          <Form {...form}>
            <form
              onSubmit={(event) => {
                event.preventDefault();

                if (step < 3) {
                  nextStep();
                } else {
                  handleSubmit();
                }
              }}
              className="space-y-6"
            >
              {/* -------------------------------- */}
              {/* STEP 1 */}
              {/* -------------------------------- */}

              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold">
                    Appointment Type & Patient
                  </h2>

                  <FormField
                    control={form.control}
                    name="appointmentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Appointment Type
                        </FormLabel>

                        <FormControl>
                          <RadioGroup
                            value={field.value}
                            onValueChange={field.onChange}
                            className="grid grid-cols-1 md:grid-cols-3 gap-3"
                          >
                            {appointmentTypes.map((type) => (
                              <div
                                key={type.value}
                                className="flex items-center space-x-2 border rounded-lg p-4"
                              >
                                <RadioGroupItem
                                  value={type.value}
                                  id={type.value}
                                />

                                <Label
                                  htmlFor={type.value}
                                  className="cursor-pointer"
                                >
                                  {type.label}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="patientType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Appointment For
                        </FormLabel>

                        <FormControl>
                          <RadioGroup
                            value={field.value}
                            onValueChange={(value) => {
                              field.onChange(value);

                              if (value === "self") {
                                form.setValue(
                                  "familyMemberId",
                                  ""
                                );
                              }
                            }}
                            className="flex gap-6"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="self"
                                id="patient-self"
                              />

                              <Label htmlFor="patient-self">
                                Myself
                              </Label>
                            </div>

                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="family"
                                id="patient-family"
                              />

                              <Label htmlFor="patient-family">
                                Family Member
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {patientType === "family" && (
                    <FormField
                      control={form.control}
                      name="familyMemberId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Select Family Member
                          </FormLabel>

                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select family member" />
                              </SelectTrigger>
                            </FormControl>

                            <SelectContent>
                              {familyMembers.length === 0 ? (
                                <SelectItem
                                  value="none"
                                  disabled
                                >
                                  No family members found
                                </SelectItem>
                              ) : (
                                familyMembers.map(
                                  (member: any) => {
                                    const id =
                                      member.id ||
                                      member._id;

                                    return (
                                      <SelectItem
                                        key={id}
                                        value={id}
                                      >
                                        {getFamilyMemberName(
                                          member
                                        )}
                                      </SelectItem>
                                    );
                                  }
                                )
                              )}
                            </SelectContent>
                          </Select>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              )}

              {/* -------------------------------- */}
              {/* STEP 2 */}
              {/* -------------------------------- */}

              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold">
                    Doctor & Visit Details
                  </h2>

                  <FormField
                    control={form.control}
                    name="doctorId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Doctor
                        </FormLabel>

                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={loadingDoctors}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={
                                  loadingDoctors
                                    ? "Loading doctors..."
                                    : "Select a doctor"
                                }
                              />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                            {doctors.length === 0 ? (
                              <SelectItem
                                value="none"
                                disabled
                              >
                                No doctors available
                              </SelectItem>
                            ) : (
                              doctors.map((doctor: any) => (
                                <SelectItem
                                  key={doctor.doctorId}
                                  value={doctor.doctorId}
                                >
                                  {getDoctorName(doctor)}
                                  {doctor.mobile
                                    ? ` - ${doctor.mobile}`
                                    : ""}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="appointmentDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Appointment Date
                        </FormLabel>

                        <FormControl>
                          <input
                            type="date"
                            min={
                              new Date()
                                .toISOString()
                                .split("T")[0]
                            }
                            {...field}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Available Time
                        </FormLabel>

                        <Select
                          value={field.value}
                          onValueChange={handleSlotChange}
                          disabled={
                            !doctorId ||
                            !appointmentDate ||
                            loadingSlots
                          }
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={
                                  loadingSlots
                                    ? "Loading available slots..."
                                    : !doctorId
                                      ? "Select a doctor first"
                                      : !appointmentDate
                                        ? "Select a date first"
                                        : "Select an available time"
                                }
                              />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                            {availableSlots.length === 0 ? (
                              <SelectItem
                                value="none"
                                disabled
                              >
                                No available slots
                              </SelectItem>
                            ) : (
                              availableSlots.map(
                                (slot: any) => (
                                  <SelectItem
                                    key={`${slot.startTime}-${slot.endTime}`}
                                    value={slot.startTime}
                                  >
                                    {slot.startTime} -{" "}
                                    {slot.endTime}
                                  </SelectItem>
                                )
                              )
                            )}
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="reason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Reason for Visit
                        </FormLabel>

                        <FormControl>
                          <Textarea
                            placeholder="Describe the reason for your visit"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* -------------------------------- */}
              {/* STEP 3 */}
              {/* -------------------------------- */}

              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold">
                    Confirm Appointment
                  </h2>

                  <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">
                        Appointment Type
                      </p>

                      <p className="font-medium">
                        {form.getValues(
                          "appointmentType"
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Appointment For
                      </p>

                      <p className="font-medium">
                        {patientType === "self"
                          ? "Myself"
                          : getFamilyMemberName(
                            familyMembers.find(
                              (member: any) =>
                                (member.id ||
                                  member._id) ===
                                form.getValues(
                                  "familyMemberId"
                                )
                            ) || {}
                          )}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Doctor
                      </p>

                      <p className="font-medium">
                        {getDoctorName(
                          doctors.find(
                            (doctor: any) =>
                              doctor.doctorId ===
                              form.getValues("doctorId")
                          ) || {}
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Date
                      </p>

                      <p className="font-medium">
                        {form.getValues(
                          "appointmentDate"
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Time
                      </p>

                      <p className="font-medium">
                        {selectedSlot} -{" "}
                        {form.getValues("endTime")}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Reason
                      </p>

                      <p className="font-medium">
                        {form.getValues("reason")}
                      </p>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 bg-blue-50">
                    <p className="text-sm text-blue-800">
                      Online payment is not included in this
                      step because the backend payment service is
                      not currently configured.
                    </p>
                  </div>
                </div>
              )}

              {/* -------------------------------- */}
              {/* Navigation */}
              {/* -------------------------------- */}

              <div className="flex justify-between pt-6 border-t">
                {step > 1 ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={previousStep}
                    disabled={submitting}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                ) : (
                  <div />
                )}

                {step < 3 ? (
                  <Button
                    type="submit"
                    className="bg-customTeal"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="bg-customTeal"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Booking...
                      </>
                    ) : (
                      "Confirm Appointment"
                    )}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}