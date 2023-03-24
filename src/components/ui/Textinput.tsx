import { Input } from "./Input";
import { cva, VariantProps } from "class-variance-authority";
import React from "react";
import { cn } from "~/utils";

const textinputVariants = cva("relative w-full text-gray-400 bg-white", {
  variants: {
    variant: {
      default:
        "border-2 border-gray-300 rounded-lg focus-within:border-blue-300 focus-within:text-blue-500 transition-colors ease-in-out duration-200",
      error:
        "border-2 border-red-600 rounded-lg focus-within:border-red-600 text-red-600",
    },
    size: {
      default: "h-10 px-3",
      sm: "text-sm h-8 px-2",
      lg: "text-lg h-12 px-4",
      xl: "text-xl h-14 px-5",
    },
    leftIconSize: {
      default: "pl-10",
      sm: "pl-8",
      lg: "pl-12",
      xl: "pl-14",
    },
    rightIconSize: {
      default: "pr-10",
      sm: "pr-8",
      lg: "pr-12",
      xl: "pr-14",
    },
  },

  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export interface TextinputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof textinputVariants> {
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  error?: string;
}

export const Textinput = React.forwardRef<HTMLInputElement, TextinputProps>(
  (
    {
      className,
      children,
      variant,
      size,
      error,
      rightIcon,
      leftIcon,
      ...props
    },
    ref
  ) => {
    return (
      <div
        className={cn(
          textinputVariants({
            variant,
            size,
            className,
            leftIconSize: leftIcon ? size ?? "default" : undefined,
            rightIconSize: rightIcon ? size ?? "default" : undefined,
          })
        )}
      >
        {leftIcon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 ">
            {leftIcon}
          </div>
        )}
        <Input
          {...props}
          ref={ref}
          variant="unstyled"
          className="peer h-full p-0 "
        />
        {rightIcon && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            {rightIcon}
          </div>
        )}
        {error && <p className="mt-2 text-sm ">{error}</p>}
      </div>
    );
  }
);
