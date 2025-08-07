import * as React from "react";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import MainLayout from "../layouts/MainLayout";
import instance from "../utils/axios";
import { test } from "../api.json";

const modules = [
  {
    name: "مدیریت مدرسه",
    description: "ثبت کلاس‌ها، معلم‌ها و دانش‌آموزان",
    path: "/school",
  },
  { name: "آموزش", description: "دروس، امتحانات، نمرات", path: "/education" },
  {
    name: "ارتباطات",
    description: "پیام‌ها، اطلاعیه‌ها و ارتباط اولیا",
    path: "/communication",
  },
  {
    name: "فروشگاه",
    description: "مدیریت پرداخت‌ها، کیف پول و خریدها",
    path: "/shop",
  },
];

const HomePage = () => {
  const { isLoggedIn } = useAuth();
  return (
    <MainLayout>
      <div className="flex flex-col items-center gap-6 ">
        <h1 className="text-3xl font-bold text-center text-blue-700 mt-10">
          به سامانه مدارس هوشمند خوش آمدید
        </h1>
        <p className="max-w-xl text-slate-700 text-justify">
          این سامانه با هدف یکپارچه‌سازی مدیریت، آموزش و ارتباط در مدارس طراحی
          شده است. با امکانات متنوع برای مدیر، معلم، والدین و دانش‌آموزان.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-6 mt-10">
          {modules.map((mod) => (
            <Link
              to={mod.path}
              key={mod.name}
              className="bg-white border border-blue-200 hover:border-blue-400 hover:shadow-lg transition-all rounded-xl p-5 text-right"
            >
              <h3 className="text-xl font-semibold text-blue-800">
                {mod.name}
              </h3>
              <p className="text-slate-600 text-sm mt-2">{mod.description}</p>
            </Link>
          ))}
        </div>

        <div className="mt-12">
          {isLoggedIn ? (
            <Link
              to="/"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full shadow transition-all"
            >
              رفتن به پنل کاربری
            </Link>
          ) : (
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full shadow transition-all"
            >
              ورود / ثبت‌نام
            </Link>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default HomePage;
