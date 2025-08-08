import * as Yup from "yup";
import { useAuth } from "../context/AuthContext";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router";
import Button from "../components/Button";
import BaseForm from "./BaseForm";

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <BaseForm
      initialValues={{ username: "", password: "" }}
      validationSchema={Yup.object({
        username: Yup.string().required("نام کاربری الزامی است."),
        password: Yup.string().required("رمز عبور الزامی است."),
      })}
      onSubmit={async (values, { setSubmitting, setErrors }) => {
        try {
          await login(values);
          navigate(searchParams.get("next") || "/");
        } catch (err: any) {
          setErrors(err.response?.data || { general: "خطا در ورود" });
        } finally {
          setSubmitting(false);
        }
      }}
      inputList={[
        {
          name: "username",
          label: "نام کاربری",
          required: true,
          autoComplete: "username",
        },
        {
          name: "password",
          label: "رمز عبور",
          type: "password",
          required: true,
          autoComplete: "current-password",
        },
      ]}
      submitButton={
        <div className="flex flex-row justify-between px-5">
          <Button text="ورود" type="submit" style="submit" />
          <Link
            className="text-sm text-blue-600 underline w-fit underline-offset-2 font-semibold hover:text-blue-700 cursor-pointer"
            to={{
              pathname: "/register",
              search: searchParams.toString() || "",
            }}
          >
            حساب کاربری ندارید؟ کلیک کنید.
          </Link>
        </div>
      }
    />
  );
};

export default LoginForm;
