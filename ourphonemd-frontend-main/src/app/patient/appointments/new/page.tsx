"use client";

import React, { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { 
  ChevronLeft, 
  ChevronRight, 
  CreditCard,
  CheckCircle2,
  XCircle,
  Loader2
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppointments } from '@/hooks/useAppoiments';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Label } from "@/components/ui/label";
import Link from 'next/link';
import { AppointmentType, BookAppoimentFormValues } from '@/types/appoiment';
import { CreateAppointmentRequest } from '@/types/appoiment';
import { appoimentFormSchema } from '@/schema/appoiment';



// Family members data
const familyMembers = [
  { id: "1", name: "John Smith", relationship: "Spouse" },
  { id: "2", name: "Emma Smith", relationship: "Child" },
  { id: "3", name: "Michael Adrew", relationship: "Son" },
];



// Add payment status type
type PaymentStatus = 'idle' | 'processing' | 'success' | 'failed';

// Add appointment prices
const appointmentPrices = {
  [AppointmentType.CONSULTATION]: {
    video: 150,
    inPerson: 200
  },
  [AppointmentType.CHECKUP]: {
    video: 200,
    inPerson: 250
  },
  [AppointmentType.FOLLOW_UP]: {
    video: 150,
    inPerson: 200
  },
  [AppointmentType.PROCEDURE]: {
    video: 300,
    inPerson: 350
  },
  [AppointmentType.EMERGENCY]: {
    video: 400,
    inPerson: 450
  },
  [AppointmentType.TELEMEDICINE]: {
    video: 150,
    inPerson: 200
  },
  [AppointmentType.LAB_WORK]: {
    video: 100,
    inPerson: 150
  }
};

export default function NewAppointmentPage() {
  const router = useRouter();
  const { createAppointment, getAvailableAppointmentSlots } = useAppointments();
  const [step, setStep] = useState(1);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  
  // Initialize the form with proper typing
  const form = useForm<BookAppoimentFormValues>({
    resolver: zodResolver(appoimentFormSchema) as any,
    defaultValues: {
      doctorId: "",
      startTime: "",
      appointmentType: AppointmentType.CONSULTATION,
      patientId: "self",
      reason: "",
      symptoms: "",
      medications: "",
      notes: "",
      isVideoCall: true,
      roomId: "",
      cardNumber: "",
      cardName: "",
      expiryDate: "",
      cvv: "",
    },
  });
  
  // Fetch available slots when appointment type changes
  useEffect(() => {
    const fetchSlots = async () => {
      const slots = await getAvailableAppointmentSlots(form.getValues("appointmentType"));
      setAvailableSlots(slots);
    };
    fetchSlots();
  }, [form, getAvailableAppointmentSlots]);

  // Function to handle form submission
  const onSubmit = async (data: BookAppoimentFormValues) => {
    try {
      const appointmentData: CreateAppointmentRequest = {
        doctorId: data.doctorId,
        startTime: data.startTime,
        appointmentType: data.appointmentType,
        patientId: data.patientId,
        reason: data.reason,
      };

      await createAppointment(appointmentData);
      toast.success("Appointment booked successfully!");
      router.push("/patient/appointments");
    } catch (err) {
      toast.error("Failed to book appointment. Please try again.");
      console.error("Error booking appointment:", err);
    }
  };
  
  // Watch for changes to form values
  const appointmentType = form.watch("appointmentType");
  const patientType = form.watch("patientId");
  
  // Handle patient selection change
  const handlePatientChange = (value: string) => {
    if (value === "family" && familyMembers.length > 0) {
      form.setValue("patientId", familyMembers[0].id);
    } else {
      form.setValue("patientId", "self");
    }
  };
  
  // Handle family member selection change
  const handleFamilyMemberChange = (value: string) => {
    form.setValue("patientId", value);
  };
  
  // Function to move to the next step
  const nextStep = async () => {
    // Validate current step
    if (step === 1) {
      const isValid = await form.trigger(["appointmentType", "patientId"]);
      if (!isValid) return;
    } else if (step === 2) {
      const isValid = await form.trigger(["startTime", "reason"]);
      if (!isValid) return;
    }
    
    setStep(step + 1);
  };
  
  // Function to go to the previous step
  const prevStep = () => {
    setStep(step - 1);
  };

  // Function to handle payment
  const handlePayment = async () => {
    setPaymentStatus('processing');
    try {
      await form.handleSubmit(onSubmit)();
      setPaymentStatus('success');
    } catch {
      setPaymentStatus('failed');
      toast.error("Payment failed. Please try again.");
    }
  };

  // Calculate appointment price
  const calculatePrice = () => {
    const type = form.getValues("appointmentType");
    const isVideo = form.getValues("isVideoCall");
    return appointmentPrices[type][isVideo ? "video" : "inPerson"];
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
          <CardTitle className="text-2xl font-bold text-customTeal">Book an Appointment</CardTitle>
          <CardDescription>Complete the form below to schedule your appointment</CardDescription>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Step indicator */}
              <div className="flex items-center mb-6">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-customTeal text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
                <div className={`h-1 flex-1 mx-2 ${step >= 2 ? 'bg-customTeal' : 'bg-gray-200'}`}></div>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-customTeal text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
                <div className={`h-1 flex-1 mx-2 ${step >= 3 ? 'bg-customTeal' : 'bg-gray-200'}`}></div>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? 'bg-customTeal text-white' : 'bg-gray-200 text-gray-500'}`}>3</div>
                <div className={`h-1 flex-1 mx-2 ${step >= 4 ? 'bg-customTeal' : 'bg-gray-200'}`}></div>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 4 ? 'bg-customTeal text-white' : 'bg-gray-200 text-gray-500'}`}>4</div>
              </div>
              
              {/* Step 1: Appointment Type and Patient Selection */}
              {step === 1 && (
                <div className="space-y-5">
                  <h2 className="text-lg font-semibold">Appointment Type &amp; Patient Selection</h2>
                  
                  <FormField
                    control={form.control}
                    name="appointmentType"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Appointment Type</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value={AppointmentType.CONSULTATION} id="consultation" />
                              <Label htmlFor="consultation" className="text-base cursor-pointer">Consultation</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value={AppointmentType.CHECKUP} id="checkup" />
                              <Label htmlFor="checkup" className="text-base cursor-pointer">Checkup</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value={AppointmentType.FOLLOW_UP} id="followup" />
                              <Label htmlFor="followup" className="text-base cursor-pointer">Follow-up</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="patientId"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Patient</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value) => {
                              field.onChange(value);
                              handlePatientChange(value);
                            }}
                            defaultValue={field.value}
                            className="flex flex-col space-y-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="self" id="self" />
                              <Label htmlFor="self" className="text-base cursor-pointer">Self</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="family" id="family" />
                              <Label htmlFor="family" className="text-base cursor-pointer">Family Member</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {patientType === "family" && (
                    <FormField
                      control={form.control}
                      name="patientId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select Family Member</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              handleFamilyMemberChange(value);
                            }}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a family member" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {familyMembers.map((member) => (
                                <SelectItem key={member.id} value={member.id}>
                                  {member.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              )}
              
              {/* Step 2: Visit Details */}
              {step === 2 && (
                <div className="space-y-5">
                  <h2 className="text-lg font-semibold">Visit Details</h2>
                  
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Time</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a time" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableSlots.map((slot) => (
                              <SelectItem key={slot.time} value={slot.time}>
                                {slot.time}
                              </SelectItem>
                            ))}
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
                        <FormLabel>Reason for Visit</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Please describe your reason for visit" 
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="symptoms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Symptoms (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Please describe any symptoms you're experiencing" 
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="medications"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Medications (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Please list any medications you're currently taking" 
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
              
              {/* Step 3: Confirmation */}
              {step === 3 && (
                <div className="space-y-5">
                  <h2 className="text-lg font-semibold">Appointment Confirmation</h2>
                  
                  <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Appointment Type</p>
                        <p className="font-medium">{appointmentType}</p>
                      </div>
                      
                      <div>
                        <p className="text-gray-500">Patient</p>
                        <p className="font-medium">{patientType === "self" ? "Self" : familyMembers.find(m => m.id === patientType)?.name}</p>
                      </div>
                      
                      <div>
                        <p className="text-gray-500">Date &amp; Time</p>
                        <p className="font-medium">{form.getValues("startTime")}</p>
                      </div>
                      
                      <div>
                        <p className="text-gray-500">Reason for Visit</p>
                        <p className="font-medium">{form.getValues("reason")}</p>
                      </div>
                      
                      <div>
                        <p className="text-gray-500">Symptoms</p>
                        <p className="font-medium">{form.getValues("symptoms")}</p>
                      </div>
                      
                      <div>
                        <p className="text-gray-500">Current Medications</p>
                        <p className="font-medium">{form.getValues("medications")}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Step 4: Payment */}
              {step === 4 && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold">Payment Information</h2>
                  
                  {paymentStatus === 'idle' && (
                    <div className="space-y-6">
                      {/* Appointment Summary */}
                      <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                        <h3 className="font-medium">Appointment Summary</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Appointment Type</p>
                            <p className="font-medium">{appointmentType}</p>
                          </div>
                          
                          <div>
                            <p className="text-gray-500">Patient</p>
                            <p className="font-medium">{patientType === "self" ? "Self" : familyMembers.find(m => m.id === patientType)?.name}</p>
                          </div>
                          
                          <div>
                            <p className="text-gray-500">Date &amp; Time</p>
                            <p className="font-medium">{form.getValues("startTime")}</p>
                          </div>
                          
                          <div>
                            <p className="text-gray-500">Reason for Visit</p>
                            <p className="font-medium">{form.getValues("reason")}</p>
                          </div>
                        </div>
                        
                        <div className="border-t pt-4 mt-4">
                          <div className="flex justify-between text-sm">
                            <span>Appointment Fee</span>
                            <span className="font-medium">${calculatePrice()}</span>
                          </div>
                          <div className="flex justify-between text-sm mt-2">
                            <span>Platform Fee</span>
                            <span className="font-medium">$0.00</span>
                          </div>
                          <div className="border-t pt-2 mt-2">
                            <div className="flex justify-between font-medium">
                              <span>Total</span>
                              <span>${calculatePrice()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Payment Form */}
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="cardNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Card Number</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="1234 5678 9012 3456" 
                                    {...field}
                                    className="font-mono"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="cardName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Cardholder Name</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="John Doe" 
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="expiryDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Expiry Date</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="MM/YY" 
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="cvv"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>CVV</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="123" 
                                    {...field}
                                    className="font-mono"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {paymentStatus === 'processing' && (
                    <div className="text-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-customTeal" />
                      <p className="text-gray-600">Processing your payment...</p>
                    </div>
                  )}
                  
                  {paymentStatus === 'success' && (
                    <div className="text-center py-8">
                      <CheckCircle2 className="h-8 w-8 mx-auto mb-4 text-green-500" />
                      <h3 className="text-lg font-medium mb-2">Payment Successful!</h3>
                      <p className="text-gray-600">Your appointment has been booked successfully.</p>
                    </div>
                  )}
                  
                  {paymentStatus === 'failed' && (
                    <div className="text-center py-8">
                      <XCircle className="h-8 w-8 mx-auto mb-4 text-red-500" />
                      <h3 className="text-lg font-medium mb-2">Payment Failed</h3>
                      <p className="text-gray-600">There was an error processing your payment. Please try again.</p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                {step > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                )}
                
                {step < 4 ? (
                  <Button
                    type="button"
                    className="bg-customTeal"
                    onClick={nextStep}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    className="bg-customTeal"
                    onClick={handlePayment}
                    disabled={paymentStatus === 'processing'}
                  >
                    {paymentStatus === 'processing' ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Pay ${calculatePrice()}
                      </>
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