import { Link, useLocation } from "react-router";
import { DropdownMenu } from "radix-ui";
import { AvatarIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import { useAuth } from "../context/AuthContext";

// 🎨 تم‌ها
const themes = {
  default: {
    bg: "bg-blue-400",
    border: "border-blue-800",
    accent: "bg-blue-600",
    text: "text-white",
    activeUnderline: "decoration-blue-800",
  },
  school: {
    bg: "bg-green-500",
    border: "border-green-800",
    accent: "bg-green-700",
    text: "text-white",
    activeUnderline: "decoration-green-800",
  },
};

type NavbarProps = {
  items: { to: string; label: string }[]; // لینک‌ها
  userMenuItems?: { to: string; label: string }[]; // منوی کاربری
  theme?: keyof typeof themes;
  className?: string;
};

const NavBar = ({
  items,
  userMenuItems = [],
  theme = "default",
  className,
}: NavbarProps) => {
  const { isLoggedIn, user } = useAuth();
  const userName = user?.username || "کاربر";
  const location = useLocation();
  const currentPath = location.pathname;
  const t = themes[theme];

  return (
    <nav
      className={clsx(
        t.bg,
        "flex justify-around items-center w-full p-4",
        className
      )}
    >
      {/* لیست لینک‌ها */}
      <ul className="flex flex-row gap-10">
        {items.map((item) => (
          <NavbarListItem
            key={item.to}
            to={item.to}
            label={item.label}
            currentPath={currentPath}
            theme={theme}
          />
        ))}
      </ul>

      {/* سمت راست: ورود یا منوی کاربر */}
      {isLoggedIn ? (
        <DropdownMenu.Root dir="rtl" modal={false}>
          <DropdownMenu.Trigger asChild>
            <button
              className={clsx(
                "group shadow-md text-sm flex items-center gap-2 font-semibold rounded-full py-1 px-3 cursor-pointer hover:scale-105 hover:shadow-lg data-[state=open]:scale-105 data-[state=open]:shadow-lg transition-all duration-300",
                t.border,
                t.accent,
                t.text
              )}
            >
              <AvatarIcon className="w-5 h-5" />
              {userName}
              <ChevronDownIcon className="w-3 h-3 transition-transform duration-500 group-data-[state=open]:rotate-180" />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              className="bg-white shadow-lg flex flex-col rounded-md py-2 px-4 min-w-[150px] text-center"
              sideOffset={5}
            >
              <DropdownMenu.Arrow className="fill-white" />
              {userMenuItems.map((menuItem) => (
                <DropdownMenu.Item key={menuItem.to} asChild>
                  <Link
                    to={menuItem.to}
                    className="text-sm text-gray-800 hover:text-blue-600 transition font-semibold"
                  >
                    {menuItem.label}
                  </Link>
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      ) : (
        <Link
          to="/login"
          className={clsx(
            "text-sm font-semibold rounded-full py-1 px-4 shadow-md hover:scale-105 hover:shadow-lg transition-all duration-300",
            t.border,
            t.accent,
            t.text
          )}
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
  theme,
}: {
  to: string;
  label: string;
  currentPath: string;
  theme: keyof typeof themes;
}) => {
  const t = themes[theme];
  return (
    <li>
      <Link
        to={to}
        className={clsx(
          t.text,
          "font-semibold transition duration-300 ease-in-out hover:scale-105",
          currentPath === to
            ? `underline underline-offset-8 scale-105 decoration-2 ${t.activeUnderline}`
            : ""
        )}
      >
        {label}
      </Link>
    </li>
  );
};

export default NavBar;
