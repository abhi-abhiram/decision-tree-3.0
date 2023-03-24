import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
interface Item {
  id: number;
  label: string;
}

type SearchFilter = (
  query: string,
  items: Item[],
  keysToSearch: string[]
) => Item[];
