import axios from "axios";

const BASE_URL = "https://adminnps.ayursinfotech.com/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken =
          localStorage.getItem("refreshToken");

        const response = await axios.post(
          `${BASE_URL}/v1/auth/refersh-token`,
          {
            refreshToken,
          }
        );

        const newAccessToken =
          response.data.data.access_token;

        localStorage.setItem(
          "accessToken",
          newAccessToken
        );

        api.defaults.headers.common[
          "Authorization"
        ] = `${newAccessToken}`;

        originalRequest.headers[
          "Authorization"
        ] = `${newAccessToken}`;

        return api(originalRequest);
      } catch (err) {
        // localStorage.clear();
        // window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;