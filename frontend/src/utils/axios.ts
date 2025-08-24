import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();
// export const BASEURL = import.meta.env.VITE_APP_API_URL || window.location.host === "localhost:5173" ? "http://localhost:8000" : `http://${window.location.host}/api`;
export const BASEURL = import.meta.env.VITE_APP_API_URL || "http://localhost:8000/api";
const instance = axios.create({ baseURL: BASEURL });

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
            window.location.replace(`/login?next=${window.location.pathname}`)
        }
        return Promise.reject(error);
    }
);


export default instance;
