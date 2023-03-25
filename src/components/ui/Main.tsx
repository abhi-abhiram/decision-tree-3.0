import { DetailedHTMLProps, HTMLAttributes } from "react";
import { cn } from "~/utils";

export function Main({
  className,
  ...props
}: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>) {
  return (
    <main
      className={cn(
        "flex-1 overflow-hidden bg-gray-50 px-5 pb-5 pt-7",
        className
      )}
      {...props}
    />
  );
}
