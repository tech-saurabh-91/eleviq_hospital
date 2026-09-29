import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { signInSchema, signupSchema } from "@/schema/auth";

import { TermsAndConditions } from "@/components/auth/steps/terms-and-conditions";
import { Step2Prerequisites } from "@/components/auth/steps/step2-prerequisites";
import { Step3AgeVerification } from "@/components/auth/steps/step3-age-verification";
import { Step4ProfileCreation } from "@/components/auth/steps/step4-profile-creation";
import { Step5Verification } from "@/components/auth/steps/step5-verification";
import { Step6Insurance } from "@/components/auth/steps/step6-insurance";

import { SignInFormValues, SignupFormValues } from "@/types/auth.type";
import {
  PATIENT_AUTH_API,
  PATIENT_REGISTRATION_API,
  PATIENT_INSURANCE_API,
} from "@/helper/api";

import { LoginResponse } from "@/types/User";
import { ApiError } from "@/types/error";

const ORGANIZATION_ID = "cmayaxw0g0001u3dsftfodhbh";

// Temporary prototype value.
// We will later fetch/use the actual active Terms record.
const TERMS_ID = "6a97c26a0a63999554599771";

const getDashboardRoute = (roles: string[]) => {
  const normalizedRoles = roles.map((role) =>
    role.toLowerCase().trim()
  );

  if (
    normalizedRoles.includes("super-admin") ||
    normalizedRoles.includes("hospital-admin")
  ) {
    return "/admin";
  }

  if (normalizedRoles.includes("doctor")) {
    return "/doctor";
  }

  if (normalizedRoles.includes("patient")) {
    return "/patient";
  }

  if (normalizedRoles.includes("receptionist")) {
    return "/reception";
  }

  if (normalizedRoles.includes("nurse")) {
    return "/nurse";
  }

  if (normalizedRoles.includes("pharmacist")) {
    return "/pharmacy";
  }

  if (normalizedRoles.includes("lab-technician")) {
    return "/laboratory";
  }

  if (normalizedRoles.includes("store-manager")) {
    return "/store";
  }

  if (normalizedRoles.includes("purchase-officer")) {
    return "/purchase";
  }

  if (normalizedRoles.includes("accountant")) {
    return "/accountant";
  }

  if (normalizedRoles.includes("hr")) {
    return "/hr";
  }

  return null;
};

const calculateAge = (dateOfBirth: string) => {
  const birthDate = new Date(`${dateOfBirth}T00:00:00`);

  if (Number.isNaN(birthDate.getTime())) {
    return null;
  }

  const today = new Date();

  let age =
    today.getFullYear() -
    birthDate.getFullYear();

  const monthDifference =
    today.getMonth() -
    birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (
      monthDifference === 0 &&
      today.getDate() < birthDate.getDate()
    )
  ) {
    age--;
  }

  return age;
};

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  /*
   * Registration session ID returned by backend.
   *
   * This ID must be passed to every registration endpoint.
   */
  const [registrationId, setRegistrationId] = useState<string | null>(null);

  /*
   * Sign In
   */
  const signInForm = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
      remember: false,
    },
  });

  /*
   * Sign Up
   */
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  const [showInsuranceModal, setShowInsuranceModal] = useState(false);

  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema) as any,
    mode: "onChange",

    defaultValues: {
      termsAccepted: false,

      isAdult: null,

      hasInsuranceCard: false,
      hasPharmacyInfo: false,
      hasMedicalRecords: false,
      hasEmergencyContact: false,

      email: "",
      password: "",
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "",
      primaryPhone: "",
      secondaryPhone: "",

      streetAddress: "",
      city: "",
      state: "",
      zipCode: "",

      insuranceType: "",
      insuranceProvider: "",
      insuranceId: "",
      policyNumber: "",
      groupNumber: "",
      ediPayer: "",
      coverageType: "",
      effectiveDate: "",
      isPrimary: false,
      frontCardImage: undefined,
      backCardImage: undefined,

      verificationMethod: null,

      emailVerificationCode: "",
      phoneVerificationCode: "",
    },
  });

  /*
   * =========================
   * LOGIN
   * =========================
   */

  const handleLogin = async (
    data: SignInFormValues
  ): Promise<LoginResponse> => {
    try {
      setIsLoading(true);

      const response = await axios.post<LoginResponse>(
        PATIENT_AUTH_API.LOGIN,
        {
          identifier: data.identifier.trim(),
          password: data.password,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error: any) {
      const apiError = error?.response?.data as ApiError;

      throw new Error(apiError?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const onSignIn = async (data: SignInFormValues) => {
    try {
      const response = await handleLogin(data);

      toast.success(`Welcome back, ${response.data.username}!`);

      const roles = response.data?.roles ?? [];

      const dashboardRoute = getDashboardRoute(roles);

      if (!dashboardRoute) {
        throw new Error("No dashboard configured for your role");
      }

      router.push(dashboardRoute);
    } catch (error) {
      console.error("Login failed:", error);

      toast.error(
        error instanceof Error ? error.message : "Login failed"
      );
    }
  };

  /*
   * =========================
   * REGISTRATION SESSION
   * =========================
   */

  const createRegistrationSession = async () => {
    const data = signupForm.getValues();

    if (!data.termsAccepted) {
      throw new Error("Please accept the Terms & Conditions");
    }

    const response = await axios.post(
      PATIENT_REGISTRATION_API.SESSION,
      {
        termsId: TERMS_ID,
        termsAccepted: true,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-organization-id": ORGANIZATION_ID,
        },
      }
    );

    const id = response.data?.data?.registrationId;

    if (!id) {
      throw new Error(
        "Registration session was not created by the backend"
      );
    }

    setRegistrationId(id);

    return id;
  };

  /*
   * =========================
   * PREREQUISITES
   * =========================
   */

  const completePrerequisites = async (id: string) => {
    await axios.post(
      PATIENT_REGISTRATION_API.PREREQUISITES,
      {
        registrationId: id,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-organization-id": ORGANIZATION_ID,
        },
      }
    );
  };

  /*
   * =========================
   * AGE VERIFICATION
   * =========================
   */

  const completeAgeVerification = async (id: string) => {
    const isAdult = signupForm.getValues("isAdult");

    if (isAdult === null || isAdult === undefined) {
      throw new Error("Please select an age verification option");
    }

    await axios.post(
      PATIENT_REGISTRATION_API.AGE_VERIFICATION,
      {
        registrationId: id,
        selection: isAdult ? "adult" : "guardian",
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-organization-id": ORGANIZATION_ID,
        },
      }
    );
  };

  /*
   * =========================
   * ACCOUNT CREATION
   * =========================
   */

  const createAccount = async (id: string) => {
    const data = signupForm.getValues();

    const age = calculateAge(data.dateOfBirth);

    if (age === null) {
      throw new Error(
        "Please enter a valid date of birth"
      );
    }

    if (age < 18) {
      throw new Error(
        "Account holder must be at least 18 years old"
      );
    }

    if (!data.isAdult && data.isAdult !== false) {
      throw new Error("Please complete age verification");
    }

    /*
     * Backend currently requires username.
     *
     * Temporary prototype generation.
     */
    const usernameBase =
      `${data.firstName}_${data.lastName}`
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, "")
        .slice(0, 25);

    const username =
      usernameBase || `patient${Date.now()}`;

    const registrationType = data.isAdult
      ? "self"
      : "guardian";

    const formData = new FormData();

    formData.append("registrationId", id);
    formData.append("registrationType", registrationType);

    formData.append("username", username);
    formData.append("email", data.email);
    formData.append("password", data.password);

    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);

    formData.append("dateOfBirth", data.dateOfBirth);
    formData.append("gender", data.gender);

    formData.append("primaryPhone", data.primaryPhone);

    if (data.secondaryPhone) {
      formData.append("secondaryPhone", data.secondaryPhone);
    }

    formData.append(
      "address",
      JSON.stringify({
        street: data.streetAddress,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
      })
    );

    formData.append(
      "confirmationAccepted",
      String(data.informationConfirmed)
    );

    await axios.post(
      PATIENT_REGISTRATION_API.ACCOUNT,
      formData,
      {
        withCredentials: true,
        headers: {
          "x-organization-id": ORGANIZATION_ID,
        },
      }
    );
  };

  /*
   * =========================
   * SEND OTP
   * =========================
   */

  const sendVerificationCode = async (
    id: string,
    method: "email" | "phone"
  ) => {
    await axios.post(
      PATIENT_REGISTRATION_API.VERIFICATION_METHOD,
      {
        registrationId: id,
        method,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-organization-id": ORGANIZATION_ID,
        },
      }
    );
  };

  /*
   * =========================
   * VERIFY OTP
   * =========================
   */

  const verifyOtp = async (id: string) => {
    const data = signupForm.getValues();

    if (!data.verificationMethod) {
      throw new Error(
        "Please select a verification method"
      );
    }

    const otp =
      data.verificationMethod === "email"
        ? data.emailVerificationCode
        : data.phoneVerificationCode;

    if (!otp) {
      throw new Error(
        "Please enter the verification code"
      );
    }

    const response = await axios.post(
      PATIENT_REGISTRATION_API.VERIFY_OTP,
      {
        registrationId: id,
        otp,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-organization-id": ORGANIZATION_ID,
        },
      }
    );

    return response.data;
  };

  /*
   * =========================
   * RESEND OTP
   * =========================
   */

  const resendOtp = async (id: string) => {
    await axios.post(
      PATIENT_REGISTRATION_API.RESEND_OTP,
      {
        registrationId: id,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-organization-id": ORGANIZATION_ID,
        },
      }
    );
  };


  /*
   * =========================
   * VALIDATE CURRENT STEP
   * =========================
   */

  const validateCurrentStep = async () => {
    let isValid = false;

    switch (currentStep) {
      case 1:
        isValid = await signupForm.trigger([
          "termsAccepted",
        ]);
        break;

      case 2:
        isValid = true;
        break;

      case 3: {
        const ageValue = signupForm.getValues("isAdult");

        if (
          ageValue === null ||
          ageValue === undefined
        ) {
          signupForm.setError("isAdult", {
            type: "required",
            message: "Please select one option",
          });

          return false;
        }

        isValid = true;
        break;
      }

      case 4: {
        isValid = await signupForm.trigger([
          "email",
          "password",
          "firstName",
          "lastName",
          "dateOfBirth",
          "gender",
          "primaryPhone",
          "streetAddress",
          "city",
          "state",
          "zipCode",
          "informationConfirmed",
        ]);

        if (!isValid) {
          break;
        }

        const data = signupForm.getValues();

        const age = calculateAge(data.dateOfBirth);

        if (age === null) {
          signupForm.setError("dateOfBirth", {
            type: "validate",
            message: "Please enter a valid date of birth",
          });

          return false;
        }

        if (age < 18) {
          signupForm.setError("dateOfBirth", {
            type: "validate",
            message:
              "Account holder must be at least 18 years old.",
          });

          toast.error(
            "The account holder must be at least 18 years old."
          );

          return false;
        }

        isValid = true;

        break;
      }

      case 5: {
        const method = signupForm.getValues(
          "verificationMethod"
        );

        if (!method) {
          signupForm.setError("verificationMethod", {
            message: "Please select a verification method",
          });

          return false;
        }

        const codeField =
          method === "email"
            ? "emailVerificationCode"
            : "phoneVerificationCode";

        isValid = await signupForm.trigger(codeField);

        break;
      }

      case 6:
        if (signupForm.getValues("hasInsuranceCard")) {
          isValid = await signupForm.trigger([
            "insuranceType",
            "insuranceProvider",
            "insuranceId",
            "policyNumber",
            "groupNumber",
            "ediPayer",
            "coverageType",
            "effectiveDate",
          ]);
        } else {
          isValid = true;
        }

        break;
    }

    return isValid;
  };

    /*
     * =========================
     * NEXT STEP
     * =========================
     */

    const handleNext = async () => {
      try {
        const isValid = await validateCurrentStep();

        if (!isValid) {
          return;
        }

        /*
         * STEP 1
         *
         * Create backend registration session.
         */
        if (currentStep === 1) {
          setIsLoading(true);

          const id = await createRegistrationSession();

          setRegistrationId(id);

          setCurrentStep(2);

          return;
        }

        /*
   * STEP 2
   *
   * Complete prerequisites.
   */
        if (currentStep === 2) {
          if (!registrationId) {
            throw new Error(
              "Registration session not found"
            );
          }

          setIsLoading(true);

          await completePrerequisites(registrationId);

          setCurrentStep(3);

          return;
        }

        /*
   * STEP 3
   *
   * Complete age verification.
   */
        if (currentStep === 3) {
          if (!registrationId) {
            throw new Error(
              "Registration session not found"
            );
          }

          setIsLoading(true);

          await completeAgeVerification(registrationId);

          setCurrentStep(4);

          return;
        }

        /*
         * STEP 4
         *
         * Create account.
         */
        if (currentStep === 4) {
          if (!registrationId) {
            throw new Error(
              "Registration session not found"
            );
          }

          setIsLoading(true);

          await createAccount(registrationId);

          setCurrentStep(5);

          return;
        }

        /*
         * STEP 5
         *
         * Verify OTP.
         */
        if (currentStep === 5) {
          if (!registrationId) {
            throw new Error(
              "Registration session not found"
            );
          }

          setIsLoading(true);

          await verifyOtp(registrationId);

          toast.success(
            "Registration completed successfully!"
          );

          setShowInsuranceModal(true);

          return;
        }

        /*
         * STEP 6
         *
         * Insurance is currently UI-only.
         *
         * We will integrate this later.
         */
        if (currentStep === 6) {
          toast.success(
            "Registration completed successfully!"
          );

          router.push("/patient");
        }
      } catch (error: any) {
        console.error(
          "Registration step error:",
          error
        );

        const apiError = error?.response?.data as ApiError;

        toast.error(
          apiError?.message ||
          error?.message ||
          "Registration failed"
        );
      } finally {
        setIsLoading(false);
      }
    };

    /*
     * =========================
     * INSURANCE CHOICE
     * =========================
     *
     * Kept temporarily so existing
     * SignupForm doesn't break.
     */

    const handleInsuranceChoice = async (
      hasInsurance: boolean
    ) => {
      setShowInsuranceModal(false);

      signupForm.setValue(
        "hasInsuranceCard",
        hasInsurance
      );

      if (hasInsurance) {
        setCurrentStep(6);
      } else {
        /*
         * Registration is now already completed
         * at OTP verification.
         */
        router.push("/patient");
      }
    };

    /*
     * =========================
     * SIGN UP SUBMIT
     * =========================
     */

    const onSignUp = async (
    ) => {
      try {
        if (currentStep < totalSteps) {
          await handleNext();
        } else {
          await handleNext();
        }
      } catch (error) {
        console.error(
          "Signup error:",
          error
        );

        toast.error(
          error instanceof Error
            ? error.message
            : "Signup failed"
        );
      }
    };

    /*
     * =========================
     * PREVIOUS
     * =========================
     */

    const goToPreviousStep = () => {
      if (currentStep > 1) {
        setCurrentStep(currentStep - 1);
      }
    };

    /*
     * =========================
     * STEP RENDERING
     * =========================
     */

    const renderStep = () => {
      switch (currentStep) {
        case 1:
          return <TermsAndConditions />;

        case 2:
          return <Step2Prerequisites />;

        case 3:
          return <Step3AgeVerification />;

        case 4:
          return <Step4ProfileCreation />;

        case 5:
          return (
            <Step5Verification
              onSendVerificationCode={sendVerificationCode}
              onResendVerificationCode={resendOtp}
              registrationId={registrationId}
            />
          );

        case 6:
          return (
            <Step6Insurance registrationId={registrationId} />
          );

        default:
          return <TermsAndConditions />;
      }
    };

    const stepTitles = [
      "Terms & Conditions",
      "Prerequisites",
      "Age Verification",
      "Account Creation",
      "Verification",
      "Insurance",
    ];

    return {
      isLoading,
      router,

      signInForm,
      showPassword,
      setShowPassword,
      handleLogin,
      onSignIn,

      signupForm,
      currentStep,
      setCurrentStep,
      totalSteps,

      registrationId,

      showInsuranceModal,
      setShowInsuranceModal,

      handleNext,
      onSignUp,
      goToPreviousStep,

      stepTitles,
      handleInsuranceChoice,
      validateCurrentStep,
      renderStep,

      resendOtp,
    };
  };