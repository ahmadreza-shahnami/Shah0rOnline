import { useState } from "react";
import { useParams } from "react-router";
import instance from "../../../utils/axios";
import { Form, Formik } from "formik";
import FormInput from "../../FormInput";
import Button from "../../Button";
import * as Yup from "yup";

export default function UploadTour() {
  const { slug } = useParams();
  const [title, setTitle] = useState("");
  const [zip, setZip] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [indexUrl, setIndexUrl] = useState<string | null>(null);

  return (
    <Formik
      initialValues={{ title: "", zip_file: null }}
      validationSchema={Yup.object({
        title: Yup.string(),
        zip_file: Yup.mixed<File>()
          .required("فایل زیپ الزامی است.")
          .test("is-zip-type", "Only .zip files are allowed", (value) => {
            if (!value) return true; // Allow optional if not required elsewhere
            return (
              value.type === "application/zip" || value.name.endsWith(".zip")
            );
          }),
      })}
      onSubmit={async (values, { setSubmitting, setErrors, resetForm }) => {
        try {
          await instance.post(`/school/schools/${slug}/virtual-tour/`, values, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          alert("تور مجازی با موفقیت آپلود شد.");
          resetForm();
        } catch (e: Error | any) {
          console.error(e);
          setErrors(e);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ setFieldValue, isSubmitting }) => (
        <Form className="space-y-4">
          <h2 className="text-xl font-bold">آپلود تور مجازی</h2>
          <div className="grid grid-cols-2 not-md:grid-cols-1 gap-6 px-5">
            <FormInput label="عنوان" name="title" />
            <FormInput
              label="اپلود فایل"
              name="zip_file"
              type="file"
              accept=".zip"
              value={undefined}
              required
              onChange={(e: any) => {
                setFieldValue(e.currentTarget.name, e.currentTarget.files?.[0]);
              }}
            />
          </div>
          <Button
            text="آپلود"
            style="submit"
            type="submit"
            disabled={isSubmitting}
          />
        </Form>
      )}
    </Formik>
  );
}
