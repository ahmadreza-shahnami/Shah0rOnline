import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import instance from "../../../utils/axios";

interface GradeFormProps {
  gradeId?: number; // اگر وجود داشت => ویرایش
  onSuccess?: () => void;
}

export default function GradeForm({ gradeId, onSuccess }: GradeFormProps) {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: { name: "", description: "" },
    validationSchema: Yup.object({
      name: Yup.string().required("نام پایه الزامی است"),
      description: Yup.string(),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        if (gradeId) {
          await instance.put(`/grades/${gradeId}/`, values);
        } else {
          await instance.post("/grades/", values);
        }
        onSuccess?.();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    if (gradeId) {
      instance.get(`/grades/${gradeId}/`).then((res) => {
        formik.setValues(res.data);
      });
    }
  }, [gradeId]);

  return (
    <div className="max-w-md mx-auto">
      <div>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <input placeholder="نام پایه" {...formik.getFieldProps("name")} />
          {formik.touched.name && formik.errors.name && (
            <p className="text-red-500 text-sm">{formik.errors.name}</p>
          )}

          <input
            placeholder="توضیحات"
            {...formik.getFieldProps("description")}
          />

          <button type="submit" disabled={loading}>
            {gradeId ? "ویرایش پایه" : "ایجاد پایه"}
          </button>
        </form>
      </div>
    </div>
  );
}
