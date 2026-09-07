"use client";

import { FormProvider } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useAuth } from "@/hooks/useAuth";

export function SignupForm() {
  const { 
    signupForm, 
    currentStep, 
    totalSteps, 
    showInsuranceModal,
    setShowInsuranceModal,
    handleNext, 
    goToPreviousStep, 
    onSignUp,
    stepTitles,
    handleInsuranceChoice,
    renderStep,
    isLoading
  } = useAuth();

  return (
    <FormProvider {...signupForm}>
      <Form {...signupForm}>
        <form onSubmit={signupForm.handleSubmit(onSignUp)} className="space-y-2">
          {/* Header with title and back button */}
          <div className="w-full flex items-center justify-between border-b border-gray-200 pb-2 mb-4 -mt-6">
            <button
              type="button"
              onClick={goToPreviousStep}
              disabled={currentStep === 1}
              className={`
                flex items-center px-3 py-1.5 rounded-md transition-all duration-200
                ${currentStep === 1 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-gray-600 hover:text-teal-500'
                }
              `}
            >
              <ChevronLeft className="h-4 w-4 mr-1.5" />
              <span className="text-sm font-medium">Back</span>
            </button>
            <h2 className="text-xl font-semibold text-customTeal">
              {stepTitles[currentStep - 1]}
            </h2>
            <div className="w-20" /> {/* Spacer for balance */}
          </div>
          
          <div className="space-y-2">
            {renderStep()}
          </div>

          {/* Insurance Modal after verification */}
          <Dialog open={showInsuranceModal} onOpenChange={setShowInsuranceModal}>
            <DialogTitle className="sr-only">Insurance</DialogTitle>
            <DialogContent className="sm:max-w-md p-0 overflow-hidden">
              <div className="bg-gradient-to-r from-customTeal to-customTeal/70 h-2 w-full" />
              <div className="p-6">
                <h2 className="text-xl font-semibold text-customTeal mb-2">You have been successfully registered.</h2>
                <p className="text-gray-700 mb-6">
                  Do you have insurance and would like to add insurance details for{" "}
                  <span className="font-semibold">
                    {signupForm.getValues("firstName")} {signupForm.getValues("lastName")}
                  </span>?
                </p>
                <div className="flex gap-4 mt-6">
                  <Button
                    className="flex-1 bg-customTeal hover:bg-customTeal/90 text-white"
                    onClick={() => handleInsuranceChoice(true)}
                  >
                    Yes, add insurance
                  </Button>
                  <Button
                    className="flex-1 border-customTeal/20 border text-customTeal bg-white hover:bg-customTeal/10"
                    variant="outline"
                    onClick={() => handleInsuranceChoice(false)}
                  >
                    No, go to dashboard
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <div className="flex justify-between -mt-6">
            {currentStep > 1 && (
              <Button
                className="bg-customTeal hover:bg-teal-700 text-white w-32"
                type="button"
                variant="outline"
                onClick={goToPreviousStep}
              >
                Previous
              </Button>
            )}
            {currentStep < totalSteps ? (
              <Button 
                type="button" 
                className="ml-auto bg-customTeal hover:bg-teal-700 text-white w-32"
                onClick={handleNext}
                disabled={isLoading}
              >
                Next
              </Button>
            ) : (
              <Button 
                type="submit" 
                className="ml-auto bg-customTeal hover:bg-teal-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Submit"}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </FormProvider>
  );
}