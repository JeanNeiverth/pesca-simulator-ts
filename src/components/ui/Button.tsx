import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export const Button = ({ className, ...props }: ButtonProps) => {
  return (
    <button
      type="button"
      className={clsx(
        "flex items-center justify-center text-lg bg-yellow-500 border-2 border-black p-3 rounded-full hover:bg-yellow-400",
        className
      )}
      {...props}
    ></button>
  );
};
