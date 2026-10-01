
// This file contains the base URL for the API
export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const PATIENT_AUTH_API = {
  LOGIN: `${BASE_URL}/auth/login`,
  LOGOUT: `${BASE_URL}/auth/logout`,
};

export const PATIENT_REGISTRATION_API = {
  SESSION: `${BASE_URL}/patients/registration/session`,

  PREREQUISITES: `${BASE_URL}/patients/registration/prerequisites/complete`,

  AGE_VERIFICATION: `${BASE_URL}/patients/registration/age-verification/complete`,

  ACCOUNT: `${BASE_URL}/patients/registration/account`,

  VERIFICATION_METHOD: `${BASE_URL}/patients/registration/verification-method`,

  VERIFY_OTP: `${BASE_URL}/patients/registration/verify-otp`,

  RESEND_OTP: `${BASE_URL}/patients/registration/resend-otp`,

  INSURANCE: (registrationId: string) =>
    `${BASE_URL}/patients/registration/${registrationId}/insurance`,
};

export const PATIENT_INSURANCE_API = {
  CREATE: `${BASE_URL}/insurance`,

  GET: `${BASE_URL}/insurance`,

  GET_SINGLE: (insuranceId: string) =>
    `${BASE_URL}/insurance/${insuranceId}`,

  UPDATE: (insuranceId: string) =>
    `${BASE_URL}/insurance/${insuranceId}`,

  DELETE: (insuranceId: string) =>
    `${BASE_URL}/insurance/${insuranceId}`,
};

export const PATIENT_APPOINTMENT_API = {
  CREATE: `${BASE_URL}/appointments`,

  GET_ALL: `${BASE_URL}/appointments`,

  GET_SINGLE: (appointmentId: string) =>
    `${BASE_URL}/appointments/${appointmentId}`,

  GET_DOCTORS: `${BASE_URL}/appointments/doctors`,

  GET_AVAILABLE_APPOINTMENT_SLOTS:
    `${BASE_URL}/appointments/available-slots`,

  RESCHEDULE: (appointmentId: string) =>
    `${BASE_URL}/appointments/${appointmentId}/reschedule`,
};


export const PATIENT_FAMILY_API = {
  GET_ALL: `${BASE_URL}/patients/me/family-members`,

  CREATE: `${BASE_URL}/patients/me/family-members`,

  GET_SINGLE: (id: string) =>
    `${BASE_URL}/patients/me/family-members/${id}`,

  UPDATE: (id: string) =>
    `${BASE_URL}/patients/me/family-members/${id}`,

  DELETE: (id: string) =>
    `${BASE_URL}/patients/me/family-members/${id}`,
};


export const PATIENT_MEDICAL_RECORDS_API = {
  GET_ALL: `${BASE_URL}/clinical-records/my-history`,
  GET_SINGLE: (id: string) =>
    `${BASE_URL}/clinical-records/${id}`,
};


export const PATIENT_PAYMENT_API = {
  CREATE: `${BASE_URL}/patient/payments/intent`,
}


export const PATIENT_TELEMEDICINE_API = {
  GET: (appointmentId: any) => `${BASE_URL}/patient/telemedicine/${appointmentId}/session`,
}


export const PATIENT_PROFILE_API = {
  GET: `${BASE_URL}/patient/me`,
  UPDATE: `${BASE_URL}/patient/profile`,
};


