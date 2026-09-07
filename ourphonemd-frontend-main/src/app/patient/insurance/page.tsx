"use client";

import React, { useState } from 'react';
import { CreditCard, Plus, Pencil, MoreHorizontal, Upload, Download, FileText, Receipt, Eye } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from 'next/image';
import Link from "next/link";

// Types
interface InsurancePolicy {
  id: string;
  provider: string;
  policyNumber: string;
  groupNumber?: string;
  memberName: string;
  relationship: string;
  startDate: string;
  isPrimary: boolean;
  isActive: boolean;
  coverageType: string;
  frontImageUrl?: string;
  backImageUrl?: string;
}

interface BillingRecord {
  id: string;
  date: string;
  description: string;
  totalAmount: number;
  insuranceCovered: number;
  patientResponsibility: number;
  status: 'paid' | 'pending' | 'overdue';
  receiptUrl?: string;
  patientName?: string;
}

// Sample data
const insurancePolicies: InsurancePolicy[] = [
  {
    id: "1",
    provider: "Blue Cross Blue Shield",
    policyNumber: "BC1234567",
    groupNumber: "GRP123456",
    memberName: "You",
    relationship: "Self",
    startDate: "2023-01-01",
    isPrimary: true,
    isActive: true,
    coverageType: "PPO",
    frontImageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQucEa-hOKhXx61WGzT-d98yc0lJxkjKQ1dIg&s",
    backImageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQucEa-hOKhXx61WGzT-d98yc0lJxkjKQ1dIg&s"
  },
  {
    id: "2",
    provider: "Aetna",
    policyNumber: "AE7654321",
    groupNumber: "AET987654",
    memberName: "John Smith",
    relationship: "Spouse",
    startDate: "2023-01-01",
    isPrimary: true,
    isActive: true,
    coverageType: "HMO",
    frontImageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQucEa-hOKhXx61WGzT-d98yc0lJxkjKQ1dIg&s",
    backImageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQucEa-hOKhXx61WGzT-d98yc0lJxkjKQ1dIg&s"
  },
  {
    id: "3",
    provider: "Delta Dental",
    policyNumber: "DD9876543",
    memberName: "You",
    relationship: "Self",
    startDate: "2023-02-15",
    isPrimary: false,
    isActive: true,
    coverageType: "Dental",
  }
];

const billingRecords: BillingRecord[] = [
  {
    id: "1",
    date: "2024-04-15",
    description: "Annual Physical Examination",
    totalAmount: 250.00,
    insuranceCovered: 225.00,
    patientResponsibility: 25.00,
    status: 'paid',
    receiptUrl: "/documents/receipt-1.pdf"
  },
  {
    id: "2",
    date: "2024-03-22",
    description: "ENT Consultation - Ear Infection",
    totalAmount: 175.00,
    insuranceCovered: 140.00,
    patientResponsibility: 35.00,
    status: 'paid',
    receiptUrl: "/documents/receipt-2.pdf"
  },
  {
    id: "3",
    date: "2024-04-05",
    description: "X-Ray - Chest",
    totalAmount: 320.00,
    insuranceCovered: 240.00,
    patientResponsibility: 80.00,
    status: 'pending',
    patientName: "John Smith"
  },
  {
    id: "4",
    date: "2024-02-28",
    description: "Pediatric Checkup",
    totalAmount: 150.00,
    insuranceCovered: 150.00,
    patientResponsibility: 0.00,
    status: 'paid',
    receiptUrl: "/documents/receipt-4.pdf",
    patientName: "Emma Smith"
  },
];

// Insurance providers list
const insuranceProviders = [
  "Aetna",
  "Blue Cross Blue Shield",
  "Cigna",
  "Delta Dental",
  "Humana",
  "Kaiser Permanente",
  "Medicare",
  "Medicaid",
  "UnitedHealthcare",
  "Other"
];

export default function InsurancePage() {
  const [showEditInsuranceDialog, setShowEditInsuranceDialog] = useState(false);
  const [showAddInsuranceDialog, setShowAddInsuranceDialog] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedPolicy, setSelectedPolicy] = useState<InsurancePolicy | null>(null);
  

  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-customTeal">Insurance & Billing</h1>
       
      </div>
      
      <Tabs defaultValue="insurance" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="insurance">Insurance</TabsTrigger>
          <TabsTrigger value="billing">Billing & Payments</TabsTrigger>
        </TabsList>
        
        {/* Insurance Tab */}
        <TabsContent value="insurance" className="space-y-4 mt-4">
          {insurancePolicies.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {insurancePolicies.map(policy => (
                <Card key={policy.id}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-3">
                        <div className="bg-customTeal/10 p-2 rounded-full">
                          <CreditCard className="h-5 w-5 text-customTeal" />
                        </div>
                        <div>
                          <CardTitle className="flex items-center">
                            {policy.provider}
                            {policy.isPrimary && (
                              <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                                Primary
                              </span>
                            )}
                          </CardTitle>
                          <CardDescription>
                            {policy.coverageType} · {policy.relationship === "Self" ? "Your Policy" : `${policy.memberName}'s Policy`}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex">
                        <Link href={`/patient/insurance/${policy.id}/edit`}>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-gray-500 hover:text-customTeal"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-gray-500">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="flex items-center">
                              <FileText className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center">
                              <Download className="h-4 w-4 mr-2" />
                              Download Card Images
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600 flex items-center">
                              Remove Insurance
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-1">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-4 text-sm">
                      <div>
                        <p className="text-gray-500">Policy Number</p>
                        <p className="font-medium">{policy.policyNumber}</p>
                      </div>
                      {policy.groupNumber && (
                        <div>
                          <p className="text-gray-500">Group Number</p>
                          <p className="font-medium">{policy.groupNumber}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-gray-500">Member Name</p>
                        <p className="font-medium">
                          {policy.memberName}
                          {policy.relationship !== "Self" && ` (${policy.relationship})`}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Active Since</p>
                        <p className="font-medium">{new Date(policy.startDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Status</p>
                        <p className={`font-medium ${policy.isActive ? 'text-green-600' : 'text-red-600'}`}>
                          {policy.isActive ? 'Active' : 'Inactive'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  {(policy.frontImageUrl || policy.backImageUrl) && (
                    <CardFooter className="pt-4 pb-3 flex">
                      <div className="grid grid-cols-2 gap-3 w-full">
                        {policy.frontImageUrl && (
                          <div className="relative group">
                            <Image 
                              src={policy.frontImageUrl} 
                              fill
                              alt="Insurance Card (Front)" 
                              className="w-full h-36 object-cover rounded-lg border border-gray-200" 
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center transition-all rounded-lg">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-transparent group-hover:text-white"
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Front of Card</p>
                          </div>
                        )}
                        {policy.backImageUrl && (
                          <div className="relative group">
                            <Image 
                              src={policy?.backImageUrl} 
                              alt="Insurance Card (Back)" 
                              className="w-full h-36 object-cover rounded-lg border border-gray-200" 
                              fill
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center transition-all rounded-lg">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-transparent group-hover:text-white"
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Back of Card</p>
                          </div>
                        )}
                      </div>
                    </CardFooter>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <CreditCard className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No insurance information</h3>
              <p className="text-gray-500 mb-4">You haven&apos;t added any insurance policies yet.</p>
              <Button 
                className="bg-customTeal hover:bg-customTeal/90 text-white"
                onClick={() => setShowAddInsuranceDialog(true)}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Your First Insurance Policy
              </Button>
            </div>
          )}
        </TabsContent>
        
        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Receipt className="h-5 w-5 mr-2 text-customTeal" />
                Billing History
              </CardTitle>
              <CardDescription>
                View your billing history and download receipts
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-right">Insurance Paid</TableHead>
                      <TableHead className="text-right">Your Responsibility</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {billingRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">
                          {new Date(record.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{record.description}</TableCell>
                        <TableCell>{record.patientName || "You"}</TableCell>
                        <TableCell className="text-right">${record.totalAmount.toFixed(2)}</TableCell>
                        <TableCell className="text-right">${record.insuranceCovered.toFixed(2)}</TableCell>
                        <TableCell className="text-right">${record.patientResponsibility.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <span 
                            className={`
                              px-2 py-1 rounded-full text-xs font-medium
                              ${record.status === 'paid' ? 'bg-green-100 text-green-700' : ''}
                              ${record.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : ''}
                              ${record.status === 'overdue' ? 'bg-red-100 text-red-700' : ''}
                            `}
                          >
                            {record.status === 'paid' && 'Paid'}
                            {record.status === 'pending' && 'Pending'}
                            {record.status === 'overdue' && 'Overdue'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right space-x-1">
                          {record.receiptUrl && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 px-2"
                              asChild
                            >
                              <a href={record.receiptUrl} download>
                                <Download className="h-4 w-4 mr-1" />
                                Receipt
                              </a>
                            </Button>
                          )}
                          {record.status === 'pending' && (
                            <Button 
                              size="sm" 
                              className="h-8 px-2 bg-customTeal hover:bg-customTeal/90 text-white"
                            >
                              Pay Now
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Add Insurance Dialog */}
      <Dialog open={showAddInsuranceDialog} onOpenChange={setShowAddInsuranceDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Insurance</DialogTitle>
            <DialogDescription>
              Enter your insurance information below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="provider" className="text-right">
                Insurance Provider
              </Label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  {insuranceProviders.map(provider => (
                    <SelectItem key={provider} value={provider.toLowerCase().replace(/\s+/g, '-')}>
                      {provider}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="policy-number" className="text-right">
                Policy Number
              </Label>
              <Input id="policy-number" placeholder="Policy number" className="col-span-3" />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="group-number" className="text-right">
                Group Number
              </Label>
              <Input id="group-number" placeholder="Group number (optional)" className="col-span-3" />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="member-name" className="text-right">
                Member Name
              </Label>
              <Input id="member-name" placeholder="Name on insurance card" className="col-span-3" />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="relationship" className="text-right">
                Relationship
              </Label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="self">Self</SelectItem>
                  <SelectItem value="spouse">Spouse</SelectItem>
                  <SelectItem value="child">Child</SelectItem>
                  <SelectItem value="parent">Parent</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="coverage-type" className="text-right">
                Coverage Type
              </Label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select coverage type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hmo">HMO</SelectItem>
                  <SelectItem value="ppo">PPO</SelectItem>
                  <SelectItem value="epo">EPO</SelectItem>
                  <SelectItem value="pos">POS</SelectItem>
                  <SelectItem value="hdhp">HDHP</SelectItem>
                  <SelectItem value="dental">Dental</SelectItem>
                  <SelectItem value="vision">Vision</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="start-date" className="text-right">
                Start Date
              </Label>
              <Input id="start-date" type="date" className="col-span-3" />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Primary Insurance
              </Label>
              <div className="flex items-center space-x-2 col-span-3">
                <input type="checkbox" id="primary-insurance" className="rounded text-customTeal" />
                <Label htmlFor="primary-insurance" className="cursor-pointer">
                  This is my primary insurance
                </Label>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">
                Card Images
              </Label>
              <div className="col-span-3 space-y-3">
                <div>
                  <p className="text-sm mb-1">Front of Card (Optional)</p>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Upload className="h-6 w-6 mx-auto text-gray-400 mb-1" />
                    <p className="text-xs text-gray-500">Drag & drop or click to upload</p>
                    <Input type="file" className="hidden" id="front-image" />
                    <Label htmlFor="front-image">
                      <Button type="button" variant="outline" className="mt-2 text-xs h-7 px-2">
                        Select Image
                      </Button>
                    </Label>
                  </div>
                </div>
                <div>
                  <p className="text-sm mb-1">Back of Card (Optional)</p>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Upload className="h-6 w-6 mx-auto text-gray-400 mb-1" />
                    <p className="text-xs text-gray-500">Drag & drop or click to upload</p>
                    <Input type="file" className="hidden" id="back-image" />
                    <Label htmlFor="back-image">
                      <Button type="button" variant="outline" className="mt-2 text-xs h-7 px-2">
                        Select Image
                      </Button>
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddInsuranceDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-customTeal hover:bg-customTeal/90 text-white">
              Add Insurance
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Insurance Dialog */}
      <Dialog open={showEditInsuranceDialog} onOpenChange={setShowEditInsuranceDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Insurance</DialogTitle>
            <DialogDescription>
              Update your insurance information below.
            </DialogDescription>
          </DialogHeader>
          {selectedPolicy && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-provider" className="text-right">
                  Insurance Provider
                </Label>
                <Select defaultValue={selectedPolicy.provider.toLowerCase().replace(/\s+/g, '-')}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {insuranceProviders.map(provider => (
                      <SelectItem key={provider} value={provider.toLowerCase().replace(/\s+/g, '-')}>
                        {provider}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-policy-number" className="text-right">
                  Policy Number
                </Label>
                <Input 
                  id="edit-policy-number" 
                  defaultValue={selectedPolicy.policyNumber}
                  className="col-span-3" 
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-group-number" className="text-right">
                  Group Number
                </Label>
                <Input 
                  id="edit-group-number" 
                  defaultValue={selectedPolicy.groupNumber || ""}
                  placeholder="Group number (optional)" 
                  className="col-span-3" 
                />
              </div>
              
              {/* Additional fields would follow the same pattern */}
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">
                  Status
                </Label>
                <div className="flex items-center space-x-2 col-span-3">
                  <input 
                    type="checkbox" 
                    id="edit-active-status" 
                    className="rounded text-customTeal" 
                    defaultChecked={selectedPolicy.isActive}
                  />
                  <Label htmlFor="edit-active-status" className="cursor-pointer">
                    This insurance is active
                  </Label>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditInsuranceDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-customTeal hover:bg-customTeal/90 text-white">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
