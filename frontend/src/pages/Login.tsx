import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto p-4">
      <Formik
        initialValues={{ phone: "", password: "" }}
        validationSchema={Yup.object({
          phone: Yup.string().required("Phone required"),
          password: Yup.string().required("Password required"),
        })}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          try {
            await login(values);
            navigate("/");
          } catch (err) {
            setErrors({ password: "Invalid credentials" });
          } finally {
            setSubmitting(false);
          }
        }}
      >
        <Form className="flex flex-col gap-4">
          <label>
            Phone
            <Field name="phone" type="text" className="w-full p-2 border" />
            <ErrorMessage
              name="phone"
              component="div"
              className="text-red-500"
            />
          </label>
          <label>
            Password
            <Field
              name="password"
              type="password"
              className="w-full p-2 border"
            />
            <ErrorMessage
              name="password"
              component="div"
              className="text-red-500"
            />
          </label>
          <button type="submit" className="bg-blue-600 text-white p-2 rounded">
            Login
          </button>
          <Link
            className="text-sm text-blue-600 underline underline-offset-2 font-semibold hover:text-blue-700 cursor-pointer"
            to={"/register"}
          >
            اکانت ندارید؟ کلیک کنید
          </Link>
        </Form>
      </Formik>
    </div>
  );
};

export default Login;
