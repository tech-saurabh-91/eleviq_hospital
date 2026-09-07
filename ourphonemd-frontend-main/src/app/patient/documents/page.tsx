"use client";

import React, { useState } from 'react';
import { FileText, Download, Search, Calendar, Eye, Users, ArrowUpDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Document {
  id: string;
  title: string;
  type: 'medical_record' | 'test_result' | 'doctor_note' | 'prescription' | 'work_note';
  date: string;
  doctor: string;
  specialty: string;
  description?: string;
  patientName?: string; // For family members
  fileSize: string;
  fileType: string;
  downloadUrl: string;
}

const documents: Document[] = [
  {
    id: "1",
    title: "Annual Physical Results",
    type: "medical_record",
    date: "2024-04-15",
    doctor: "Dr. Smith",
    specialty: "Family Medicine",
    description: "Complete results from your annual physical examination",
    fileSize: "1.2 MB",
    fileType: "PDF",
    downloadUrl: "/documents/annual-physical.pdf"
  },
  {
    id: "2",
    title: "Blood Test Results",
    type: "test_result",
    date: "2024-04-10",
    doctor: "Dr. Johnson",
    specialty: "Lab Services",
    description: "Complete blood count and metabolic panel",
    fileSize: "843 KB",
    fileType: "PDF",
    downloadUrl: "/documents/blood-test.pdf"
  },
  {
    id: "3",
    title: "Doctor's Note - Ear Infection",
    type: "doctor_note",
    date: "2024-03-22",
    doctor: "Dr. Williams",
    specialty: "ENT",
    description: "Follow-up notes regarding ear infection treatment",
    fileSize: "520 KB",
    fileType: "PDF",
    downloadUrl: "/documents/ear-infection-note.pdf"
  },
  {
    id: "4",
    title: "Prescription - Amoxicillin",
    type: "prescription",
    date: "2024-03-22",
    doctor: "Dr. Williams",
    specialty: "ENT",
    description: "Prescription for Amoxicillin 500mg",
    fileSize: "350 KB",
    fileType: "PDF",
    downloadUrl: "/documents/amoxicillin-prescription.pdf"
  },
  {
    id: "5",
    title: "School Absence Note",
    type: "work_note",
    date: "2024-03-23",
    doctor: "Dr. Williams",
    specialty: "ENT",
    description: "Medical excuse note for school absence",
    fileSize: "290 KB",
    fileType: "PDF",
    downloadUrl: "/documents/school-note.pdf"
  },
  {
    id: "6",
    title: "X-Ray Results - John Smith",
    type: "test_result",
    date: "2024-02-18",
    doctor: "Dr. Brown",
    specialty: "Radiology",
    patientName: "John Smith",
    description: "Chest X-ray results",
    fileSize: "1.5 MB",
    fileType: "PDF",
    downloadUrl: "/documents/xray-results.pdf"
  },
  {
    id: "7",
    title: "Pediatric Checkup - Emma Smith",
    type: "medical_record",
    date: "2024-01-25",
    doctor: "Dr. Davis",
    specialty: "Pediatrics",
    patientName: "Emma Smith",
    description: "Annual pediatric checkup results and growth charts",
    fileSize: "980 KB",
    fileType: "PDF",
    downloadUrl: "/documents/pediatric-checkup.pdf"
  }
];

// Map document types to display names
const documentTypeLabels: Record<string, string> = {
  medical_record: "Medical Record",
  test_result: "Test Result",
  doctor_note: "Doctor's Note",
  prescription: "Prescription",
  work_note: "Work/School Note"
};

export default function DocumentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'type'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [patientFilter, setPatientFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  
  // Get unique patients from documents
  const patients = ['Self', ...new Set(documents
    .filter(doc => doc.patientName)
    .map(doc => doc.patientName as string))];
  
  // Filter and sort documents
  const filteredDocuments = documents
    .filter(doc => {
      // Search filter
      const searchMatch = 
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doc.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
      
      // Patient filter
      const patientMatch = 
        patientFilter === 'all' || 
        (patientFilter === 'Self' && !doc.patientName) ||
        (doc.patientName === patientFilter);
      
      // Type filter
      const typeMatch = typeFilter === 'all' || doc.type === typeFilter;
      
      return searchMatch && patientMatch && typeMatch;
    })
    .sort((a, b) => {
      // Sorting
      if (sortBy === 'date') {
        return sortOrder === 'asc' 
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === 'title') {
        return sortOrder === 'asc' 
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else { // type
        return sortOrder === 'asc' 
          ? documentTypeLabels[a.type].localeCompare(documentTypeLabels[b.type])
          : documentTypeLabels[b.type].localeCompare(documentTypeLabels[a.type]);
      }
    });
  
  // Group documents by type for the tab view
  const documentsByType = {
    all: filteredDocuments,
    medical_record: filteredDocuments.filter(doc => doc.type === 'medical_record'),
    test_result: filteredDocuments.filter(doc => doc.type === 'test_result'),
    doctor_note: filteredDocuments.filter(doc => doc.type === 'doctor_note'),
    prescription: filteredDocuments.filter(doc => doc.type === 'prescription'),
    work_note: filteredDocuments.filter(doc => doc.type === 'work_note')
  };
  
  // Toggle sort order
  const toggleSort = (column: 'date' | 'title' | 'type') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-customTeal">Documents</h1>
      </div>
      
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search documents..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Select
            value={patientFilter}
            onValueChange={setPatientFilter}
          >
            <SelectTrigger className="w-[140px]">
              <Users className="h-4 w-4 mr-2" />
              <span className="truncate">{patientFilter === 'all' ? 'All Patients' : patientFilter}</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Patients</SelectItem>
              {patients.map(patient => (
                <SelectItem key={patient} value={patient}>{patient}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select
            value={typeFilter}
            onValueChange={setTypeFilter}
          >
            <SelectTrigger className="w-[160px]">
              <FileText className="h-4 w-4 mr-2" />
              <span className="truncate">
                {typeFilter === 'all' ? 'All Types' : documentTypeLabels[typeFilter]}
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="medical_record">Medical Records</SelectItem>
              <SelectItem value="test_result">Test Results</SelectItem>
              <SelectItem value="doctor_note">Doctor&apos;s Notes</SelectItem>
              <SelectItem value="prescription">Prescriptions</SelectItem>
              <SelectItem value="work_note">Work/School Notes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-3 sm:grid-cols-6 w-full">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="medical_record">Records</TabsTrigger>
          <TabsTrigger value="test_result">Tests</TabsTrigger>
          <TabsTrigger value="doctor_note">Notes</TabsTrigger>
          <TabsTrigger value="prescription">Prescriptions</TabsTrigger>
          <TabsTrigger value="work_note">Work/School</TabsTrigger>
        </TabsList>
        
        {Object.entries(documentsByType).map(([type, docs]) => (
          <TabsContent key={type} value={type} className="mt-4">
            {docs.length > 0 ? (
              <Card>
                <CardHeader className="p-4 pb-0">
                  <CardTitle className="text-base font-medium flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-customTeal" />
                    {type === 'all' ? 'All Documents' : documentTypeLabels[type]}
                    <Badge className="ml-2 bg-gray-100 text-gray-700 hover:bg-gray-100">
                      {docs.length}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    {type === 'all' 
                      ? 'All your medical documents in one place' 
                      : `Your ${documentTypeLabels[type].toLowerCase()} documents`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[300px]">
                            <Button 
                              variant="ghost" 
                              className="font-medium p-0 h-auto flex items-center"
                              onClick={() => toggleSort('title')}
                            >
                              Title
                              {sortBy === 'title' && (
                                <ArrowUpDown className={`ml-1 h-3 w-3 ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
                              )}
                            </Button>
                          </TableHead>
                          <TableHead>
                            <Button 
                              variant="ghost" 
                              className="font-medium p-0 h-auto flex items-center"
                              onClick={() => toggleSort('type')}
                            >
                              Type
                              {sortBy === 'type' && (
                                <ArrowUpDown className={`ml-1 h-3 w-3 ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
                              )}
                            </Button>
                          </TableHead>
                          <TableHead>
                            <Button 
                              variant="ghost" 
                              className="font-medium p-0 h-auto flex items-center"
                              onClick={() => toggleSort('date')}
                            >
                              Date
                              {sortBy === 'date' && (
                                <ArrowUpDown className={`ml-1 h-3 w-3 ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
                              )}
                            </Button>
                          </TableHead>
                          <TableHead>Doctor</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {docs.map((doc) => (
                          <TableRow key={doc.id}>
                            <TableCell className="font-medium">
                              <div>
                                {doc.title}
                                {doc.patientName && (
                                  <Badge variant="outline" className="ml-2">
                                    {doc.patientName}
                                  </Badge>
                                )}
                              </div>
                              {doc.description && (
                                <span className="text-xs text-gray-500 block mt-0.5 line-clamp-1">
                                  {doc.description}
                                </span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge 
                                className={`
                                  ${doc.type === 'medical_record' ? 'bg-purple-100 text-purple-700' : ''}
                                  ${doc.type === 'test_result' ? 'bg-blue-100 text-blue-700' : ''}
                                  ${doc.type === 'doctor_note' ? 'bg-green-100 text-green-700' : ''}
                                  ${doc.type === 'prescription' ? 'bg-orange-100 text-orange-700' : ''}
                                  ${doc.type === 'work_note' ? 'bg-teal-100 text-teal-700' : ''}
                                  hover:bg-opacity-90
                                `}
                              >
                                {documentTypeLabels[doc.type]}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Calendar className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                                <span>{new Date(doc.date).toLocaleDateString()}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                {doc.doctor}
                                <span className="text-xs text-gray-500 block">
                                  {doc.specialty}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-8 px-2 text-customTeal border-customTeal hover:bg-customTeal/10"
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-8 px-2"
                                  asChild
                                >
                                  <a href={doc.downloadUrl} download>
                                    <Download className="h-4 w-4 mr-1" />
                                    Download
                                  </a>
                                </Button>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {doc.fileType} · {doc.fileSize}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || patientFilter !== 'all' || typeFilter !== 'all'
                    ? "No documents match your search criteria."
                    : `You don't have any ${type === 'all' ? '' : documentTypeLabels[type].toLowerCase()} documents yet.`}
                </p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
} 