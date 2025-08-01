import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router";
import Button from "../components/Button";
import FormInput from "../components/FormInput";

const RegisterForm = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const initialValues = {
    username: "",
    password: "",
    confirm_password: "",
    first_name: "",
    last_name: "",
    sex: "male",
    phone: "",
    national_code: "",
    email: "",
    address: "",
  };

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, "نام کاربری از 3 حرف کمتر نباشد")
      .required(".نام کاربری الزامی است")
      .matches(
        /^[A-za-zآابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی]+/,
        "نام کاربری را به درستی وارد کنید."
      ),
    first_name: Yup.string().required("نام الزامی است."),
    last_name: Yup.string().required("نام‌خانوادگی الزامی است."),
    phone: Yup.string()
      .min(11, "شماره وارد شده صحیح نیست.")
      .required("شماره تلفن الزامی است.")
      .matches(/^[09].[0-9]{9}$/, "شماره تلفن خود را به درستی وارد کنید. "),
    password: Yup.string()
      .required("رمز عبور الزامی میباشد.")
      .min(5, "رمز عبور کوتاه میباشد.")
      .matches(/[a-zA-Z]/, "رمز عبور باید فقط شامل حروف انگلیسی باشد."),
    confirm_password: Yup.string()
      .oneOf([Yup.ref("password")], "رمز عبور باید یکسان باشد.")
      .required("تاییدیه رمز عبور الزامی است."),
    national_code: Yup.string()
      .required("کد ملی الزامی است.")
      .test(
        "nationalCodeValid",
        "فرمت کد ملی صحیح نمی باشد.",
        function (value) {
          if (!/^\d{10}$/.test(value)) return false;
          const check = +value[9];
          const sum =
            value
              .split("")
              .slice(0, 9)
              .reduce((acc, x, i) => acc + +x * (10 - i), 0) % 11;
          return sum < 2 ? check === sum : check + sum === 11;
        }
      ),
    address: Yup.string(),
    email: Yup.string().email(),
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting, setErrors }) => {
        try {
          await register(values);
          navigate("/login");
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
          <FormInput name="phone" label="شماره تلفن" required />
          <FormInput name="password" label="رمز عبور" required />
          <FormInput
            name="confirm_password"
            label="تاییدیه رمز عبور"
            required
          />
          <FormInput name="first_name" label="نام" required />
          <FormInput name="last_name" label="نام خانوادگی" required />
        </div>
        <div className="flex flex-row justify-between px-5">
          <Button text="ثبت‌نام" type="submit" style="submit" />
          <Link
            className="text-sm text-blue-600 underline w-fit underline-offset-2 font-semibold hover:text-blue-700 cursor-pointer"
            to={"/login"}
          >
            حساب کاربری دارید؟ کلیک کنید.
          </Link>
        </div>
      </Form>
    </Formik>
  );
};

export default RegisterForm;
