import * as React from "react";
import ApproveNewUsers from "../components/panel/membership/ApproveNewUsers";
import SchoolLayout from "../layouts/SchoolLayout";
import UploadTour from "./../components/panel/virtualTour/UploadTour";
import CreateClass from "../components/panel/classes/CreateClasses";
import CreateGrade from "../components/panel/grades/CreateGrades";
import CreateWeeklySchedule from "../components/panel/classes/CreateWeeklySchedule";
import MemberAccess from "../components/MemberAccess";

const Panel = () => {
  return (
    <SchoolLayout title="پنل مدرسه">
      <div className="flex flex-col gap-5 *:border-2 *:p-5 *:border-green-900 *:rounded-3xl ">
        <MemberAccess roles={["principal"]}>
          <ApproveNewUsers />
        </MemberAccess>
        {/* <MemberAccess roles={["principal"]}>
          <UploadTour />
        </MemberAccess> */}
        <MemberAccess roles={["principal"]}>
          <CreateClass />
        </MemberAccess>
        <MemberAccess roles={["principal"]}>
          <CreateGrade />
        </MemberAccess>
        <MemberAccess roles={["principal"]}>
          <CreateWeeklySchedule />
        </MemberAccess>
      </div>
    </SchoolLayout>
  );
};

export default Panel;
