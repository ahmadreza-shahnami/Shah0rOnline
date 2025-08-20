import { useEffect, useState } from "react";
import { useParams } from "react-router";
import instance from "../../../utils/axios";
import { Form, Formik } from "formik";
import FormInput from "../../FormInput";
import FormSelect from "../../FormSelect";
import Button from "../../Button";
import * as Yup from "yup";
import FormDateTimePicker from "../../FormDateTimePicker";
import moment from "moment";
import { DateObject } from "react-multi-date-picker";

type Options = { label: string; value: string };
type Class = { id: number; name: string; grade: number };

export default function CreateWeeklySchedule() {
  const { slug } = useParams();

  const [classes, setClasses] = useState<Class[]>([]);
  const [classesOptions, setClassesOptions] = useState<Options[]>([]);
  const days = [
    {
      label: "شنبه",
      value: "0",
    },
    {
      label: "یکشنبه",
      value: "1",
    },
    {
      label: "دوشنبه",
      value: "2",
    },
    {
      label: "سه‌شنبه",
      value: "3",
    },
    {
      label: "چهارشنبه",
      value: "4",
    },
    {
      label: "پنج‌شنبه",
      value: "5",
    },
    {
      label: "جمعه",
      value: "6",
    },
  ];

  useEffect(() => {
    const loadClasses = async () => {
      try {
        const [{ data: c }] = await Promise.all([
          instance.get(`/school/schools/${slug}/grades/all_classrooms/`),
        ]);
        setClasses(c);
        setClassesOptions(
          c.map((cls: Class) => {
            return { label: cls.name, value: String(cls.id) };
          })
        );
      } catch (e) {
        console.error(e);
      }
    };
    loadClasses();
  }, [slug]);

  return (
    <Formik
      initialValues={{
        name: "",
        subject: "",
        classroom: "",
        start_time: "",
        end_time: "",
        day_of_week: "",
      }}
      validationSchema={Yup.object({
        subject: Yup.string().required("موضوع کلاس الزامی است."),
        classroom: Yup.string()
          .required("کلاس الزامی است.")
          .test((value) => {
            if (value && !isNaN(Number(value)) && Number(value) > 0)
              return true;
            return false;
          }),
        day_of_week: Yup.string()
          .required("روز الزامی است.")
          .test((value) => {
            if (
              value &&
              !isNaN(Number(value)) &&
              Number(value) >= 0 &&
              Number(value) < 7
            )
              return true;
            return false;
          }),
        start_time: Yup.string().required("شروع الزامی است."),
        end_time: Yup.string().required("پایان الزامی است."),
      })}
      onSubmit={async (values, { setSubmitting, resetForm, setErrors }) => {
        try {
          const cls = classes.find(
            (cls) => cls.id === Number(values.classroom)
          );

          // format start_time and end_time properly
          const payload = {
            ...values,
            days_of_week: Number(values.day_of_week),
            start_time: moment(
              new DateObject(values.start_time).toDate()
            ).format("HH:mm:ss"),
            end_time: moment(new DateObject(values.end_time).toDate()).format(
              "HH:mm:ss"
            ),
          };

          await instance.post(
            `/school/schools/${slug}/grades/${cls?.grade}/classrooms/${cls?.id}/schedule/`,
            payload
          );
          alert("برنامه اضافه شد.");
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
        <h2 className="text-xl font-bold">ساخت برنامه هفتگی</h2>
        <div className="grid grid-cols-2 gap-6 not-md:grid-cols-1 px-5">
          <FormInput
            label="موضوع کلاس"
            name="subject"
            required
            placeholder="مثل: فارسی"
          />
          <FormSelect
            label="کلاس"
            name="classroom"
            required
            options={classesOptions}
          />
          <FormDateTimePicker
            label="شروع"
            name="start_time"
            format="HH:mm"
            placeholder="ساعت را انتخاب کنید."
            disableDayPicker
            required
          />
          <FormDateTimePicker
            label="پایان"
            name="end_time"
            format="HH:mm"
            placeholder="ساعت را انتخاب کنید."
            disableDayPicker
            required
          />
          <FormSelect
            label="روز‌ هفته"
            name="day_of_week"
            required
            options={days}
          />
        </div>
        <Button text="ثبت کلاس" style="submit" type="submit" />
      </Form>
    </Formik>
  );
}
