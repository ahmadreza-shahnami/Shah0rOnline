import * as React from "react";
import NavBar from "../components/NavBar";
import HamburgerBar from "../components/HamburgerBar";
import Footer from "../components/Footer";
import clsx from "clsx";

const MainLayout = ({
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
  return (
    <div className="relative">
      {hasNavbar && (
        <NavBar
          className={`not-md:hidden block fixed top-0 left-0 right-0 mx-auto h-[50px] max-w-6xl `}
        />
      )}
      {hasNavbar && <HamburgerBar className="md:hidden block" />}
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

export default MainLayout;
