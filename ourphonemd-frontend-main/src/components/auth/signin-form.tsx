"use client";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { FormProvider } from "react-hook-form";

export default function SignInForm() {
  const { signInForm, isLoading, showPassword, setShowPassword, onSignIn } = useAuth();

  return (
    <Card className="w-full border-0 shadow-none ">
      <CardContent className="p-2 py-6">
        <FormProvider {...signInForm}>
          <Form {...signInForm}>
            <form onSubmit={signInForm.handleSubmit(onSignIn)} className="space-y-4">
              {/* Username / Mobile / Email Field */}
              <FormField
                control={signInForm.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex border rounded-md overflow-hidden focus-within:ring-1 focus-within:ring-customTeal">
                      <div className="bg-gray-50 border-r px-3 flex items-center">
                        <User className="h-5 w-5 text-gray-500" />
                      </div>
                      <FormControl>
                        <Input
                          placeholder="Username, Mobile or Email"
                          type="text"
                          autoComplete="username"
                          className="border-0 focus-visible:ring-0 h-11"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={signInForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex border rounded-md overflow-hidden focus-within:ring-1 focus-within:ring-customTeal">
                      <div className="bg-gray-50 border-r px-3 flex items-center">
                        <Lock className="h-5 w-5 text-gray-500" />
                      </div>
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            placeholder="Password"
                            type={showPassword ? "text" : "password"}
                            className="border-0 focus-visible:ring-0 h-11 pr-10"
                            {...field}
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Remember Me Checkbox */}
              <FormField
                control={signInForm.control}
                name="remember"
                render={({ field }) => (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-customTeal data-[state=checked]:border-customTeal"
                    />
                    <label
                      htmlFor="remember"
                      className="text-sm font-medium leading-none text-gray-700 cursor-pointer"
                    >
                      Remember
                    </label>
                  </div>
                )}
              />

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full h-11 bg-customTeal hover:bg-teal-700 text-white font-medium text-lg shadow-none"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "LOGIN"}
              </Button>

              {/* Bottom Links */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <Link href="/forgot-password" className="w-full">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full font-medium border-customTeal text-customTeal hover:bg-customTeal/5 hover:text-customTeal"
                  >
                    FORGOT PASSWORD
                  </Button>
                </Link>
                <Link href="/signup" className="w-full">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full px-2 font-medium border-customTeal text-customTeal hover:bg-customTeal/5 hover:text-customTeal"
                  >
                    FIRST TIME REGISTRATION
                  </Button>
                </Link>
              </div>
            </form>
          </Form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}