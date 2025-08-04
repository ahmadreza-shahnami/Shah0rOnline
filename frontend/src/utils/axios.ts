import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();
const baseURL = import.meta.env.VITE_APP_API_URL || window.location.host === "localhost:5173" ? "http://localhost:8000" : `https://${window.location.host}`;
const instance = axios.create({ baseURL: baseURL });

instance.interceptors.request.use(
    (config) => {
        const token = cookies.get("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = cookies.get("refreshToken");
                const { data } = await axios.post("/api/auth/refresh", {
                    refresh: refreshToken,
                });
                cookies.set("accessToken", data.access, { path: "/" });
                originalRequest.headers.Authorization = `Bearer ${data.access}`;
                return axios(originalRequest);
            } catch (e) {
                window.location.replace("/login")
                return Promise.reject(e);
            }
        }
        return Promise.reject(error);
    }
);

export default instance;
