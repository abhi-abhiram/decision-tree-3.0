import {
  ArrowRightCircleIcon,
  Bars3CenterLeftIcon,
  CalendarIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/20/solid";
import { type NodeType } from "@prisma/client";

const icons: Record<NodeType, React.ReactNode> = {
  Text: (
    <span className="bg-greeen-400 flex items-center justify-center rounded-md bg-indigo-400 p-1 text-black">
      <Bars3CenterLeftIcon className="h-5 w-5" />
    </span>
  ),
  Date: (
    <span className="flex items-center justify-center rounded-md bg-blue-400 p-1 text-black">
      <CalendarIcon className="h-5 w-5" />
    </span>
  ),
  MultipleChoice: (
    <span className="flex items-center justify-center rounded-md bg-yellow-400 p-1 text-black">
      <ChevronUpDownIcon className="h-5 w-5" />
    </span>
  ),
  SingleInput: (
    <span className="flex items-center justify-center rounded-md bg-purple-400 p-1 text-black">
      <ArrowRightCircleIcon className="h-5 w-5" />
    </span>
  ),
  Number: (
    <span className="flex items-center justify-center rounded-md bg-teal-400 p-1 text-center text-xs text-black">
      <span className="flex h-5 w-5 items-center justify-center">123</span>
    </span>
  ),
  Select: (
    <span className="flex items-center justify-center rounded-md bg-orange-400 p-1 text-black">
      <ChevronUpDownIcon className="h-5 w-5" />
    </span>
  ),
};

export function NodeTypeIcon(props: { type: NodeType }) {
  return <>{icons[props.type]}</>;
}