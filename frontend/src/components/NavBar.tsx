import { Link, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";
import { DropdownMenu } from "radix-ui";
import { AvatarIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import clsx from "clsx";

const NavBar = ({ className }: { className?: string }) => {
  const { isLoggedIn, user } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;
  const userName = user?.username || "کاربر";

  return (
    <nav
      className={clsx(
        "bg-blue-400 flex justify-around items-center w-full p-4",
        className
      )}
    >
      <ul className="flex flex-row gap-10">
        <NavbarListItem to="/" label="خانه" currentPath={currentPath} />
        {/* در آینده: مثلا لینک‌های نوتیفیکیشن‌ها یا درباره ما */}
      </ul>

      {isLoggedIn ? (
        <DropdownMenu.Root dir="rtl" modal={false}>
          <DropdownMenu.Trigger asChild>
            <button
              className="group border border-blue-800 bg-blue-600 shadow-md text-sm flex items-center gap-2
              font-semibold text-white rounded-full py-1 px-3 cursor-pointer  hover:scale-105 hover:shadow-lg 
              data-[state=open]:scale-105 data-[state=open]:shadow-lg transition-all duration-300"
            >
              <AvatarIcon className="w-5 h-5" />
              {userName}
              <ChevronDownIcon className="w-3 h-3 transition-transform duration-500 group-data-[state=open]:rotate-180" />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              className="bg-white shadow-lg rounded-md py-2 px-4 min-w-[150px] text-center"
              sideOffset={5}
            >
              <DropdownMenu.Arrow className="fill-white" />
              <DropdownMenu.Item asChild>
                <Link
                  to="/logout"
                  className="text-sm text-gray-800 hover:text-blue-600 transition font-semibold"
                >
                  خروج
                </Link>
              </DropdownMenu.Item>
              {/* آینده: تنظیمات، پروفایل، تغییر زبان، و ... */}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      ) : (
        <Link
          to="/login"
          className="border border-blue-800 bg-blue-600 text-white text-sm font-semibold rounded-full py-1 px-4 shadow-md hover:scale-105 hover:shadow-lg transition-all duration-300"
        >
          ورود / ثبت‌نام
        </Link>
      )}
    </nav>
  );
};

const NavbarListItem = ({
  to,
  label,
  currentPath,
  className,
}: {
  to: string;
  label: string;
  currentPath: string;
  className?: string;
}) => {
  return (
    <li>
      <Link
        to={to}
        className={clsx(
          "text-white font-semibold transition duration-300 ease-in-out hover:scale-105",
          currentPath === to
            ? "underline underline-offset-8 scale-105 decoration-2 decoration-blue-800"
            : "",
          className
        )}
      >
        {label}
      </Link>
    </li>
  );
};

export default NavBar;
