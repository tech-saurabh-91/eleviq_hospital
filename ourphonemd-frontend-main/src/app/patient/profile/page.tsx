"use client";

import React, { useState } from "react";
import { useUser } from "@/context/userContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Mail,
  MapPin,
  User,
  Shield,
  Clock,
  Edit2,
  Heart,
  Stethoscope,
  Loader2,
  Calendar,
  Phone,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import Link from "next/link";

const BLOOD_TYPES = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
  "unknown",
];

const GENDERS = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
];

const Profile = () => {
  const { user, refreshUser } = useUser();
  const { loading: updating, updateProfile } = useProfile();

  const [editOpen, setEditOpen] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    secondaryPhone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    bloodType: "",
    allergies: "",
  });

  const openEditModal = () => {
    if (!user) return;
    setFormData({
      firstName: user.firstName || "",
      middleName: user.middleName || "",
      lastName: user.lastName || "",
      dateOfBirth: user.dateOfBirth ? user.dateOfBirth.slice(0, 10) : "",
      gender: user.gender || "MALE",
      secondaryPhone: user.secondaryPhone || "",
      street: user.address || "",
      city: user.city || "",
      state: user.state || "",
      zipCode: user.zipCode || "",
      bloodType: user.bloodType || "unknown",
      allergies: Array.isArray(user.allergies) ? user.allergies.join(", ") : "",
    });
    setEditError(null);
    setEditOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateEditForm = (): string | null => {
    if (!formData.firstName.trim()) return "First name is required";
    if (formData.firstName.trim().length > 50) return "First name cannot exceed 50 characters";
    if (!/^[A-Za-zÀ-ÿ\s'-]+$/.test(formData.firstName.trim())) return "First name contains invalid characters";

    if (formData.middleName.trim()) {
      if (formData.middleName.trim().length > 50) return "Middle name cannot exceed 50 characters";
      if (!/^[A-Za-zÀ-ÿ\s'-]+$/.test(formData.middleName.trim())) return "Middle name contains invalid characters";
    }

    if (!formData.lastName.trim()) return "Last name is required";
    if (formData.lastName.trim().length > 50) return "Last name cannot exceed 50 characters";
    if (!/^[A-Za-zÀ-ÿ\s'-]+$/.test(formData.lastName.trim())) return "Last name contains invalid characters";

    if (formData.secondaryPhone.trim()) {
      if (!/^[6-9]\d{9}$/.test(formData.secondaryPhone.trim())) {
        return "Secondary phone must be a valid 10-digit Indian mobile number";
      }
    }

    if (formData.zipCode.trim()) {
      if (!/^[1-9]\d{5}$/.test(formData.zipCode.trim())) {
        return "PIN code must contain 6 digits and cannot start with 0";
      }
    }

    if (formData.city.trim() && formData.city.trim().length < 2) {
      return "City must contain at least 2 characters";
    }

    if (formData.state.trim() && formData.state.trim().length < 2) {
      return "State must contain at least 2 characters";
    }

    return null;
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const errorMsg = validateEditForm();
    if (errorMsg) {
      setEditError(errorMsg);
      return;
    }

    setEditError(null);

    try {
      const allergiesArray = formData.allergies
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean);

      const payload: Record<string, any> = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        gender: formData.gender,
      };

      if (formData.middleName.trim()) payload.middleName = formData.middleName.trim();
      if (formData.secondaryPhone.trim()) payload.secondaryPhone = formData.secondaryPhone.trim();
      if (formData.dateOfBirth) payload.dateOfBirth = formData.dateOfBirth;
      if (formData.bloodType) payload.bloodType = formData.bloodType;
      payload.allergies = allergiesArray;

      payload.address = {
        street: formData.street.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        zipCode: formData.zipCode.trim(),
      };

      await updateProfile(payload);
      await refreshUser();
      toast.success("Profile updated successfully");
      setEditOpen(false);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to update profile";
      setEditError(msg);
      toast.error(msg);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase() || "P";
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24 border-2 border-teal-600">
                  <AvatarImage src={user?.avatar || "/placeholder-avatar.jpg"} alt={`${user?.firstName} ${user?.lastName}`} />
                  <AvatarFallback className="text-xl bg-customTeal text-white">
                    {getInitials(user?.firstName || "", user?.lastName || "")}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="text-center md:text-left flex-1">
                <h1 className="text-2xl font-bold text-gray-900">{`${user?.firstName || ""} ${user?.middleName ? user.middleName + " " : ""}${user?.lastName || ""}`}</h1>
                <p className="text-gray-600 mt-1">Patient ID: {user?.id?.slice(0, 8)}</p>
                <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                  <Badge variant="outline" className="border-customTeal text-customTeal">
                    <Clock className="h-3 w-3 mr-1" />
                    Member Since {user?.createdAt ? format(new Date(user.createdAt), "MMM yyyy") : "Active"}
                  </Badge>
                </div>
              </div>

              <Button className="bg-customTeal hover:bg-teal-700 text-white" onClick={openEditModal}>
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Information Cards Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Basic Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5 text-customTeal" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium">{`${user?.firstName || ""} ${user?.middleName ? user.middleName + " " : ""}${user?.lastName || ""}`}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Gender</p>
                <p className="font-medium capitalize">{user?.gender?.toLowerCase() || "Not specified"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date of Birth</p>
                <p className="font-medium">{user?.dateOfBirth ? format(new Date(user.dateOfBirth), "MMM d, yyyy") : "Not provided"}</p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Mail className="h-5 w-5 text-customTeal" />
                Contact Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{user?.email || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Primary Phone</p>
                <p className="font-medium">{user?.phoneNumber || "Not provided"}</p>
              </div>
              {user?.secondaryPhone && (
                <div>
                  <p className="text-sm text-gray-500">Secondary Phone</p>
                  <p className="font-medium">{user.secondaryPhone}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Address */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5 text-customTeal" />
                Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Street</p>
                <p className="font-medium">{user?.address || "Not specified"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">City, State PIN</p>
                <p className="font-medium">
                  {[user?.city, user?.state, user?.zipCode].filter(Boolean).join(", ") || "Not specified"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Medical Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Stethoscope className="h-5 w-5 text-customTeal" />
                Medical Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Blood Type</p>
                <p className="font-medium">{user?.bloodType && user.bloodType !== "unknown" ? user.bloodType : "Not recorded"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Allergies</p>
                <p className="font-medium">
                  {user?.allergies && user.allergies.length > 0 ? user.allergies.join(", ") : "None reported"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Account Status */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="h-5 w-5 text-customTeal" />
                Account Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="font-medium">{user?.createdAt ? format(new Date(user.createdAt), "MMM d, yyyy") : "Active"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Profile Update</p>
                <p className="font-medium">{user?.updatedAt ? format(new Date(user.updatedAt), "MMM d, yyyy") : "Recent"}</p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Heart className="h-5 w-5 text-customTeal" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/patient/appointments/new" className="block">
                <Button variant="outline" className="w-full justify-start border-teal-600 text-customTeal hover:bg-teal-50">
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Appointment
                </Button>
              </Link>
              <Link href="/patient/faqs" className="block">
                <Button variant="outline" className="w-full justify-start border-teal-600 text-customTeal hover:bg-teal-50">
                  <Phone className="h-4 w-4 mr-2" />
                  Hospital Support & FAQs
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Profile Information</DialogTitle>
            <DialogDescription>
              Update your personal and demographic information. Indian mobile numbers and PIN codes are strictly validated.
            </DialogDescription>
          </DialogHeader>

          {editError && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md flex items-center gap-2 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{editError}</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="middleName">Middle Name</Label>
                <Input
                  id="middleName"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(val) => handleSelectChange("gender", val)}
                >
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {GENDERS.map((g) => (
                      <SelectItem key={g.value} value={g.value}>
                        {g.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="secondaryPhone">Secondary Phone (10 digits)</Label>
                <Input
                  id="secondaryPhone"
                  name="secondaryPhone"
                  placeholder="e.g. 9876543210"
                  value={formData.secondaryPhone}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="bloodType">Blood Type</Label>
                <Select
                  value={formData.bloodType}
                  onValueChange={(val) => handleSelectChange("bloodType", val)}
                >
                  <SelectTrigger id="bloodType">
                    <SelectValue placeholder="Select blood type" />
                  </SelectTrigger>
                  <SelectContent>
                    {BLOOD_TYPES.map((bt) => (
                      <SelectItem key={bt} value={bt}>
                        {bt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="allergies">Allergies (comma-separated)</Label>
              <Input
                id="allergies"
                name="allergies"
                placeholder="e.g. Penicillin, Peanuts, Sulfa"
                value={formData.allergies}
                onChange={handleInputChange}
              />
            </div>

            <div className="border-t pt-3">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Address Details</h4>
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="street">Street Address</Label>
                  <Input
                    id="street"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="zipCode">PIN Code (6 digits)</Label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      placeholder="e.g. 110001"
                      maxLength={6}
                      value={formData.zipCode}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditOpen(false)}
                disabled={updating}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-customTeal hover:bg-teal-700 text-white"
                disabled={updating}
              >
                {updating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
