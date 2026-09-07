"use client";

import React from 'react';
import { notFound, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CalendarClock, CalendarCheck, User, Phone, Mail, CreditCard, Edit, Clock, Calendar, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Appointment, AppointmentStatus, AppointmentType } from '@/types/appoiment';
import { FamilyMember } from '@/types/familymember';

// Corrected FamilyMember data
const familyMembers: FamilyMember[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@example.com",
    phoneNumber: "555-123-4567",
    dateOfBirth: "1985-06-15",
    gender: "Male",
    relationship: "Father",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "2",
    firstName: "Emma",
    lastName: "Smith",
    email: "emma@gmail.com",
    phoneNumber: "555-987-6543",
    dateOfBirth: "2015-03-22",
    gender: "Female",
    relationship: "Child",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  }
];

// Corrected Appointment data using proper enums
const memberAppointments: Record<string, Appointment[]> = {
  "1": [
    {
      id: "a1",
      patientId: "1",
      doctorId: "d1",
      startTime: "2024-05-15T10:30:00Z",
      endTime: "2024-05-15T11:00:00Z",
      status: AppointmentStatus.SCHEDULED,
      type: AppointmentType.CHECKUP,
      reason: "General Checkup",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
      title: "General Checkup with Dr. Sarah Johnson"
    },
    {
      id: "a2",
      patientId: "1",
      doctorId: "d2",
      startTime: "2024-04-10T14:00:00Z",
      endTime: "2024-04-10T14:30:00Z",
      status: AppointmentStatus.COMPLETED,
      type: AppointmentType.CONSULTATION,
      reason: "Dental Cleaning",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
      title: "Dental Cleaning with Dr. Michael Chen"
    }
  ],
  "2": [
    {
      id: "a6",
      patientId: "2",
      doctorId: "d3",
      startTime: "2024-04-05T13:30:00Z",
      endTime: "2024-04-05T14:00:00Z",
      status: AppointmentStatus.COMPLETED,
      type: AppointmentType.CHECKUP,
      reason: "Pediatric Checkup",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
      title: "Pediatric Checkup with Dr. Robert Garcia"
    }
  ]
};

export default function FamilyMemberDetailsPage() {
    const params = useParams()


  // Find the member by ID
  const member = familyMembers.find(m => m.id === params.id);
  
  // If member not found, show 404 page
  if (!member) {
    notFound();
  }
  
  // Get appointments for this member
  const appointments = memberAppointments[member.id] || [];
  const upcomingAppointments = appointments.filter(app => 
    app.status === AppointmentStatus.SCHEDULED || 
    app.status === AppointmentStatus.IN_PROGRESS
  );
  const pastAppointments = appointments.filter(app => 
    app.status === AppointmentStatus.COMPLETED
  );
  


  return (
    <div className="space-y-6">
      {/* Back button and header actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/patient/family-member">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold text-customTeal">{member?.firstName}</h1>
          <Badge className="ml-2 bg-blue-100 text-blue-700">{member.relationship}</Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" className="text-customTeal border-customTeal" asChild>
            <Link href={`/patient/family-member/${member.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Link>
          </Button>
          
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Profile info */}
        <div className="space-y-4">
          {/* Profile card */}
          <Card>
            <CardHeader className="bg-customTeal/5 pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">Personal Information</CardTitle>
                  <CardDescription>Basic details and contact information</CardDescription>
                </div>
                <div className="bg-customTeal/20 p-3 rounded-full">
                  <User className="h-6 w-6 text-customTeal" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <div>
                  <p className="text-sm text-gray-500">Date of Birth</p>
                  <p className="font-medium">{new Date(member.dateOfBirth).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="font-medium">{member.gender}</p>
                </div>
                {member.phoneNumber && (
                  <div className="col-span-2 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{member.phoneNumber}</p>
                    </div>
                  </div>
                )}
                {member.email && (
                  <div className="col-span-2 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium break-all">{member.email}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Insurance info */}
          <Card>
            <CardHeader className="bg-customTeal/5 pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">Insurance</CardTitle>
                  <CardDescription>Coverage and policy information</CardDescription>
                </div>
                <div className="bg-customTeal/20 p-3 rounded-full">
                  <CreditCard className="h-6 w-6 text-customTeal" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {member?.insurance?.hasInsurance ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Status</p>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Insured</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Provider</p>
                    <p className="font-medium">{member?.insurance.provider}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Policy Number</p>
                    <p className="font-medium">{member?.insurance.policyNumber}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 mx-auto">No Insurance</Badge>
                  <p className="mt-4 text-sm text-gray-500">This family member has no insurance information on file.</p>
                  <Button variant="outline" className="mt-4 text-customTeal" size="sm" asChild>
                    <Link href={`/patient/family-member/${member.id}/add-insurance`}>
                      Add Insurance
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Quick actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 divide-y">
                <Link href="/patient/appointments/new" className="p-4 hover:bg-gray-50 transition-colors flex items-center gap-3">
                  <CalendarClock className="text-customTeal w-4 h-4" />
                  <span>Book Appointment</span>
                </Link>
                <Link href={`/patient/family-member/${member.id}/medical-history`} className="p-4 hover:bg-gray-50 transition-colors flex items-center gap-3">
                  <CalendarCheck className="text-customTeal w-4 h-4" />
                  <span>View Medical History</span>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right column - Appointments */}
        <div className="lg:col-span-2 ">
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="w-full grid grid-cols-2 ">
              <TabsTrigger value="upcoming" className="text-base">
                Upcoming
                {upcomingAppointments.length > 0 && (
                  <Badge className="ml-2 bg-customTeal text-white">{upcomingAppointments.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="past" className="text-base">
                Past Appointments
                {pastAppointments.length > 0 && (
                  <Badge className="ml-2 bg-gray-200 text-gray-700">{pastAppointments.length}</Badge>
                )}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming" className="pt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-customTeal" />
                    Upcoming Appointments
                  </CardTitle>
                  <CardDescription>
                    Scheduled appointments for {member?.firstName}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingAppointments.length > 0 ? (
                      upcomingAppointments.map((appointment) => (
                        <div key={appointment.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <h3 className="font-medium text-lg">{appointment.title}</h3>
                              <p className="text-gray-600">
                                {new Date(appointment.startTime).toLocaleDateString()} at{' '}
                                {new Date(appointment.startTime).toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <p className="font-medium">{appointment?.startTime}</p>
                                <p className="text-sm text-gray-500 flex items-center justify-end">
                                  <Clock className="h-3 w-3 mr-1" /> {appointment?.endTime}
                                </p>
                              </div>
                              <Button size="sm" variant="outline" asChild>
                                <Link href={`/patient/appointments/${appointment.id}`}>
                                  Details
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No upcoming appointments scheduled.</p>
                        <Button className="mt-4 bg-customTeal hover:bg-customTeal/90" asChild>
                          <Link href="/patient/appointments/new">
                            Book New Appointment
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="past" className="pt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                    Past Appointments
                  </CardTitle>
                  <CardDescription>
                    Previous medical visits for {member?.firstName}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pastAppointments.length > 0 ? (
                      pastAppointments.map((appointment) => (
                        <div key={appointment.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <h3 className="font-medium text-lg">{appointment.title}</h3>
                              <p className="text-gray-600">
                                {new Date(appointment.startTime).toLocaleDateString()} at{' '}
                                {new Date(appointment.startTime).toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <p className="font-medium">{appointment.createdAt}</p>
                                <p className="text-sm text-gray-500 flex items-center justify-end">
                                  <Clock className="h-3 w-3 mr-1" /> {appointment.startTime}
                                </p>
                              </div>
                              <Button size="sm" variant="outline" asChild>
                                <Link href={`/patient/appointments/${appointment.id}`}>
                                  Details
                                </Link>
                              </Button>
                            </div>
                          </div>
                          <Separator className="my-3" />
                          <div className="text-right">
                            <Button size="sm" variant="link" className="text-customTeal px-0" asChild>
                              <Link href={`/patient/documents/visit-${appointment.id}`}>
                                View Documents
                              </Link>
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No past appointments found.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
           
    </div>
  );
}