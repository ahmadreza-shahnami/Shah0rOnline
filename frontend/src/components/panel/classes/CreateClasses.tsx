import { useEffect, useState } from "react";
import { useParams } from "react-router";
import instance from "../../../utils/axios";
import { Form, Formik } from "formik";
import FormInput from "../../FormInput";
import FormSelect from "../../FormSelect";

type Options = { label: string; value: string };
type Grade = { id: number; name: string };
type Teacher = { id: number; user: string };

export default function CreateClass() {
  const { slug } = useParams();
  const [name, setName] = useState("");
  const [gradeId, setGradeId] = useState<number | "">("");
  const [teacherMembershipId, setTeacherMembershipId] = useState<number | "">(
    ""
  );
  const [grades, setGrades] = useState<Options[]>([]);
  const [teachers, setTeachers] = useState<Options[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [{ data: g }, { data: t }] = await Promise.all([
          instance.get(`/school/schools/${slug}/grades/`),
          instance.get(`/school/schools/${slug}/memberships/`, {
            params: { role__name: "teacher" },
          }),
        ]);
        setGrades(
          g?.map((grade: Grade) => {
            return { label: grade.name, value: String(grade.id) };
          })
        );
        setTeachers(
          t?.map((teacher: Teacher) => {
            return { label: teacher.user, value: String(teacher.id) };
          })
        );
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, [slug]);

  const submit = async () => {
    if (!name.trim() || !gradeId) return;
    setLoading(true);
    try {
      await instance.post(`/school/schools/${slug}/classes/`, {
        name,
        grade: gradeId,
        teacher_membership: teacherMembershipId || null,
      });
      setName("");
      setGradeId("");
      setTeacherMembershipId("");
      alert("کلاس ساخته شد.");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    // <div dir="rtl" className="space-y-4">
    <Formik
      initialValues={{ name: "", teacher: "" }}
      onSubmit={() => {}}
      className="space-y-4"
    >
      <Form className="grid gap-3 max-w-xl space-y-4">
        <h2 className="text-xl font-bold">ساخت کلاس</h2>
        <FormInput
          label="نام کلاس"
          name="name"
          required
          placeholder="مثل: 1/1"
        />
        <FormSelect label="پایه" name="grade" required options={grades} />
        <FormSelect label="معلم" name="teacher" options={teachers} />
      </Form>
    </Formik>
  );
}
