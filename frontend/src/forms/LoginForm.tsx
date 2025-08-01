import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router";
import Button from "../components/Button";
import FormInput from "../components/FormInput";

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  return (
    <Formik
      initialValues={{ username: "", password: "" }}
      validationSchema={Yup.object({
        username: Yup.string().required("نام کاربری الزامی است."),
        password: Yup.string().required("رمز عبور الزامی است."),
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
      <Form className="flex flex-col gap-20 w-max p-4">
        <div className="grid grid-cols-2 not-lg:grid-cols-1 gap-y-6 gap-x-10">
          <FormInput name="username" label="نام کاربری" required />
          <FormInput name="password" label="رمز عبور" required />
        </div>
        <div className="flex flex-row justify-between px-5">
          <Button text="ورود" type="submit" style="submit" />
          <Link
            className="text-sm text-blue-600 underline w-fit underline-offset-2 font-semibold hover:text-blue-700 cursor-pointer"
            to={"/register"}
          >
            حساب کاربری ندارید؟ کلیک کنید.
          </Link>
        </div>
      </Form>
    </Formik>
  );
};

export default LoginForm;
