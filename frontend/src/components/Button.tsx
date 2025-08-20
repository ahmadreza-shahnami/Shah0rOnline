import type React from "react";
import { clsx } from "clsx";

interface button {
  type?: "button" | "submit" | "reset";
  style?: "normal" | "danger" | "submit" | "sucess";
  text: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
}

const Button = ({
  type = "button",
  style = "normal",
  text,
  onClick = () => {},
  disabled = false,
}: button) => {
  let className = "";
  if (style === "submit") {
    className =
      "bg-blue-600 shadow-sm hover:bg-blue-800 hover:shadow-lg hover:scale-105";
  } else if (style === "normal") {
    className =
      "bg-gray-400 shadow-sm hover:bg-gray-500 hover:shadow-lg hover:scale-105";
  }

  return (
    <button
      type={type}
      className={clsx(
        "transition-all duration-200 ease-in-out text-white pb-1.5 pt-0.5 px-4 rounded w-fit cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default Button;
