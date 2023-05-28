import { cva, type VariantProps } from "class-variance-authority";
import React from "react";
import { cn } from "~/utils";

const textareaVariants = cva(
  "w-full text-md leading-5 text-gray-900 outline-none bg-white rounded-lg",
  {
    variants: {
      variant: {
        default:
          "transition-colors ease-in-out duration-200 border border-gray-200",
        unstyled: "outline-none rounded-none",
        error: "outline-red-500",
        flushed:
          "border-2 border-gray-200 pl-0 focus:outline-none focus:border-blue-500 rounded",
      },
      size: {
        default: "text-md p-2",
        sm: "text-sm p-1",
        lg: "text-lg p-3",
        xl: "text-xl p-4",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size">,
    VariantProps<typeof textareaVariants> {
  rightIcon?: React.ReactNode;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, children, variant, size, ...props }, ref) => {
    return (
      <textarea
        className={cn(textareaVariants({ variant, size, className }))}
        {...props}
        ref={ref}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea, textareaVariants };
