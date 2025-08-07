import * as React from "react";
import MainLayout from "../layouts/MainLayout";

const UnAuthorized = () => {
  return (
    <MainLayout>
      <h1>ارور 401</h1>
      <p>سطح دسترسی شما برای ورود به این صفحه کافی نمی باشد.</p>
    </MainLayout>
  );
};

export default UnAuthorized;
