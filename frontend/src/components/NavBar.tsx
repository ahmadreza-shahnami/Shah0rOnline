import { Link } from "react-router";

const NavBar = ({ className }: { className?: string }) => {
  return (
    <nav
      className={`bg-blue-400 justify-around items-center flex w-screen flex-row ${className}`}
    >
      <ul className="flex flex-row gap-10">
        <li>
          <Link to={"/"}>خانه</Link>
        </li>
        <li>
          <Link to={"/"}>خانه</Link>
        </li>
        <li>
          <Link to={"/"}>خانه</Link>
        </li>
      </ul>
      <Link
        to={"/login"}
        className="border border-blue-800 bg-blue-600 shadow-md text-sm font-semibold text-white rounded-4xl py-1 px-2 hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out hover:bg-blue-700"
      >
        ورود / ثبت‌نام
      </Link>
    </nav>
  );
};

export default NavBar;
