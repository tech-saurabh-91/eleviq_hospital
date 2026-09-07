"use client";

import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { states } from "@/lib/constants";
import { useState, useId } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export function Step4ProfileCreation() {
  // Try to get the form context, but handle the case when it's not available
  const formContext = useFormContext();
  const control = formContext?.control;
  
  // Return a simplified version if no form context
  if (!control) {
    return (
      <div className="p-4 border rounded-md bg-red-50 border-red-200">
        <p className="text-center text-red-500">Form context not available. Please try again.</p>
      </div>
    );
  }
  
  const [showPassword, setShowPassword] = useState(false);
  
  const passwordToggleId = useId();

  return (
    <div className="max-w-7xl mx-auto px-4  py-2">
      {/* Account Details Section */}
      <div >
        <h2 className="text-xl font-medium text-customTeal mb-4">Account Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
          <div>
            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-customTeal font-medium">Email Address</FormLabel>
                  <FormControl>
                    <Input 
                      type="email"
                      placeholder="example@email.com" 
                      {...field} 
                      className="border border-gray-300 rounded-md"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormField
              control={control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-customTeal font-medium">Password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input 
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password" 
                        {...field} 
                        className="border border-gray-300 rounded-md pr-10"
                      />
                    </FormControl>
                    <button 
                      id={passwordToggleId}
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOffIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Must include uppercase, number, and special character
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>

      {/* Personal Details Section */}
      <div className="mb-2">
        <h2 className="text-xl font-medium text-customTeal mb-4">Personal Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-2">
          <div>
            <FormField
              control={control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-customTeal font-medium">First Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your first name" 
                      {...field} 
                      className="border border-gray-300 rounded-md"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormField
              control={control}
              name="middleName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-600 font-medium">Middle Name (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your middle name" 
                      {...field}
                      className="border border-gray-300 rounded-md" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormField
              control={control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-customTeal font-medium">Last Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your last name" 
                      {...field}
                      className="border border-gray-300 rounded-md" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormField
              control={control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-customTeal font-medium">Date of Birth</FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      placeholder="mm/dd/yyyy"
                      {...field}
                      className="border border-gray-300 rounded-md" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormField
              control={control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-customTeal font-medium">Gender</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value || ""}
                  >
                    <FormControl>
                      <SelectTrigger className="border border-gray-300 rounded-md">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

         
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="mb-4">
        <h2 className="text-xl font-medium text-customTeal mb-4">Contact Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
          <div>
            <FormField
              control={control}
              name="primaryPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-customTeal font-medium">Primary Phone Number</FormLabel>
                  <FormControl>
                    <Input 
                      type="tel" 
                      placeholder="(XXX) XXX-XXXX" 
                      {...field}
                      className="border border-gray-300 rounded-md" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormField
              control={control}
              name="secondaryPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-600 font-medium">Secondary Phone (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      type="tel" 
                      placeholder="(XXX) XXX-XXXX" 
                      {...field}
                      className="border border-gray-300 rounded-md" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>

      {/* Address Information */}
      <div className="mb-2">  
        <h2 className="text-xl font-medium text-customTeal mb-4">Physical Address</h2>
        
        <div className="grid grid-cols-1 gap-x-6 gap-y-2">
          <div>
            <FormField
              control={control}
              name="streetAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-customTeal font-medium">Street Address</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="123 Main St, Apt 4B" 
                      {...field}
                      className="border border-gray-300 rounded-md" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <FormField
                control={control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-customTeal font-medium">City</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your city" 
                        {...field}
                        className="border border-gray-300 rounded-md" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormField
                control={control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-customTeal font-medium">State</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger className="border border-gray-300 rounded-md">
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {states.map((state) => (
                          <SelectItem key={state.value} value={state.value}>
                            {state.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormField
                control={control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-customTeal font-medium">ZIP Code</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter ZIP code" 
                        {...field}
                        className="border border-gray-300 rounded-md" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Insurance section removed. Will be handled in a dedicated step. */}
    </div>
  );
}