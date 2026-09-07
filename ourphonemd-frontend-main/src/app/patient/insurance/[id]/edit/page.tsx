"use client";

import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";

// Dummy fetch function, replace with real API call
const fetchInsuranceById = async (id: string) => {
  // Replace with real fetch logic
  return {
    id,
    provider: "Aetna",
    policyNumber: "AE7654321",
    groupNumber: "AET987654",
    memberName: "John Smith",
    relationship: "Spouse",
    startDate: "2023-01-01",
    isPrimary: true,
    isActive: true,
    coverageType: "HMO",
  };
};

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

export default function EditInsurancePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    fetchInsuranceById(id).then(setForm);
  }, [id]);


  const handleCancel = () => {
    router.back();
  };

  if (!form) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto px-5 py-8">
       <div className="mb-6">
              <Button 
                variant="ghost" 
                className="text-customTeal mb-4" 
                onClick={handleCancel}
              >
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              <h1 className="text-2xl font-bold text-customTeal">Edit Insurance</h1>
              
            </div>
            
      <form className="space-y-5">
        <div>
          <Label htmlFor="provider">Insurance Provider</Label>
          <Select value={form.provider} onValueChange={v => setForm((f: any) => ({ ...f, provider: v }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select provider" />
            </SelectTrigger>
            <SelectContent>
              {insuranceProviders.map((prov) => (
                <SelectItem key={prov} value={prov}>{prov}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="policy-number">Policy Number</Label>
          <Input id="policy-number" value={form.policyNumber} onChange={e => setForm((f: any) => ({ ...f, policyNumber: e.target.value }))} />
        </div>
        <div>
          <Label htmlFor="group-number">Group Number (optional)</Label>
          <Input id="group-number" value={form.groupNumber} onChange={e => setForm((f: any) => ({ ...f, groupNumber: e.target.value }))} />
        </div>
        <div>
          <Label htmlFor="member-name">Member Name</Label>
          <Input id="member-name" value={form.memberName} onChange={e => setForm((f: any) => ({ ...f, memberName: e.target.value }))} />
        </div>
        <div>
          <Label htmlFor="relationship">Relationship</Label>
          <Select value={form.relationship} onValueChange={v => setForm((f: any) => ({ ...f, relationship: v }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select relationship" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Self">Self</SelectItem>
              <SelectItem value="Spouse">Spouse</SelectItem>
              <SelectItem value="Child">Child</SelectItem>
              <SelectItem value="Parent">Parent</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="coverage-type">Coverage Type</Label>
          <Select value={form.coverageType} onValueChange={v => setForm((f: any) => ({ ...f, coverageType: v }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select coverage type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="HMO">HMO</SelectItem>
              <SelectItem value="PPO">PPO</SelectItem>
              <SelectItem value="EPO">EPO</SelectItem>
              <SelectItem value="POS">POS</SelectItem>
              <SelectItem value="HDHP">HDHP</SelectItem>
              <SelectItem value="Dental">Dental</SelectItem>
              <SelectItem value="Vision">Vision</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="start-date">Start Date</Label>
          <Input id="start-date" type="date" value={form.startDate} onChange={e => setForm((f: any) => ({ ...f, startDate: e.target.value }))} />
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="primary-insurance"
            checked={form.isPrimary}
            onChange={e => setForm((f: any) => ({ ...f, isPrimary: e.target.checked }))}
            className="rounded text-customTeal"
          />
          <Label htmlFor="primary-insurance" className="cursor-pointer">
            This is my primary insurance
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="active-insurance"
            checked={form.isActive}
            onChange={e => setForm((f: any) => ({ ...f, isActive: e.target.checked }))}
            className="rounded text-customTeal"
          />
          <Label htmlFor="active-insurance" className="cursor-pointer">
            This insurance is active
          </Label>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" className="bg-customTeal hover:bg-customTeal/90 text-white">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}