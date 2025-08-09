import * as React from "react";
import MainLayout from "../layouts/MainLayout";
import { useLocation } from "react-router";
import SchoolLayout from "../layouts/SchoolLayout";

const NotFound = () => {
  const location = useLocation();
  let Layout = MainLayout;
  if (location.pathname.startsWith("/schools")) {
    Layout = SchoolLayout;
  }
  return (
    <Layout>
      <h1>اخطار 404</h1>
      <p>صفحه مورد نظر یافت نشد.</p>
    </Layout>
  );
};

export default NotFound;
