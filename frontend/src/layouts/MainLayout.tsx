import * as React from "react";
import NavBar from "../components/NavBar";
import HamburgerBar from "../components/HamburgerBar";
import Footer from "../components/Footer";

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
          className={`not-lg:hidden block fixed top-0 right-0 h-[50px]`}
        />
      )}
      {hasNavbar && <HamburgerBar className="lg:hidden fixed top-1 right-1" />}
      <main className={`lg:mt-[50px] max-w-4xl not-lg:max-w-md mx-auto`}>
        {title && <h1 className="font-bold text-3xl py-5 mb-16">{title}</h1>}
        {children}
      </main>
      {hasFooter && <Footer />}
    </div>
  );
};

export default MainLayout;
