import { useEffect, useState } from "react";
import { useParams } from "react-router";
import instance from "../../../utils/axios";
import { Form, Formik } from "formik";
import FormInput from "../../FormInput";
import FormSelect from "../../FormSelect";
import Button from "../../Button";
import * as Yup from "yup";

type Options = { label: string; value: string };
type Grade = { id: number; name: string };
type Teacher = { id: number; user: string };

export default function CreateClass() {
  const { slug } = useParams();

  const [grades, setGrades] = useState<Options[]>([]);
  const [teachers, setTeachers] = useState<Options[]>([]);

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

  return (
    <Formik
      initialValues={{ name: "", teacher: "", grade: "" }}
      validationSchema={Yup.object({
        name: Yup.string().required("نام کلاس الزامی است."),
        grade: Yup.string()
          .required("پایه الزامی است.")
          .test((value) => {
            if (value && !isNaN(Number(value)) && Number(value) > 0)
              return true;
            return false;
          }),
        teacher: Yup.string().test((value) => {
          if (value && !isNaN(Number(value)) && Number(value) > 0) return true;
          return false;
        }),
      })}
      onSubmit={async (values, { setSubmitting, resetForm, setErrors }) => {
        try {
          await instance.post(
            `/school/schools/${slug}/grades/${values.grade}/classrooms/`,
            values
          );
          alert("کلاس ساخته شد.");
          resetForm();
        } catch (e: Error | any) {
          console.error(e);
          setErrors(e);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      <Form className="space-y-4">
        <h2 className="text-xl font-bold">ساخت کلاس</h2>
        <div className="grid grid-cols-2 gap-6 not-md:grid-cols-1 px-5">
          <FormInput
            label="نام کلاس"
            name="name"
            required
            placeholder="مثل: 1/1"
          />
          <FormSelect label="پایه" name="grade" required options={grades} />
          <FormSelect label="معلم" name="teacher" options={teachers} />
        </div>
        <Button text="ثبت کلاس" style="submit" type="submit" />
      </Form>
    </Formik>
  );
}
