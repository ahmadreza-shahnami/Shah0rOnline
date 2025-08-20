import clsx from "clsx";
import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router";

type NavLinkType = { to: string; label: string };

type ThemeType = "default" | "school";

const THEME_STYLES = {
  default: {
    bg: "bg-cyan-50/75",
    text: "text-gray-800",
    hover: "hover:text-cyan-950",
    buttonBg: "bg-cyan-100",
    buttonActiveBg: "bg-cyan-700",
  },
  school: {
    bg: "bg-green-50/90",
    text: "text-green-900",
    hover: "hover:text-green-600",
    buttonBg: "bg-green-100",
    buttonActiveBg: "bg-green-500",
  },
};

export default function HamburgerMenu({
  links,
  theme = "default",
  className,
}: {
  links: NavLinkType[];
  theme?: ThemeType;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

  const styles = THEME_STYLES[theme];

  // Lock scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <nav className={clsx("relative isolate z-[1010]", className)}>
      {/* Hamburger Button */}
      <HamburgerButton open={open} setOpen={setOpen} styles={styles} />

      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300"
        />
      )}

      {/* Slide-in Panel */}
      <div
        ref={panelRef}
        className={clsx(
          "fixed top-0 right-0 z-50 h-full w-64 px-6 py-8 shadow-lg transition-transform duration-300 ease-in-out lg:hidden",
          styles.bg,
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <ul className="space-y-4 text-xl font-medium">
          {links.map((link) => (
            <NavItem
              key={link.to}
              to={link.to}
              label={link.label}
              setOpen={setOpen}
              styles={styles}
            />
          ))}
        </ul>
      </div>
    </nav>
  );
}

function HamburgerButton({
  open,
  setOpen,
  styles,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  styles: any;
}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        setOpen((prev) => !prev);
      }}
      className={clsx(
        "group fixed top-2 right-3 z-[60] flex h-10 w-10 flex-col items-center justify-center gap-[6px] rounded transition-all duration-300 ease-in-out lg:hidden",
        styles.buttonBg,
        open ? `rounded-full ${styles.buttonActiveBg}` : ""
      )}
    >
      <span
        className={clsx(
          "block h-[2px] w-6 origin-center bg-gray-800 transition-all duration-300",
          open ? "translate-y-[8px] rotate-45 bg-white" : ""
        )}
      />
      <span
        className={clsx(
          "block h-[2px] w-6 bg-gray-800 transition-all duration-300",
          open ? "bg-white opacity-0" : ""
        )}
      />
      <span
        className={clsx(
          "block h-[2px] w-6 origin-center bg-gray-800 transition-all duration-300",
          open ? "-translate-y-[8px] -rotate-45 bg-white" : ""
        )}
      />
    </button>
  );
}

function NavItem({
  to,
  label,
  setOpen,
  styles,
}: {
  to: string;
  label: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  styles: any;
}) {
  const location = useLocation();
  const path = location.pathname;
  const isActive = path === to;

  return (
    <li>
      <Link
        onClick={() => setOpen(false)}
        className={clsx(
          "block w-full text-left transition-colors",
          styles.text,
          styles.hover,
          isActive ? "font-semibold opacity-80" : ""
        )}
        to={to}
      >
        {label}
      </Link>
    </li>
  );
}
