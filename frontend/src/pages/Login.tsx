import LoginForm from "../forms/LoginForm";
import MainLayout from "../layouts/MainLayout";

const Login = () => {
  return (
    <MainLayout title="ورود" hasFooter={false}>
      <LoginForm />
    </MainLayout>
  );
};

export default Login;
