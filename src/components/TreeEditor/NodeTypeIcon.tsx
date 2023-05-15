import {
  ArrowRightCircleIcon,
  Bars3CenterLeftIcon,
  CalendarIcon,
  ChevronUpDownIcon,
  CubeTransparentIcon,
} from "@heroicons/react/20/solid";
import { type BridgeType, type NodeType } from "@prisma/client";
import { cn } from "~/utils";

export function NodeTypeIcon(props: {
  type: NodeType | BridgeType;
  className?: string;
}) {
  const icons: Record<(typeof props)["type"], React.ReactNode> = {
    MultiInput: (
      <span className="bg-greeen-400 flex items-center justify-center rounded-md bg-indigo-400 p-1 text-black">
        <Bars3CenterLeftIcon className={cn("h-5 w-5", props.className)} />
      </span>
    ),
    Date: (
      <span className="flex items-center justify-center rounded-md bg-blue-400 p-1 text-black">
        <CalendarIcon className={cn("h-5 w-5", props.className)} />
      </span>
    ),
    MultipleChoice: (
      <span className="flex items-center justify-center rounded-md bg-yellow-400 p-1 text-black">
        <ChevronUpDownIcon className={cn("h-5 w-5", props.className)} />
      </span>
    ),
    SingleInput: (
      <span className="flex items-center justify-center rounded-md bg-purple-400 p-1 text-black">
        <ArrowRightCircleIcon className={cn("h-5 w-5", props.className)} />
      </span>
    ),
    Number: (
      <span className="flex items-center justify-center rounded-md bg-teal-400 p-1 text-center text-xs text-black">
        <span className="flex h-5 w-5 items-center justify-center">123</span>
      </span>
    ),
    Select: (
      <span className="flex items-center justify-center rounded-md bg-orange-400 p-1 text-black">
        <ChevronUpDownIcon className={cn("h-5 w-5", props.className)} />
      </span>
    ),
    BridgeType: (
      <span className="flex items-center justify-center rounded-md bg-red-400 p-1 text-black">
        <CubeTransparentIcon className={cn("h-5 w-5", props.className)} />
      </span>
    ),
  };

  return <>{icons[props.type]}</>;
}
