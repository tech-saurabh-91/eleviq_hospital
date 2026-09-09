
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
};

export const PATIENT_INSURANCE_API = {
  CREATE: `${BASE_URL}/insurance`,
  GET: `${BASE_URL}/insurance`,
};

export const PATIENT_APPOINTMENT_API = {
  CREATE: `${BASE_URL}/appointments/create`,
  GET_ALL: `${BASE_URL}/patient/appointments`,
  DELETE: (id: any) => `${BASE_URL}/patient/appointments/${id}`,
  GET_AVAILABLE_APPOINTMENT_SLOTS: (id: any) => `${BASE_URL}/patient/appointments/${id}`,
};


export const PATIENT_FAMILY_API = {
  GET_ALL: `${BASE_URL}/patient/family`,
  GET_SINGLE: (id: any) => `${BASE_URL}/patient/family/${id}`,
  ADD_FAMILY_MEMBER: `${BASE_URL}/patient/family`,
};


export const PATIENT_MEDICAL_RECORDS_API = {
  GET_ALL: `${BASE_URL}/patient/medical-records`,
  GET_SINGLE: (id: any) => `${BASE_URL}/patient/medical-records/${id}`,
}


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


