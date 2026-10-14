import axios from "axios";

const api = axios.create({
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined" && error.response?.status === 401) {
      window.dispatchEvent(new Event("patient-session-expired"));
    }

    return Promise.reject(error);
  }
);

export default api;
