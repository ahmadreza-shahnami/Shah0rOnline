import clsx from "clsx";
import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router";

const HamburgerBar = ({ className }: { className?: string }) => {
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

  // Lock scroll when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <nav className={clsx("relative isolate z-[100]", className)}>
      {/* Hamburger Button - Always visible */}
      <HamburgerButton open={open} setOpen={setOpen} />

      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className={clsx(
            "fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300",
            open ? "visible opacity-100" : "invisible opacity-0"
          )}
        />
      )}

      {/* Slide-in Panel */}
      <div
        ref={panelRef}
        className={clsx(
          "fixed top-0 right-0 z-50 h-full w-64 bg-cyan-50/75 px-6 py-8 shadow-lg transition-transform duration-300 ease-in-out lg:hidden",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <ul className="space-y-4 text-xl font-medium">
          <NavLink route={"/"} label={"خانه"} setOpen={setOpen} />
        </ul>
      </div>
    </nav>
  );
};

const HamburgerButton = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        setOpen((prev) => !prev);
      }}
      className={clsx(
        "group fixed top-2 right-3 z-[60] flex h-10 w-10 flex-col items-center justify-center gap-[6px] rounded bg-cyan-100 transition-all duration-300 ease-in-out lg:hidden ",
        open ? "rounded-full bg-cyan-700" : ""
      )}
    >
      <span
        className={clsx(
          "block h-[2px] w-6 origin-center bg-gray-800 transition-all duration-300 ",
          open ? "translate-y-[8px] rotate-45 bg-white" : ""
        )}
      />
      <span
        className={clsx(
          "block h-[2px] w-6 bg-gray-800 transition-all duration-300 ",
          open ? "bg-white opacity-0" : ""
        )}
      />
      <span
        className={clsx(
          "block h-[2px] w-6 origin-center bg-gray-800 transition-all duration-300 ",
          open ? "-translate-y-[8px] -rotate-45 bg-white" : ""
        )}
      />
    </button>
  );
};
const linkActiveClassame = "cursor-default font-semibold text-cyan-950 opacity";
const NavLink = ({
  route,
  label,
  setOpen,
}: {
  route: string;
  label: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const location = useLocation();
  const path = location.pathname;
  return (
    <li>
      <Link
        onClick={() => setOpen(false)}
        className={clsx(
          "block w-full text-left transition-colors hover:text-cyan-950 ",
          route === path ? linkActiveClassame : ""
        )}
        to={route}
      >
        {label}
      </Link>
    </li>
  );
};

export default HamburgerBar;
