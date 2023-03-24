import { cva, VariantProps } from "class-variance-authority";
import React from "react";
import { cn } from "~/utils";

const inputVariants = cva(
  "w-full text-md leading-5 text-gray-900 outline-none bg-white ",
  {
    variants: {
      variant: {
        default:
          "rounded-lg border-2 border-gray-300 focus-visible:border-blue-300 transition-colors  focus-visible:text-blue-500 ease-in-out duration-200 ",
        unstyled: "border-none rounded-none",
      },
      size: {
        default: "h-10 px-3",
        sm: "text-sm h-8 px-2",
        lg: "text-lg h-12 px-4",
        xl: "text-xl h-14 px-5",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, children, variant, size, ...props }, ref) => {
    return (
      <input
        className={cn(inputVariants({ variant, size, className }))}
        {...props}
        ref={ref}
      />
    );
  }
);

Input.displayName = "Input";

export { Input, inputVariants };
