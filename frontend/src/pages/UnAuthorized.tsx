import * as React from "react";
import MainLayout from "../layouts/MainLayout";
import { useLocation } from "react-router";
import SchoolLayout from "../layouts/SchoolLayout";

const UnAuthorized = () => {
  const location = useLocation();
  let Layout = MainLayout;
  if (location.pathname.startsWith("/schools")) {
    Layout = SchoolLayout;
  }
  return (
    <Layout>
      <h1>ارور 401</h1>
      <p>سطح دسترسی شما برای ورود به این صفحه کافی نمی باشد.</p>
    </Layout>
  );
};

export default UnAuthorized;
