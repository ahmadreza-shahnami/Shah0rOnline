import * as React from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

const LogOut = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  React.useEffect(() => {
    logout();
    navigate("/");
  }, [logout, navigate]);
  return null;
};

export default LogOut;
