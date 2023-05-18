import { Input } from "./Input";
import { cva, VariantProps } from "class-variance-authority";
import React from "react";
import { cn } from "~/utils";

const textinputVariants = cva("relative w-full text-gray-400 bg-white", {
  variants: {
    size: {
      default: "h-10 px-3",
      sm: "text-sm h-8 px-2",
      lg: "text-lg h-12 px-4",
      xl: "text-xl h-14 px-5",
    },
    variant: {
      default:
        "border-2 border-gray-300 rounded-lg focus-within:border-blue-500 transition-colors ease-in-out duration-200",
      error:
        "border-2 border-red-600 rounded-lg focus-within:border-red-600 text-red-600",
      flushed:
        "border-0 rounded-none border-b-2 pl-0 border-gray-300 focus-within:border-blue-500 transition-colors ease-in-out duration-200",
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
    isError: {
      true: "border-red-600 focus-within:border-red-600 [&>*]:text-red-600",
    },
  },

  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

const textinputLeftIconVariants = cva("absolute inset-y-0 left-0", {
  variants: {
    size: {
      default: "left-0 pl-3",
      sm: "left-0 pl-2",
      lg: "left-0 pl-4",
      xl: "left-0 pl-5",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

const textinputRightIconVariants = cva("absolute inset-y-0 right-0", {
  variants: {
    size: {
      default: "right-0 pr-3",
      sm: "right-0 pr-2",
      lg: "right-0 pr-4",
      xl: "right-0 pr-5",
    },
  },
});

export interface TextinputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof textinputVariants> {
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  error?: string;
  isRightIconClickable?: boolean;
  leftIconLoading?: boolean;
}

// eslint-disable-next-line react/display-name
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
      isRightIconClickable,
      leftIconLoading,
      isError,
      ...props
    },
    ref
  ) => {
    return (
      <div>
        <div
          className={cn(
            textinputVariants({
              size,
              variant,
              isError,
              className,
              leftIconSize: leftIcon ? size ?? "default" : undefined,
              rightIconSize: rightIcon ? size ?? "default" : undefined,
            })
          )}
        >
          {leftIcon && (
            <div
              className={cn(
                "pointer-events-none flex items-center pl-3 ",
                textinputLeftIconVariants({
                  size,
                })
              )}
            >
              {leftIconLoading ? (
                <div>
                  <svg
                    className="-ml-1 mr-3 h-5 w-5 animate-spin text-blue-700"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
              ) : (
                leftIcon
              )}
            </div>
          )}
          <Input
            {...props}
            ref={ref}
            variant="unstyled"
            className="peer h-full p-0"
          />
          {rightIcon && (
            <div
              className={cn(
                "flex items-center pr-3",
                isRightIconClickable ? "cursor-pointer" : "pointer-events-none",
                textinputRightIconVariants({
                  size,
                })
              )}
            >
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);
