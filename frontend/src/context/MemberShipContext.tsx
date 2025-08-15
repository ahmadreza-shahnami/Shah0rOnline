import React, { createContext, useContext, useEffect, useState } from "react";
// import { useNavigate } from "react-router";
import instance from "../utils/axios";
import { useAuth } from "./AuthContext";
import { useParams } from "react-router";

interface Membership {
  role?: string;
  is_approved?: boolean;
  classrooms?: any;
}
const MembershipContext = createContext<any>(null);

export const MembershipProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isLoggedIn } = useAuth();

  const [isMember, setIsMember] = useState<boolean>(false);
  const [membership, setMembership] = useState<Membership | null>(null);
  const param = useParams<{ slug: string }>();

  useEffect(() => {
    const fetchMembership = async () => {
      try {
        const responce = await instance.get(
          `/school/schools/${param.slug}/membership/`
        );
        setMembership(responce.data);
        setIsMember(!!responce.data.role);
      } catch (e) {
        console.error("Error fetching membership:", e);
        setIsMember(false);
        setMembership(null);
      }
    };
    if (isLoggedIn) {
      fetchMembership();
    }
  }, [isLoggedIn]);

  return (
    <MembershipContext.Provider value={{ membership, isMember }}>
      {children}
    </MembershipContext.Provider>
  );
};

export const useMembership = () => useContext(MembershipContext);
