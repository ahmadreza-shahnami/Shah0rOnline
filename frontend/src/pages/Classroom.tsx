import * as React from "react";
import SchoolLayout from "../layouts/SchoolLayout";
import WeeklyScheduleTable, {
  type ScheduleData,
} from "../components/WeeklyScheduleTable";
import { useParams } from "react-router";
import instance from "../utils/axios";

type ClassroomData = {
  id: number;
  grade: string;
  name: string;
  teacher_name: string;
};

const Classroom = () => {
  const { slug, gradeid, classroomid } = useParams<{
    slug: string;
    gradeid: string;
    classroomid: string;
  }>();
  const [classroom, setClassroom] = React.useState<ClassroomData>();
  const [schedule, setSchedule] = React.useState<ScheduleData[]>();

  React.useEffect(() => {
    const fetchClassroom = async () => {
      const res = await instance.get(
        `/school/schools/${slug}/grades/${gradeid}/classrooms/${classroomid}/`
      );
      setClassroom(res.data);
    };
    fetchClassroom();
  }, [slug, gradeid, classroomid]);

  React.useEffect(() => {
    const fetchSchedules = async () => {
      const res = await instance.get(
        `/school/schools/${slug}/grades/${gradeid}/classrooms/${classroomid}/schedule/`
      );
      console.log(res.data)
      setSchedule(res.data);
    };
    fetchSchedules();
  }, [classroom]);
  return (
    <SchoolLayout
      title={classroom ? `${classroom.grade} - ${classroom.name}` : ""}
    >
      <WeeklyScheduleTable data={schedule} />
    </SchoolLayout>
  );
};

export default Classroom;
