"use client";

import React from 'react';
import { Calendar, Users, FileText, Clock, Briefcase } from 'lucide-react';
import Link from 'next/link';
import DashboardCard from '@/components/reuseable-cards/PatientDashboardCard';


const PatientHome = () => {
  
  const dashboardData = {
    upcomingAppointments: 3,
    familyMembers: 2,
    previousVisits: 8,
    walkInAppointments: 1,
    workSchoolNotes: 2
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-customTeal">Patient Dashboard</h1>
      
      {/* Dashboard Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <DashboardCard 
          icon={<Calendar className="w-6 h-6" />} 
          title="Upcoming Appointments" 
          count={dashboardData.upcomingAppointments}
          linkTo="/patient/appointments"
          color="bg-customTeal"
        />
        <DashboardCard 
          icon={<Users className="w-6 h-6" />} 
          title="My Family" 
          count={dashboardData.familyMembers}
          linkTo="/patient/family-member"
          color="bg-blue-500"
        />
        <DashboardCard 
          icon={<FileText className="w-6 h-6" />} 
          title="Previous Visits" 
          count={dashboardData.previousVisits}
          linkTo="/patient/visits"
          color="bg-purple-500"
        />
        <DashboardCard 
          icon={<Clock className="w-6 h-6" />} 
          title="Walk-in Appointments" 
          count={dashboardData.walkInAppointments}
          linkTo="/patient/walkin"
          color="bg-amber-500"
        />
        <DashboardCard 
          icon={<Briefcase className="w-6 h-6" />} 
          title="Work/School Notes" 
          count={dashboardData.workSchoolNotes}
          linkTo="/patient/notes"
          color="bg-emerald-500"
        />
        <div className="bg-gradient-to-br from-customTeal to-blue-400 rounded-xl shadow-sm p-6 text-white flex flex-col justify-between">
          <p className="text-lg font-semibold">Need assistance?</p>
          <p className="text-sm opacity-90 mb-4">Our support team is available 24/7</p>
          <Link 
            href="/patient/support"
            className="bg-white text-customTeal py-2 px-4 rounded-md text-sm font-medium hover:bg-opacity-90 transition-colors self-start"
          >
            Contact Support
          </Link>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="bg-customTeal/10 p-4 border-b">
          <h2 className="text-lg font-semibold text-customTeal">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-2  divide-y sm:divide-y-0 sm:divide-x">
          <Link href="/patient/appointments/new" className="p-4 hover:bg-gray-50 transition-colors flex items-center gap-3">
            <Calendar className="text-customTeal w-5 h-5" />
            <span>Book New Appointment</span>
          </Link>
          <Link href="/patient/family-member/new" className="p-4 hover:bg-gray-50 transition-colors flex items-center gap-3">
            <Users className="text-customTeal w-5 h-5" />
            <span>Add Family Member</span>
          </Link>
         
        </div>
      </div>
    </div>
  );
};


export default PatientHome;
