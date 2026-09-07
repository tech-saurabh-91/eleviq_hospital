"use client"
import React from 'react'
import { CardHeader, Card, CardContent, CardFooter, CardTitle } from '../ui/card'
import {  User, Calendar, Phone, Mail, CreditCard, Shield, ChevronRight } from 'lucide-react'
import { Badge } from '../ui/badge'
import Link from 'next/link'
import { Button } from '../ui/button'

const FamilyMemberCard = ({ member }: any) => {
  return (
    <Card className="overflow-hidden w-full h-full transition-all hover:shadow-lg border-gray-200 bg-white">
      <CardHeader className="bg-customTeal/5 pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <div className="bg-customTeal/20 p-2.5 rounded-full flex-shrink-0">
              <User className="h-5 w-5 text-customTeal" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-base font-semibold text-gray-900 line-clamp-1">{member.name}</CardTitle>
              <p className="text-xs text-gray-500 mt-0.5">{member.relationship}</p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="flex items-start gap-2">
            <Calendar className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500">Date of Birth</p>
              <p className="font-medium text-sm text-gray-900">{new Date(member.dateOfBirth).toLocaleDateString()}</p>
            </div>
          </div>

          {member.phone && (
            <div className="flex items-start gap-2">
              <Phone className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Phone</p>
                <p className="font-medium text-sm text-gray-900">{member.phone}</p>
              </div>
            </div>
          )}

          {member.email && (
            <div className="flex items-start gap-2 col-span-full sm:col-span-1">
              <Mail className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-gray-500">Email</p>
                <p className="font-medium text-sm text-gray-900 truncate">{member.email}</p>
              </div>
            </div>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-4 pt-2">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="h-4 w-4 text-gray-500 flex-shrink-0" />
              <p className="text-xs text-gray-500">Insurance</p>
            </div>
            {member.insurance?.hasInsurance ? (
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 font-normal text-xs">
                  Insured
                </Badge>
                <span className="text-xs text-gray-600 truncate max-w-[120px]">
                  {member.insurance.provider}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 font-normal text-xs">
                  No Insurance
                </Badge>
                <Link
                  href={`/patient/insurance/${member.id}/add-insurance`}
                  className="text-xs text-customTeal hover:underline font-medium"
                >
                  Add Insurance
                </Link>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-gray-500 flex-shrink-0" />
              <p className="text-xs text-gray-500">Appointments</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="bg-customTeal/5 text-xs whitespace-nowrap">
                {member.appointments.total} Total
              </Badge>
              {member.appointments.upcoming > 0 && (
                <Badge className="bg-customTeal/10 text-customTeal hover:bg-customTeal/20 border-0 text-xs whitespace-nowrap">
                  {member.appointments.upcoming} Upcoming
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="bg-gray-50/50 flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-0 pt-3 border-t border-gray-100">
        {!member.insurance?.hasInsurance && (
          <Button 
            size="sm" 
            variant="outline" 
            className="bg-customTeal text-white hover:bg-customTeal/90 w-full sm:w-auto text-xs font-medium" 
            asChild
          >
            <Link href={`/patient/insurance/${member.id}/add-insurance`}>
              <CreditCard className="h-4 w-4 mr-1.5" /> Add Insurance
            </Link>
          </Button>
        )}
        <Button 
          size="sm" 
          variant="ghost" 
          className="text-customTeal bg-gray-100 hover:bg-gray-200 w-full sm:w-auto text-xs font-medium" 
          asChild
        >
          <Link href={`/patient/family-member/${member.id}`}>
            View Profile <ChevronRight className="ml-1.5 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export default FamilyMemberCard;
