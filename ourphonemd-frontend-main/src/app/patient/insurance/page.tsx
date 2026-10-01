"use client";

import React, { useState } from 'react';
import { CreditCard, Plus, Pencil, MoreHorizontal, Download, FileText, Receipt, Eye,  } from 'lucide-react';
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

import api from "@/helper/axios";
import { PATIENT_INSURANCE_API } from "@/helper/api";
import { useEffect } from "react";
import { toast } from "sonner";

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
  const [insurancePolicies, setInsurancePolicies] = useState<InsurancePolicy[]>([]);
  const [deletingInsuranceId, setDeletingInsuranceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [addInsuranceLoading, setAddInsuranceLoading] = useState(false);

  const [addInsuranceForm, setAddInsuranceForm] = useState({
    insuranceType: "",
    insuranceProvider: "",
    insuranceId: "",
    policyNumber: "",
    groupNumber: "",
    ediPayer: "",
    coverageType: "",
    effectiveDate: "",
    relationship: "Self",
    isPrimary: false,

    subscriberName: "",
    subscriberCopay: "",
    subscriberSsn: "",
    subscriberDateOfBirth: "",
    subscriberAddress: "",

    frontCardImage: null as File | null,
    backCardImage: null as File | null,
  });

  useEffect(() => {
    const fetchInsurance = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(PATIENT_INSURANCE_API.GET);

        const data = response.data?.data ?? response.data ?? [];

        const policies = data.map((insurance: any) => ({
          id: insurance._id,
          provider: insurance.insuranceProvider,
          policyNumber: insurance.policyNumber,
          groupNumber: insurance.groupNumber,
          memberName:
            insurance.familyMember?.firstName
              ? `${insurance.familyMember.firstName} ${insurance.familyMember.lastName}`
              : "You",
          relationship: insurance.relationship,
          startDate: insurance.effectiveDate,
          isPrimary: insurance.isPrimary,
          isActive: true,
          coverageType: insurance.coverageType,
          frontImageUrl: insurance.frontCardImage?.url,
          backImageUrl: insurance.backCardImage?.url,
        }));

        setInsurancePolicies(policies);
      } catch (error: any) {
        console.error("Failed to fetch insurance:", error);
        setError(
          error.response?.data?.message ||
          "Failed to load insurance information."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInsurance();
  }, []);

  const handleDeleteInsurance = async (insuranceId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this insurance policy?"
    );

    if (!confirmed) return;

    try {
      setDeletingInsuranceId(insuranceId);

      await api.delete(
        PATIENT_INSURANCE_API.DELETE(insuranceId)
      );

      setInsurancePolicies((currentPolicies) =>
        currentPolicies.filter(
          (policy) => policy.id !== insuranceId
        )
      );
    } catch (error: any) {
      console.error("Failed to delete insurance:", error);

      window.alert(
        error.response?.data?.message ||
        "Failed to remove insurance policy."
      );
    } finally {
      setDeletingInsuranceId(null);
    }
  };

  const handleAddInsurance = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const {
      insuranceType,
      insuranceProvider,
      insuranceId,
      policyNumber,
      groupNumber,
      ediPayer,
      coverageType,
      effectiveDate,
      relationship,
      isPrimary,
      subscriberName,
      subscriberCopay,
      subscriberSsn,
      subscriberDateOfBirth,
      subscriberAddress,
      frontCardImage,
      backCardImage,
    } = addInsuranceForm;

    if (
      !insuranceType ||
      !insuranceProvider ||
      !insuranceId.trim() ||
      !policyNumber.trim() ||
      !coverageType ||
      !effectiveDate ||
      !relationship
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const isCommercial =
      insuranceType.toLowerCase().includes("commercial");

    if (
      isCommercial &&
      (
        !subscriberName.trim() ||
        !subscriberSsn.trim() ||
        !subscriberDateOfBirth ||
        !subscriberAddress.trim()
      )
    ) {
      toast.error(
        "Subscriber name, SSN, date of birth, and address are required for commercial insurance."
      );
      return;
    }

    try {
      setAddInsuranceLoading(true);

      const data = new FormData();

      data.append("insuranceType", insuranceType);
      data.append("insuranceProvider", insuranceProvider);
      data.append("insuranceId", insuranceId.trim());
      data.append("policyNumber", policyNumber.trim());

      if (groupNumber.trim()) {
        data.append("groupNumber", groupNumber.trim());
      }

      if (ediPayer.trim()) {
        data.append("ediPayer", ediPayer.trim());
      }

      data.append("coverageType", coverageType);

      data.append("coverageType", coverageType);
      data.append("effectiveDate", effectiveDate);
      data.append("relationship", relationship);
      data.append("isPrimary", String(isPrimary));

      if (isCommercial) {
        data.append("subscriberName", subscriberName.trim());
        data.append("subscriberSsn", subscriberSsn.trim());
        data.append("subscriberDateOfBirth", subscriberDateOfBirth);
        data.append("subscriberAddress", subscriberAddress.trim());

        if (subscriberCopay.trim()) {
          data.append("subscriberCopay", subscriberCopay.trim());
        }
      }

      if (frontCardImage) {
        data.append("frontCardImage", frontCardImage);
      }

      if (backCardImage) {
        data.append("backCardImage", backCardImage);
      }

      await api.post(
        PATIENT_INSURANCE_API.CREATE,
        data
      );

      toast.success("Insurance added successfully.");

      setShowAddInsuranceDialog(false);

      setAddInsuranceForm({
        insuranceType: "",
        insuranceProvider: "",
        insuranceId: "",
        policyNumber: "",
        groupNumber: "",
        ediPayer: "",
        coverageType: "",
        effectiveDate: "",
        relationship: "Self",
        isPrimary: false,

        subscriberName: "",
        subscriberCopay: "",
        subscriberSsn: "",
        subscriberDateOfBirth: "",
        subscriberAddress: "",

        frontCardImage: null,
        backCardImage: null,
      });

      const response = await api.get(
        PATIENT_INSURANCE_API.GET
      );

      const insuranceData =
        response.data?.data ??
        response.data ??
        [];

      const policies = insuranceData.map(
        (insurance: any) => ({
          id: insurance._id,
          provider: insurance.insuranceProvider,
          policyNumber: insurance.policyNumber,
          groupNumber: insurance.groupNumber,
          memberName:
            insurance.familyMember?.firstName
              ? `${insurance.familyMember.firstName} ${insurance.familyMember.lastName}`
              : "You",
          relationship: insurance.relationship,
          startDate: insurance.effectiveDate,
          isPrimary: insurance.isPrimary,
          isActive: true,
          coverageType: insurance.coverageType,
          frontImageUrl:
            insurance.frontCardImage?.url,
          backImageUrl:
            insurance.backCardImage?.url,
        })
      );

      setInsurancePolicies(policies);
    } catch (error: any) {
      console.error(
        "Failed to add insurance:",
        error
      );

      toast.error(
        error.response?.data?.message ||
        "Failed to add insurance."
      );
    } finally {
      setAddInsuranceLoading(false);
    }
  };



  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-customTeal">
          Insurance & Billing
        </h1>

        <Button
          className="bg-customTeal hover:bg-customTeal/90 text-white"
          onClick={() => setShowAddInsuranceDialog(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Insurance
        </Button>
      </div>

      <Tabs defaultValue="insurance" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="insurance">Insurance</TabsTrigger>
          <TabsTrigger value="billing">Billing & Payments</TabsTrigger>
        </TabsList>

        {/* Insurance Tab */}
        <TabsContent value="insurance" className="space-y-4 mt-4">
          {loading ? (
            <div className="text-center py-12 text-gray-500">
              Loading insurance information...
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-600">
              {error}
            </div>
          ) : insurancePolicies.length > 0 ? (
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
                            <DropdownMenuItem
                              className="text-red-600 flex items-center"
                              disabled={deletingInsuranceId === policy.id}
                              onClick={() => handleDeleteInsurance(policy.id)}
                            >
                              {deletingInsuranceId === policy.id
                                ? "Removing..."
                                : "Remove Insurance"}
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
      <Dialog
        open={showAddInsuranceDialog}
        onOpenChange={setShowAddInsuranceDialog}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Insurance</DialogTitle>

            <DialogDescription>
              Enter your insurance information below.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleAddInsurance}
            className="space-y-4"
          >
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="insurance-type"
                className="text-right"
              >
                Insurance Type
              </Label>

              <Select
                value={addInsuranceForm.insuranceType}
                onValueChange={(value) =>
                  setAddInsuranceForm((current) => ({
                    ...current,
                    insuranceType: value,
                  }))
                }
              >
                <SelectTrigger
                  id="insurance-type"
                  className="col-span-3"
                >
                  <SelectValue placeholder="Select insurance type" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="Government">
                    Government Health Scheme
                  </SelectItem>

                  <SelectItem value="Ayushman Bharat PM-JAY">
                    Ayushman Bharat PM-JAY
                  </SelectItem>

                  <SelectItem value="CGHS">
                    CGHS
                  </SelectItem>

                  <SelectItem value="ESIC">
                    ESIC
                  </SelectItem>

                  <SelectItem value="Commercial">
                    Private / Commercial Insurance
                  </SelectItem>

                  <SelectItem value="Other">
                    Other
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="insurance-provider"
                className="text-right"
              >
                Provider
              </Label>

              <Select
                value={addInsuranceForm.insuranceProvider}
                onValueChange={(value) =>
                  setAddInsuranceForm((current) => ({
                    ...current,
                    insuranceProvider: value,
                  }))
                }
              >
                <SelectTrigger
                  id="insurance-provider"
                  className="col-span-3"
                >
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>

                <SelectContent>
                  {[
                    "Star Health and Allied Insurance",
                    "Niva Bupa Health Insurance",
                    "Care Health Insurance",
                    "HDFC ERGO Health Insurance",
                    "ICICI Lombard General Insurance",
                    "Aditya Birla Health Insurance",
                    "ManipalCigna Health Insurance",
                    "Tata AIG General Insurance",
                    "Bajaj Allianz General Insurance",
                    "New India Assurance",
                    "National Insurance Company",
                    "United India Insurance",
                    "Oriental Insurance",
                    "Other",
                  ].map((provider) => (
                    <SelectItem
                      key={provider}
                      value={provider}
                    >
                      {provider}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="insurance-id"
                className="text-right"
              >
                Member ID
              </Label>

              <Input
                id="insurance-id"
                value={addInsuranceForm.insuranceId}
                onChange={(event) =>
                  setAddInsuranceForm((current) => ({
                    ...current,
                    insuranceId: event.target.value,
                  }))
                }
                placeholder="Insurance member ID"
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="policy-number"
                className="text-right"
              >
                Policy Number
              </Label>

              <Input
                id="policy-number"
                value={addInsuranceForm.policyNumber}
                onChange={(event) =>
                  setAddInsuranceForm((current) => ({
                    ...current,
                    policyNumber: event.target.value,
                  }))
                }
                placeholder="Policy number"
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="group-number"
                className="text-right"
              >
                Group Number
              </Label>

              <Input
                id="group-number"
                value={addInsuranceForm.groupNumber}
                onChange={(event) =>
                  setAddInsuranceForm((current) => ({
                    ...current,
                    groupNumber: event.target.value,
                  }))
                }
                placeholder="Optional"
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="edi-payer"
                className="text-right"
              >
                EDI Payer
              </Label>

              <Input
                id="edi-payer"
                value={addInsuranceForm.ediPayer}
                onChange={(event) =>
                  setAddInsuranceForm((current) => ({
                    ...current,
                    ediPayer: event.target.value,
                  }))
                }
                placeholder="Optional EDI payer"
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="coverage-type"
                className="text-right"
              >
                Coverage
              </Label>

              <Select
                value={addInsuranceForm.coverageType}
                onValueChange={(value) =>
                  setAddInsuranceForm((current) => ({
                    ...current,
                    coverageType: value,
                  }))
                }
              >
                <SelectTrigger
                  id="coverage-type"
                  className="col-span-3"
                >
                  <SelectValue placeholder="Select coverage" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="Medical">
                    Medical
                  </SelectItem>

                  <SelectItem value="Hospitalization">
                    Hospitalization
                  </SelectItem>

                  <SelectItem value="Maternity">
                    Maternity
                  </SelectItem>

                  <SelectItem value="Critical Illness">
                    Critical Illness
                  </SelectItem>

                  <SelectItem value="Dental">
                    Dental
                  </SelectItem>

                  <SelectItem value="Vision">
                    Vision
                  </SelectItem>

                  <SelectItem value="Other">
                    Other
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="start-date"
                className="text-right"
              >
                Effective Date
              </Label>

              <Input
                id="start-date"
                type="date"
                value={addInsuranceForm.effectiveDate}
                onChange={(event) =>
                  setAddInsuranceForm((current) => ({
                    ...current,
                    effectiveDate: event.target.value,
                  }))
                }
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="relationship"
                className="text-right"
              >
                Relationship
              </Label>

              <Select
                value={addInsuranceForm.relationship}
                onValueChange={(value) =>
                  setAddInsuranceForm((current) => ({
                    ...current,
                    relationship: value,
                  }))
                }
              >
                <SelectTrigger
                  id="relationship"
                  className="col-span-3"
                >
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="Self">
                    Self
                  </SelectItem>
                  <SelectItem value="Spouse">
                    Spouse
                  </SelectItem>
                  <SelectItem value="Child">
                    Child
                  </SelectItem>
                  <SelectItem value="Parent">
                    Parent
                  </SelectItem>
                  <SelectItem value="Other">
                    Other
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {addInsuranceForm.insuranceType
              .toLowerCase()
              .includes("commercial") && (
                <>
                  <div className="border-t pt-4">
                    <h3 className="font-medium text-customTeal">
                      Subscriber Information
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      Required for private / commercial insurance.
                    </p>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="subscriber-name"
                      className="text-right"
                    >
                      Subscriber Name
                    </Label>

                    <Input
                      id="subscriber-name"
                      value={addInsuranceForm.subscriberName}
                      onChange={(event) =>
                        setAddInsuranceForm((current) => ({
                          ...current,
                          subscriberName: event.target.value,
                        }))
                      }
                      placeholder="Subscriber full name"
                      className="col-span-3"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="subscriber-id"
                      className="text-right"
                    >
                      Subscriber ID
                    </Label>

                    <Input
                      id="subscriber-id"
                      value={addInsuranceForm.subscriberSsn}
                      onChange={(event) =>
                        setAddInsuranceForm((current) => ({
                          ...current,
                          subscriberSsn: event.target.value,
                        }))
                      }
                      placeholder="Subscriber ID"
                      className="col-span-3"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="subscriber-dob"
                      className="text-right"
                    >
                      Subscriber DOB
                    </Label>

                    <Input
                      id="subscriber-dob"
                      type="date"
                      value={addInsuranceForm.subscriberDateOfBirth}
                      onChange={(event) =>
                        setAddInsuranceForm((current) => ({
                          ...current,
                          subscriberDateOfBirth: event.target.value,
                        }))
                      }
                      className="col-span-3"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="subscriber-address"
                      className="text-right"
                    >
                      Subscriber Address
                    </Label>

                    <Input
                      id="subscriber-address"
                      value={addInsuranceForm.subscriberAddress}
                      onChange={(event) =>
                        setAddInsuranceForm((current) => ({
                          ...current,
                          subscriberAddress: event.target.value,
                        }))
                      }
                      placeholder="Subscriber address"
                      className="col-span-3"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="subscriber-copay"
                      className="text-right"
                    >
                      Subscriber Copay
                    </Label>

                    <Input
                      id="subscriber-copay"
                      value={addInsuranceForm.subscriberCopay}
                      onChange={(event) =>
                        setAddInsuranceForm((current) => ({
                          ...current,
                          subscriberCopay: event.target.value,
                        }))
                      }
                      placeholder="Optional"
                      className="col-span-3"
                    />
                  </div>
                </>
              )}

            <div className="border-t pt-4">
              <h3 className="font-medium text-customTeal">
                Insurance Card
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Upload the front and back of your insurance card.
                JPG, PNG, or GIF up to 5 MB each.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="front-card-image">
                  Front of Card
                </Label>

                <Input
                  id="front-card-image"
                  type="file"
                  accept="image/jpeg,image/png,image/gif"
                  className="mt-2"
                  onChange={(event) =>
                    setAddInsuranceForm((current) => ({
                      ...current,
                      frontCardImage:
                        event.target.files?.[0] ?? null,
                    }))
                  }
                />

                {addInsuranceForm.frontCardImage && (
                  <p className="text-xs text-gray-500 mt-1">
                    {addInsuranceForm.frontCardImage.name}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="back-card-image">
                  Back of Card
                </Label>

                <Input
                  id="back-card-image"
                  type="file"
                  accept="image/jpeg,image/png,image/gif"
                  className="mt-2"
                  onChange={(event) =>
                    setAddInsuranceForm((current) => ({
                      ...current,
                      backCardImage:
                        event.target.files?.[0] ?? null,
                    }))
                  }
                />

                {addInsuranceForm.backCardImage && (
                  <p className="text-xs text-gray-500 mt-1">
                    {addInsuranceForm.backCardImage.name}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="primary-insurance"
                checked={addInsuranceForm.isPrimary}
                onChange={(event) =>
                  setAddInsuranceForm((current) => ({
                    ...current,
                    isPrimary: event.target.checked,
                  }))
                }
                className="rounded text-customTeal"
              />

              <Label
                htmlFor="primary-insurance"
                className="cursor-pointer"
              >
                This is my primary insurance
              </Label>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setShowAddInsuranceDialog(false)
                }
                disabled={addInsuranceLoading}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                className="bg-customTeal hover:bg-customTeal/90 text-white"
                disabled={addInsuranceLoading}
              >
                {addInsuranceLoading
                  ? "Adding..."
                  : "Add Insurance"}
              </Button>
            </DialogFooter>
          </form>
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
