import { cva, VariantProps } from "class-variance-authority";
import React from "react";
import { cn } from "~/utils";

const buttonVariants = cva(
  "inline-flex items-center bg-blue-600 font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 active:translate-y-0.5 transition-transform duration-200 ease-in-out",
  {
    variants: {
      variant: {
        default: "",
        unstyled: "border-none rounded-none",
        secondary:
          "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50",
      },
      size: {
        default: "text-sm py-2 px-3 rounded-md",
        sm: "text-xs py-1 px-2 rounded-md",
        lg: "text-md py-2 px-4 rounded-lg",
        xl: "text-lg py-3 px-5 rounded-xl",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "size">,
    VariantProps<typeof buttonVariants> {
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
        ref={ref}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
