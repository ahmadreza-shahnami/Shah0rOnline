import React, { createContext, useContext, useEffect, useState } from "react";
// import { useNavigate } from "react-router";
import Cookies, { type CookieChangeListener } from "universal-cookie";
import apiEndpoint from "../api.json";
import instance from "../utils/axios";
// import { jwtDecode, type JwtPayload } from "jwt-decode";

const cookies = new Cookies();

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<object | null>(null);

  // useEffect(() => {
  //   const handleTokenChange: CookieChangeListener = ({ name, value }) => {
  //     if (name === "accessToken") {
  //       if (value) {
  //         try {
  //           const userObject = jwtDecode<any>(value);
  //           console.log("Decoded user object:", userObject);
  //           if (userObject) {
  //             setUser(userObject);
  //           }
  //         } catch (e) {
  //           setUser(null);
  //           cookies.remove("accessToken");
  //         }
  //       } else {
  //         setUser(null);
  //       }
  //     }
  //   };

  //   cookies.addChangeListener(handleTokenChange);

  //   return () => {
  //     cookies.removeChangeListener(handleTokenChange);
  //   };
  // }, []);

  const login = async (credentials: Credential) => {
    const { data } = await instance.post(apiEndpoint.auth.login, credentials);
    setUser(data.data);
    cookies.set("accessToken", data.tokens.access, { path: "/" });
    cookies.set("refreshToken", data.tokens.refresh, { path: "/" });
  };
  const register = async (credentials: Credential) => {
    const { data } = await instance.post(
      apiEndpoint.auth.register,
      credentials
    );
    setUser(data.data);
    cookies.set("accessToken", data.tokens.access, { path: "/" });
    cookies.set("refreshToken", data.tokens.refresh, { path: "/" });
  };

  const logout = () => {
    cookies.remove("accessToken", { path: "/" });
    cookies.remove("refreshToken", { path: "/" });
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
