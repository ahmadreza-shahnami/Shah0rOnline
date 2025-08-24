import type React from "react";
import { useMembership } from "../context/MemberShipContext";

type MemberAccessProps = {
  children: React.ReactNode;
  roles: string[];
};

const MemberAccess = ({ children, roles }: MemberAccessProps) => {
  const membershipContext = useMembership();
  if (!membershipContext?.isMember) return null;
  if (
    membershipContext.membership?.is_approved &&
    roles.some((role) => membershipContext.membership?.role === role)
  )
    return children;
  return null;
};

export default MemberAccess;
