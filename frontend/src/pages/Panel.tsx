import * as React from "react";
import ApproveNewUsers from "../components/panel/membership/ApproveNewUsers";
import SchoolLayout from "../layouts/SchoolLayout";
import UploadTour from "./../components/panel/virtualTour/UploadTour";
import CreateClass from "../components/panel/classes/CreateClasses";
import CreateGrade from "../components/panel/grades/CreateGrades";
import CreateWeeklySchedule from "../components/panel/classes/CreateWeeklySchedule";

const Panel = () => {
  return (
    <SchoolLayout title="پنل مدرسه">
      <ApproveNewUsers />
      <UploadTour />
      <CreateClass />
      <CreateGrade />
      <CreateWeeklySchedule />
    </SchoolLayout>
  );
};

export default Panel;
