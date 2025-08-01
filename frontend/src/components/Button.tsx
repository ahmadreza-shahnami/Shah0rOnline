import type React from "react";

interface button {
  type?: "button" | "submit" | "reset";
  style?: "normal" | "danger" | "submit" | "sucess";
  text: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const Button = ({
  type = "button",
  style = "normal",
  text,
  onClick = () => {},
}: button) => {
  let className = "";
  if (style === "submit") {
    className = "bg-blue-600 shadow-sm hover:bg-blue-800 hover:shadow-lg hover:scale-105"
  }
  return (
    <button
      type={type}
      className={`transition-all duration-200 ease-in-out text-white pb-1.5 pt-0.5 px-4 rounded w-fit cursor-pointer ${className}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;
