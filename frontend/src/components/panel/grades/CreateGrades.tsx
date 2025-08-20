import { useParams } from "react-router";
import instance from "../../../utils/axios";
import { Form, Formik } from "formik";
import FormInput from "../../FormInput";
import Button from "../../Button";
import * as Yup from "yup";

export default function CreateGrade() {
  const { slug } = useParams();

  return (
    <Formik
      initialValues={{ name: "" }}
      validationSchema={Yup.object({
        name: Yup.string().required("نام کلاس الزامی است."),
      })}
      onSubmit={async (values, { setSubmitting, resetForm, setErrors }) => {
        try {
          await instance.post(`/school/schools/${slug}/grades/`, values);
          alert("پایه ساخته شد.");
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
        <h2 className="text-xl font-bold">ساخت پایه</h2>
        <div className="grid grid-cols-2 gap-6 not-md:grid-cols-1 px-5">
          <FormInput
            label="نام پایه"
            name="name"
            required
            placeholder="مثل: اول"
          />
        </div>
        <Button text="ثبت پایه" style="submit" type="submit" />
      </Form>
    </Formik>
  );
}
