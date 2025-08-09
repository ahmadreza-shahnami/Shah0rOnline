import * as React from "react";
import NavBar from "../components/NavBar";
import HamburgerBar from "../components/HamburgerBar";
import Footer from "../components/Footer";
import clsx from "clsx";
import { useParams } from "react-router";

const SchoolLayout = ({
  children,
  title,
  hasNavbar = true,
  hasFooter = true,
}: {
  children: React.ReactNode;
  title?: string;
  hasNavbar?: boolean;
  hasFooter?: boolean;
}) => {
  const { slug } = useParams<{ slug: string }>();

  const basePath = slug ? `/schools/${slug}` : "/schools";

  const navItem = [
    { to: "/", label: "سایت اصلی" },
    { to: `${basePath}`, label: "خانه" },
    { to: `${basePath}/students/new`, label: "ثبت نام" },
  ];
  
  return (
    <div className="relative">
      {hasNavbar && (
        <NavBar
          items={navItem}
          userMenuItems={[
            { to: "/profile", label: "پروفایل" },
            { to: "/logout", label: "خروج" },
          ]}
          className={`not-md:hidden block fixed top-0 left-0 right-0 mx-auto h-[50px] max-w-6xl `}
          theme="school"
        />
      )}
      {hasNavbar && (
        <HamburgerBar
          links={navItem}
          theme="school"
          className="md:hidden block"
        />
      )}
      <main
        className={clsx(
          "md:mt-[50px] max-w-6xl not-md:max-w-screen mx-auto bg-slate-50 px-12 py-4 md:min-h-[calc(100vh-50px)] not-md:min-h-screen"
        )}
      >
        {title && (
          <h1 className="font-bold text-3xl pt-10 pb-5 mb-16">{title}</h1>
        )}
        {children}
      </main>
      {hasFooter && <Footer />}
    </div>
  );
};

export default SchoolLayout;
