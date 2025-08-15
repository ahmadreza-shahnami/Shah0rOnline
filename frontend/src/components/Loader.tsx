import { useLocation } from "react-router";
import MainLayout from "../layouts/MainLayout";
import SchoolLayout from "../layouts/SchoolLayout";

export function Loader({ message }: { message?: string }) {
  const location = useLocation();
  let Layout = MainLayout;
  if (location.pathname.startsWith("/schools")) {
    Layout = SchoolLayout;
  }
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center py-10">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        {message && <p className="mt-3 text-gray-600">{message}</p>}
      </div>
    </Layout>
  );
}
