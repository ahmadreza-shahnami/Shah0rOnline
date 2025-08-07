import axios from "axios";
import { jwtDecode, type JwtPayload } from "jwt-decode";
import Cookies from "universal-cookie";
import { auth } from "../api.json"

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
        console.log("Fdfdf")
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = cookies.get("refreshToken");
                const { data } = await axios.post(auth.refresh, {
                    refresh: refreshToken,
                });
                const accessDecoderExp = jwtDecode<JwtPayload>(data.access).exp || 0;
                const refreshDecoderExp =
                    jwtDecode<JwtPayload>(data.refresh).exp || 0;
                cookies.set("accessToken", data.tokens.access, {
                    path: "/",
                    expires: new Date(accessDecoderExp),
                });
                cookies.set("refreshToken", data.tokens.refresh, {
                    path: "/",
                    expires: new Date(refreshDecoderExp),
                });
                originalRequest.headers.Authorization = `Bearer ${data.access}`;
                return axios(originalRequest);
            } catch (e) {
                cookies.remove("user", { path: "/" });
                cookies.remove("accessToken", { path: "/" });
                cookies.remove("refreshToken", { path: "/" });
                window.location.replace("/login")
                return Promise.reject(e);
            }
        }
        return Promise.reject(error);
    }
);


export default instance;
