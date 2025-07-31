import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto p-4">
      <Formik
        initialValues={{
          username: "",
          password: "",
          confirm_password: "",
          first_name: "",
          last_name: "",
          sex: "male",
          phone_number: "",
          national_code: "",
          email: "",
          address: "",
        }}
        validationSchema={Yup.object({
          username: Yup.string()
            .min(3, "نام کاربری از 3 حرف کمتر نباشد")
            .required("نام کاربری را وارد کنید")
            .matches(
              /^[A-za-zآابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی]+/,
              "نام کاربری را به درستی وارد کنید"
            ),
          first_name: Yup.string().required(),
          last_name: Yup.string().required(),
          phone_number: Yup.string()
            .min(11, "شماره وارد شده صحیح نیست")
            .required("تلفن را وارد کنید")
            .matches(
              /^[09].[0-9]{9}$/,
              "شماره تلفن خود را به درستی وارد کنید "
            ),
          password: Yup.string()
            .required("Password is required")
            .min(5, "Your password is too short.")
            .matches(/[a-zA-Z]/, "Password can only contain Latin letters."),
          confirm_password: Yup.string()
            .oneOf([Yup.ref("password")], "Passwords must match")
            .required(),
          national_code: Yup.string()
            .required("لطفا کد ملی خود را وارد کنید")
            .test(
              "nationalCodeValid",
              "فرمت کد ملی صحیح نمی باشد",
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
          email: Yup.string().required().email(),
          address: Yup.string().required(),
        })}
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
        <Form className="flex flex-col gap-4">
          <button type="submit" className="bg-blue-600 text-white p-2 rounded">
            Register
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

export default Register;
