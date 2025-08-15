import React, { createContext, useContext, useEffect, useState } from "react";
// import { useNavigate } from "react-router";
import Cookies, { type CookieChangeListener } from "universal-cookie";
import apiEndpoint from "../api.json";
import instance from "../utils/axios";
import { jwtDecode, type JwtPayload } from "jwt-decode";

const cookies = new Cookies();

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!cookies.get("user"));
  const [user, setUser] = useState<object | null>(cookies.get("user"));

  useEffect(() => {
    const handleUserChange: CookieChangeListener = ({ name, value }) => {
      if (name === "user") {
        setIsLoggedIn(!!value);
        if (value) {
          try {
            setUser(value);
          } catch (e) {
            setUser(null);
            cookies.remove("user");
            cookies.remove("accessToken");
            cookies.remove("refreshToken");
          }
        } else {
          setUser(null);
        }
      } else if (name === "refreshToken") {
        if (!value) {
          setUser(null);
        }
      } else if (name === "accessToken") {
        if (!value) {
        }
      }
    };

    cookies.addChangeListener(handleUserChange);

    return () => {
      cookies.removeChangeListener(handleUserChange);
    };
  }, []);

  const setCookies = (data: any) => {
    const accessDecoderExp = jwtDecode<JwtPayload>(data.tokens.access).exp || 0;
    const refreshDecoderExp =
      jwtDecode<JwtPayload>(data.tokens.refresh).exp || 0;
    cookies.set("user", data.data, { path: "/" });
    cookies.set("accessToken", data.tokens.access, {
      path: "/",
      expires: new Date(accessDecoderExp * 1000),
    });
    cookies.set("refreshToken", data.tokens.refresh, {
      path: "/",
      expires: new Date(refreshDecoderExp * 1000),
    });
  };

  const login = async (credentials: Credential) => {
    const { data } = await instance.post(apiEndpoint.auth.login, credentials);
    setCookies(data);
  };

  const register = async (credentials: Credential) => {
    const { data } = await instance.post(
      apiEndpoint.auth.register,
      credentials
    );
    setCookies(data);
  };

  const refresh = async (credentials: Credential) => {
    try {
      const { data } = await instance.post(
        apiEndpoint.auth.refresh,
        credentials
      );
      const accessDecoderExp =
        jwtDecode<JwtPayload>(data.access).exp || 0;
      const refreshDecoderExp =
        jwtDecode<JwtPayload>(data.refresh).exp || 0;
      cookies.set("accessToken", data.access, {
        path: "/",
        expires: new Date(accessDecoderExp * 1000),
      });
      cookies.set("refreshToken", data.refresh, {
        path: "/",
        expires: new Date(refreshDecoderExp * 1000),
      });
    } catch (e) {
      logout();
    }
  };

  const logout = () => {
    cookies.remove("user", { path: "/" });
    cookies.remove("accessToken", { path: "/" });
    cookies.remove("refreshToken", { path: "/" });
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
