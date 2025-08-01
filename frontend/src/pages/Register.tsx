import RegisterForm from "../forms/RegisterForm";
import MainLayout from "../layouts/MainLayout";

const Register = () => {
  return (
    <MainLayout title="ثبت‌نام" hasFooter={false}>
      <RegisterForm />
    </MainLayout>
  );
};

export default Register;
