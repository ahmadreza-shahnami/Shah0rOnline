import * as React from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

const LogOut = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  React.useEffect(() => {
    try {
      logout();
    } catch (e) {
      console.log(e);
    }
    navigate("/");
  }, [navigate]);
  return null;
};

export default LogOut;
