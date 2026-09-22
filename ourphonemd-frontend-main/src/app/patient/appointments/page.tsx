/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect } from 'react';
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
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useAppointments } from '@/hooks/useAppointments';
import { Skeleton } from '@/components/ui/skeleton';
import { AppointmentStatus, AppointmentType } from '@/types/appoiment';

export default function AppointmentsPage() {
  const { appointments, loading, getAllAppointments } = useAppointments();

  useEffect(() => {
    getAllAppointments();
  }, []);



  const getStatusBadge = (status: AppointmentStatus) => {
    switch(status) {
      case AppointmentStatus.SCHEDULED:
        return <Badge className="bg-green-500">Scheduled</Badge>;
      case AppointmentStatus.COMPLETED:
        return <Badge className="bg-blue-500">Completed</Badge>;
      case AppointmentStatus.CANCELLED:
        return <Badge className="bg-red-500">Cancelled</Badge>;
      case AppointmentStatus.NO_SHOW:
        return <Badge className="bg-yellow-500">No Show</Badge>;
      case AppointmentStatus.RESCHEDULED:
        return <Badge className="bg-purple-500">Rescheduled</Badge>;
      case AppointmentStatus.IN_PROGRESS:
        return <Badge className="bg-orange-500">In Progress</Badge>;
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
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
              <Card key={appointment.id} className="overflow-hidden">
                <div className={`h-2 ${appointment.type === AppointmentType.TELEMEDICINE ? 'bg-customTeal' : 'bg-customTeal'}`}></div>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12 border">
                      <AvatarImage 
                        src={typeof appointment.createdBy === 'string' ? appointment.createdBy : appointment.createdBy?.avatar || ""} 
                        alt={typeof appointment.createdBy === 'string' ? 'User' : appointment.createdBy?.name || 'User'} 
                      />
                      <AvatarFallback>
                        {typeof appointment.createdBy === 'string' 
                          ? 'U' 
                          : appointment.createdBy?.name?.split(' ').map(n => n[0]).join('') || 'U'
                        }
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex justify-between w-full mb-2">
                        <div>
                          <h3 className="font-medium">{appointment.createdBy?.name}</h3>
                          <p className="text-sm text-muted-foreground">{appointment.type}</p>
                        </div>
                        {getStatusBadge(appointment.status || AppointmentStatus.SCHEDULED)}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-y-2 text-sm mt-3">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{format(new Date(appointment.createdAt), 'EEE, MMM d, yyyy')}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{appointment.startTime} - {appointment.endTime}</span>
                        </div>
                        
                        <div className="flex items-center">
                          {appointment.type === AppointmentType.TELEMEDICINE ? (
                            <>
                              <VideoIcon className="h-4 w-4 mr-2 text-customTeal" />
                              <span>Video Call</span>
                            </>
                          ) : (
                            <>
                              <MapPin className="h-4 w-4 mr-2 text-customTeal" />
                              <span>{appointment.roomId || 'Main Clinic'}</span>
                            </>
                          )}
                        </div>
                        
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{appointment?.patient?.firstName || 'Self'}</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 mt-4">
                        {appointment.type === AppointmentType.TELEMEDICINE && (
                          <Button size="sm" className="bg-customTeal hover:bg-customTeal/80">
                            <VideoIcon className="h-4 w-4 mr-2" />
                            Join Call
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
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
    </div>
  );
}