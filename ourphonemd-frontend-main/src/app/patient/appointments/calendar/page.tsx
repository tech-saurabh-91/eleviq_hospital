"use client";

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {  
  Clock, 
  Search, 
  Filter, 
  UserRound, 
  VideoIcon, 
  Plus,
  MapPin,
  Calendar as CalendarIconSolid,
  ChevronLeft
} from 'lucide-react';
import Link from 'next/link';
import { useAppointments } from '@/hooks/useAppointments';
import { toast } from 'sonner';
import { AppointmentType, AppointmentStatus } from '@/types/appoiment';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Custom event component for the calendar
const EventComponent = ({ event }: { event: any }) => {
  return (
    <div className="flex flex-col h-full p-1 overflow-hidden">
      <div className="text-xs font-medium truncate">{event.title}</div>
      <div className="text-xs text-gray-500 truncate">
        {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
      </div>
      {event.isVideo && (
        <div className="flex items-center mt-1">
          <VideoIcon className="h-3 w-3 text-customTeal mr-1" />
          <span className="text-xs">Video</span>
        </div>
      )}
    </div>
  );
};

export default function AppointmentsCalendarPage() {
  const { appointments, error, getAllAppointments } = useAppointments();
  const [selectedView, setSelectedView] = useState('month');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [filterType, setFilterType] = useState('all');
  
  useEffect(() => {
    getAllAppointments();
  }, [getAllAppointments]);

  if (error) {
    toast.error(error);
  }
  
  // Event handlers
  const handleViewChange = (view: string) => {
    setSelectedView(view);
  };
  
  const handleSelectEvent = useCallback((event: any) => {
    setSelectedAppointment(event);
  }, []);
  
  const handleFilterChange = (value: string) => {
    setFilterType(value);
  };
  
  // Transform appointments for calendar view
  const calendarEvents = useMemo(() => {
    return appointments.map(appointment => ({
      id: appointment.id,
      title: appointment.title,
      start: new Date(`${appointment.startTime}T${appointment.startTime}`),
      end: new Date(`${appointment.endTime}T${appointment.endTime}`),
      patient: appointment.patient?.firstName || 'Self',
      doctor: appointment.createdBy?.name || 'Unknown Doctor',
      doctorAvatar: appointment.createdBy?.avatar || '',
      appointmentType: appointment.type || AppointmentType.CHECKUP,
      location: appointment.roomId || 'Virtual',
      isVideo: appointment.type === AppointmentType.TELEMEDICINE,
      status: appointment.status || AppointmentStatus.SCHEDULED,
      complaint: appointment.symptoms || '',
    }));
  }, [appointments]);
  
  // Filter appointments based on search query and filter type
  const filteredAppointments = useMemo(() => {
    return calendarEvents.filter(appointment => {
      const matchesSearch = 
        appointment?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appointment.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appointment.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appointment.complaint.toLowerCase().includes(searchQuery.toLowerCase());
        
      const matchesFilter = 
        filterType === 'all' || 
        (filterType === 'video' && appointment.isVideo) ||
        (filterType === 'in-person' && !appointment.isVideo) ||
        filterType === appointment.appointmentType;
        
      return matchesSearch && matchesFilter;
    });
  }, [calendarEvents, searchQuery, filterType]);
  
  // Get appointment status badge style
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
      <div className="mb-6">
        <Link 
          href="/patient/appointments" 
          className="flex items-center text-gray-600 hover:text-customTeal"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          <span>Back to Appointments</span>
        </Link>
      </div>
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
          <p className="text-gray-500 mt-1">View, schedule and manage your healthcare appointments</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search appointments..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select value={filterType} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by type" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Appointments</SelectItem>
              <SelectItem value="video">Video Appointments</SelectItem>
              <SelectItem value="in-person">In-person Appointments</SelectItem>
              <SelectItem value="regular">Regular Checkup</SelectItem>
              <SelectItem value="adhd-followup">ADHD Follow-up</SelectItem>
              <SelectItem value="anxiety">Anxiety Treatment</SelectItem>
              <SelectItem value="depression">Depression Treatment</SelectItem>
            </SelectContent>
          </Select>
          
          <Link href="/patient/appointments/new">
            <Button className="w-full bg-customTeal sm:w-auto">
              <Plus className="h-4 text-white w-4 mr-2" />
              New Appointment
            </Button>
          </Link>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Appointment Calendar</CardTitle>
            <div className="flex gap-2">
              <Button
                variant={selectedView === 'month' ? 'default' : 'outline'}
                onClick={() => handleViewChange('month')}
                className={selectedView === 'month' ? 'bg-customTeal' : ''}
              >
                Month
              </Button>
              <Button
                variant={selectedView === 'week' ? 'default' : 'outline'}
                onClick={() => handleViewChange('week')}
                className={selectedView === 'week' ? 'bg-customTeal' : ''}
              >
                Week
              </Button>
              <Button
                variant={selectedView === 'day' ? 'default' : 'outline'}
                onClick={() => handleViewChange('day')}
                className={selectedView === 'day' ? 'bg-customTeal' : ''}
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
                event: EventComponent
              }}
              eventPropGetter={(event) => ({
                className: `${
                  event.isVideo ? 'bg-customTeal/10 border-customTeal' : 'bg-blue-50 border-blue-200'
                } border rounded-md`
              })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Appointment Details Dialog */}
      <Dialog open={!!selectedAppointment} onOpenChange={() => setSelectedAppointment(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
            <DialogDescription>
              View and manage your appointment details
            </DialogDescription>
          </DialogHeader>
          
          {selectedAppointment && (
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={selectedAppointment.doctorAvatar} alt={selectedAppointment.doctor} />
                  <AvatarFallback>{selectedAppointment.doctor.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{selectedAppointment.doctor}</h3>
                  <p className="text-sm text-gray-500">{selectedAppointment.appointmentType}</p>
                  {getStatusBadge(selectedAppointment.status as AppointmentStatus)}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center">
                  <CalendarIconSolid className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{format(selectedAppointment.start, 'EEE, MMM d, yyyy')}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{format(selectedAppointment.start, 'h:mm a')}</span>
                </div>
                <div className="flex items-center">
                  <UserRound className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{selectedAppointment.patient}</span>
                </div>
                <div className="flex items-center">
                  {selectedAppointment.isVideo ? (
                    <>
                      <VideoIcon className="h-4 w-4 mr-2 text-customTeal" />
                      <span>Video Call</span>
                    </>
                  ) : (
                    <>
                      <MapPin className="h-4 w-4 mr-2 text-customTeal" />
                      <span>{selectedAppointment.location}</span>
                    </>
                  )}
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Primary Complaint</h4>
                <p className="text-sm text-gray-600">{selectedAppointment.complaint}</p>
              </div>
              
              <DialogFooter>
                {selectedAppointment.isVideo && (
                  <Button className="bg-customTeal">
                    <VideoIcon className="h-4 w-4 mr-2" />
                    Join Call
                  </Button>
                )}
                <Button variant="outline">Reschedule</Button>
                <Button variant="destructive">Cancel Appointment</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 