"use client";

import { useEffect, useId, useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EyeIcon, EyeOffIcon } from "lucide-react";

interface State {
  stateCode: string;
  stateName: string;
}

interface City {
  localBodyCode: string;
  cityName: string;
  localBodyType: string;
  pincodes: string[];
}

export function Step4ProfileCreation() {
  const formContext = useFormContext();
  const control = formContext?.control;

  const [showPassword, setShowPassword] = useState(false);

  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  const passwordToggleId = useId();

  const selectedState = formContext?.watch("state");

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

  const LOCATION_API_URL = API_BASE_URL.endsWith("/api")
    ? `${API_BASE_URL}/locations`
    : `${API_BASE_URL}/api/locations`;

  /*
   * Fetch states from backend
   *
   * Backend:
   * app.use("/api/locations", locationRoutes);
   *
   * location.routes:
   * router.get("/states", getStates);
   *
   * Final endpoint:
   * GET /api/locations/states
   */
  useEffect(() => {
    const fetchStates = async () => {
      try {
        setLoadingStates(true);

        const response = await fetch(
          `${LOCATION_API_URL}/states`
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch states: ${response.status}`
          );
        }

        const result = await response.json();

        if (result.success) {
          setStates(result.data || []);
        } else {
          setStates([]);
        }
      } catch (error) {
        console.error("Failed to fetch states:", error);
        setStates([]);
      } finally {
        setLoadingStates(false);
      }
    };

    if (API_BASE_URL) {
      fetchStates();
    } else {
      console.error(
        "NEXT_PUBLIC_API_URL is not configured"
      );
    }
  }, [API_BASE_URL]);

  /*
   * Fetch cities whenever state changes.
   *
   * Backend:
   * router.get("/:state/cities", getStateCities);
   *
   * Final endpoint:
   * GET /api/locations/Maharashtra/cities
   */
  useEffect(() => {
    const fetchCities = async () => {
      if (!selectedState) {
        setCities([]);
        return;
      }

      try {
        setLoadingCities(true);

        const response = await fetch(
          `${LOCATION_API_URL}/${encodeURIComponent(
            selectedState
          )}/cities`
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch cities: ${response.status}`
          );
        }

        const result = await response.json();

        if (result.success) {
          setCities(result.data?.cities || []);
        } else {
          setCities([]);
        }
      } catch (error) {
        console.error("Failed to fetch cities:", error);
        setCities([]);
      } finally {
        setLoadingCities(false);
      }
    };

    if (API_BASE_URL) {
      fetchCities();
    } else {
      setCities([]);
    }
  }, [selectedState, LOCATION_API_URL]);

  /*
   * Keep hooks above this conditional return.
   */
  if (!control) {
    return (
      <div className="p-4 border rounded-md bg-red-50 border-red-200">
        <p className="text-center text-red-500">
          Form context not available. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-2">
      {/* Account Details Section */}
      <div>
        <h2 className="text-xl font-medium text-customTeal mb-4">
          Account Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
          <div>
            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-customTeal font-medium">
                    Email Address
                  </FormLabel>

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
                  <FormLabel className="text-customTeal font-medium">
                    Password
                  </FormLabel>

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
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
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
        <h2 className="text-xl font-medium text-customTeal mb-4">
          Personal Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-2">
          <div>
            <FormField
              control={control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-customTeal font-medium">
                    First Name
                  </FormLabel>

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
                  <FormLabel className="text-gray-600 font-medium">
                    Middle Name (Optional)
                  </FormLabel>

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
                  <FormLabel className="text-customTeal font-medium">
                    Last Name
                  </FormLabel>

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
                  <FormLabel className="text-customTeal font-medium">
                    Date of Birth
                  </FormLabel>

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
                  <FormLabel className="text-customTeal font-medium">
                    Gender
                  </FormLabel>

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
                      <SelectItem value="male">
                        Male
                      </SelectItem>

                      <SelectItem value="female">
                        Female
                      </SelectItem>

                      <SelectItem value="other">
                        Other
                      </SelectItem>

                      <SelectItem value="prefer-not-to-say">
                        Prefer not to say
                      </SelectItem>
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
        <h2 className="text-xl font-medium text-customTeal mb-4">
          Contact Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
          <div>
            <FormField
              control={control}
              name="primaryPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-customTeal font-medium">
                    Primary Phone Number
                  </FormLabel>

                  <FormControl>
                    <Input
                      type="tel"
                      inputMode="numeric"
                      placeholder="Enter 10-digit mobile number"
                      maxLength={10}
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
                  <FormLabel className="text-gray-600 font-medium">
                    Secondary Phone (Optional)
                  </FormLabel>

                  <FormControl>
                    <Input
                      type="tel"
                      inputMode="numeric"
                      placeholder="Enter 10-digit mobile number"
                      maxLength={10}
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
        <h2 className="text-xl font-medium text-customTeal mb-4">
          Address Information
        </h2>

        <div className="grid grid-cols-1 gap-x-6 gap-y-2">
          <div>
            <FormField
              control={control}
              name="streetAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-customTeal font-medium">
                    Street Address
                  </FormLabel>

                  <FormControl>
                    <Input
                      placeholder="House No., Street, Area"
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
            {/* City */}
            <div>
              <FormField
                control={control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-customTeal font-medium">
                      City
                    </FormLabel>

                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                      disabled={!selectedState || loadingCities}
                    >
                      <FormControl>
                        <SelectTrigger className="border border-gray-300 rounded-md">
                          <SelectValue
                            placeholder={
                              !selectedState
                                ? "Select state first"
                                : loadingCities
                                  ? "Loading cities..."
                                  : "Select city"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem
                            key={city.localBodyCode}
                            value={city.cityName}
                          >
                            {city.cityName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* State */}
            <div>
              <FormField
                control={control}
                name="state"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-customTeal font-medium">
                      State
                    </FormLabel>

                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);

                        // Clear city when state changes
                        formContext.setValue("city", "");
                        setCities([]);
                      }}
                      value={field.value || ""}
                      disabled={loadingStates}
                    >
                      <FormControl>
                        <SelectTrigger
                          className={`border rounded-md ${fieldState.error
                            ? "border-red-500"
                            : "border-gray-300"
                            }`}
                        >
                          <SelectValue
                            placeholder={
                              loadingStates
                                ? "Loading states..."
                                : "Select state"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {states.map((state) => (
                          <SelectItem
                            key={state.stateCode}
                            value={state.stateName}
                          >
                            {state.stateName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* PIN Code */}
            <div>
              <FormField
                control={control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-customTeal font-medium">
                      PIN Code
                    </FormLabel>

                    <FormControl>
                      <Input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        placeholder="Enter 6-digit PIN code"
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

      {/* Information Confirmation */}
      <div className="mt-3">
        <FormField
          control={control}
          name="informationConfirmed"
          render={({ field, fieldState }) => (
            <FormItem>
              <div className="flex items-start gap-2">
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value || false}
                    onChange={(event) =>
                      field.onChange(event.target.checked)
                    }
                    className="mt-0.5 h-3 w-3 cursor-pointer"
                  />
                </FormControl>

                <FormLabel
                  className={`text-[10px] font-medium cursor-pointer leading-tight ${fieldState.error
                    ? "text-red-600"
                    : "text-black"
                    }`}
                >
                  I ACCEPT ALL MENTION INPUT FIELDS ARE CORRECT.
                </FormLabel>
              </div>

              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Insurance section removed. Will be handled in a dedicated step. */}
    </div>
  );
}