import * as React from "react";
import ApproveNewUsers from "../components/panel/membership/ApproveNewUsers";
import SchoolLayout from "../layouts/SchoolLayout";
import UploadTour from "./../components/panel/virtualTour/UploadTour";
import CreateClass from "../components/panel/classes/CreateClasses";

const Panel = () => {
  return (
    <SchoolLayout>
      <ApproveNewUsers />
      <UploadTour />
      <CreateClass />
    </SchoolLayout>
  );
};

export default Panel;
