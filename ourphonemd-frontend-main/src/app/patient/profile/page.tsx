"use client"

import { useUser } from "@/context/userContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Mail, MapPin, User, Shield, Clock, Edit2, Heart, Stethoscope, Loader2, Calendar, Phone } from "lucide-react"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { useProfile } from "@/hooks/useProfile"
import { toast } from "sonner"

const Profile = () => {
  const { user } = useUser()
  // const { loading, getProfile,error, updateProfile } = useProfile()
  const { loading, updateProfile } = useProfile()

  // useEffect(() => {
  //   getProfile()
  // }, [getProfile])

  const handleUpdateProfile = async () => {
    try {
      await updateProfile(user as any)
      toast.success("Profile updated successfully")
    } catch {
      toast.error("Failed to update profile")
    }
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }



  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24 border-2 border-teal-600">
                  <AvatarImage src="/placeholder-avatar.jpg" alt={`${user?.firstName} ${user?.lastName}`} />
                  <AvatarFallback className="text-xl bg-customTeal text-white">
                    {getInitials(user?.firstName || "", user?.lastName || "")}
                  </AvatarFallback>
                </Avatar>
               
              </div>

              <div className="text-center md:text-left flex-1">
                <h1 className="text-2xl font-bold text-gray-900">{`${user?.firstName} ${user?.lastName}`}</h1>
                <p className="text-gray-600 mt-1">Patient ID: {user?.id?.slice(0, 8)}</p>
                <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                 
                  <Badge variant="outline" className="border-customTeal text-customTeal">
                    <Clock className="h-3 w-3 mr-1" />
                    Since {user?.createdAt && format(new Date(user.createdAt), "MMM yyyy")}
                  </Badge>
                </div>
              </div>

              <Button className="bg-customTeal hover:bg-teal-700" onClick={handleUpdateProfile} >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </>
                )}
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
                <p className="font-medium">{`${user?.firstName} ${user?.lastName}`}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Gender</p>
                <p className="font-medium capitalize">{user?.gender?.toLowerCase()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date of Birth</p>
                <p className="font-medium">{user?.dateOfBirth && format(new Date(user.dateOfBirth), "MMM d, yyyy")}</p>
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
                <p className="font-medium">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{user?.phoneNumber}</p>
              </div>
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
                <p className="font-medium">{user?.address}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">City, State ZIP</p>
                <p className="font-medium">{`${user?.city}, ${user?.state} ${user?.zipCode}`}</p>
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
                <p className="font-medium">O+</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Allergies</p>
                <p className="font-medium">None</p>
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
                <p className="font-medium">{user?.createdAt && format(new Date(user.createdAt), "MMM d, yyyy")}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="font-medium">{user?.updatedAt && format(new Date(user.updatedAt), "MMM d, yyyy")}</p>
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
              <Button variant="outline" className="w-full justify-start border-teal-600 text-customTeal hover:bg-teal-50">
                <Calendar className="h-4 w-4 mr-2" />
                Book Appointment
              </Button>
              <Button variant="outline" className="w-full justify-start border-teal-600 text-customTeal hover:bg-teal-50">
                <Phone className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Profile
